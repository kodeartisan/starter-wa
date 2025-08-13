// src/features/tools/backup-chat/helpers/exportUtils.ts
import wa from '@/libs/wa'
import { getContactName } from '@/utils/util'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
// ++ ADDED: Import jspdf and html2canvas
import jsPDF from 'jspdf'
import JSZip from 'jszip'
import _ from 'lodash'

interface ExporterParams {
  messages: any[]
  chat: any
  filename: string
  // Updated to be an array of media types to be included
  includeMediaTypes: string[]
  setProgress: (progress: { value: number; label: string }) => void
  validationRef: React.MutableRefObject<boolean>
}

// ++ ADDED: Helper function to generate the HTML for a quoted message block.
const renderQuotedMessage = (quotedMsg: any): string => {
  if (!quotedMsg) return ''
  const quotedSenderName = quotedMsg.sender.isMe
    ? 'You'
    : getContactName(quotedMsg.sender)
  let quotedContent = ''
  // Determine the content preview for the quoted message
  switch (quotedMsg.type) {
    case 'chat':
      quotedContent = _.escape(quotedMsg.body)
      break
    case 'image':
      quotedContent = '📷 Photo'
      break
    case 'video':
      quotedContent = '🎥 Video'
      break
    case 'document':
      quotedContent = `📄 ${_.escape(quotedMsg.filename) || 'Document'}`
      break
    case 'ptt':
      quotedContent = '🎤 Voice Message'
      break
    default:
      quotedContent = `[Unsupported message type: ${quotedMsg.type}]`
  }
  // The entire block is a link to the original message's ID.
  return `
    <a href="#message-${quotedMsg.id}" class="quoted-message-link">
        <div class="quoted-message">
            <div class="quoted-sender">${_.escape(quotedSenderName)}</div>
            <div class="quoted-content">${quotedContent}</div>
        </div>
    </a>
    `
}

// ++ ADDED: Centralized HTML body generation to avoid duplication.
// This function creates the core HTML content and gathers media files.
const generateHtmlBody = async ({
  messages,
  chat,
  includeMediaTypes,
  setProgress,
  validationRef,
  isForPdf = false, // Added flag to slightly alter output for PDF
}: ExporterParams & { isForPdf?: boolean }): Promise<{
  htmlBody: string
  mediaMap: Map<string, Blob>
}> => {
  const headerHtml = `
    <div class="export-header">
        <p><b>Chat With:</b> ${_.escape(getContactName(chat.data.contact))}</p>
        <p><b>Export Date:</b> ${new Date().toLocaleString()}</p>
        <p><b>Total Messages Exported:</b> ${messages.length}</p>
    </div>
    `
  let messagesHtml = ''
  const mediaMap = new Map<string, Blob>()

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]
    if (!['chat', 'image', 'video', 'document', 'ptt'].includes(msg.type))
      continue

    const progressValue = ((i + 1) / messages.length) * 90 // Reserve last 10%
    setProgress({
      value: progressValue,
      label: `Processing message ${i + 1} of ${messages.length}...`,
    })

    const direction = msg.contact.isMe ? 'out' : 'in'
    const senderName =
      !msg.fromMe && chat.data.isGroup
        ? msg.contact?.pushname || msg.contact?.formattedName || 'Unknown'
        : ''
    let mediaHtml = ''
    const isMediaMessage = ['image', 'video', 'document', 'ptt'].includes(
      msg.type,
    )
    const shouldIncludeThisMedia = includeMediaTypes.includes(msg.type)

    if (isMediaMessage && shouldIncludeThisMedia && !mediaMap.has(msg.id)) {
      setProgress({
        value: progressValue,
        label: `Downloading media for message ${
          i + 1
        }... (${msg.filename || msg.type})`,
      })
      const blob = await wa.chat.downloadMedia(msg.id)
      if (blob) {
        mediaMap.set(msg.id, blob)
        const mediaType = msg.type as 'image' | 'video' | 'document' | 'ptt'
        const extension = blob.type.split('/')[1] || 'bin'
        const mediaFilename = `${msg.id}.${extension}`
        const folderName = mediaType === 'ptt' ? 'audio' : `${mediaType}s`
        const filePath = `./${folderName}/${mediaFilename}`
        const blobUrl = URL.createObjectURL(blob)

        switch (msg.type) {
          case 'image':
            mediaHtml = `<img src="${
              isForPdf ? blobUrl : filePath
            }" alt="Image" />`
            break
          case 'video':
            mediaHtml = `<video controls src="${
              isForPdf ? blobUrl : filePath
            }"></video>`
            break
          case 'ptt':
            mediaHtml = `<audio controls src="${
              isForPdf ? blobUrl : filePath
            }"></audio>`
            break
          case 'document':
            mediaHtml = `<a href="${
              isForPdf ? '#' : filePath
            }" target="_blank">Download: ${
              _.escape(msg.filename) || 'Document'
            }</a>`
            break
        }
      }
    } else if (isMediaMessage) {
      const mediaType = msg.type === 'ptt' ? 'Audio' : msg.type
      mediaHtml = `<div class="media-placeholder">[${
        mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
      } not included]</div>`
    }

    const quotedHtml = renderQuotedMessage(msg.quotedMsg)
    messagesHtml += `
        <div class="message-cluster message-${direction}" id="message-${
          msg.id
        }">
            <div class="message">
                <div class="message-bubble">
                    ${
                      senderName
                        ? `<div class="sender-name">${_.escape(
                            senderName,
                          )}</div>`
                        : ''
                    }
                    <div class="message-content">
                        ${quotedHtml}
                        ${mediaHtml}
                        <span>${
                          _.escape(
                            msg.type === 'chat' ? msg.body : msg.caption,
                          ) ?? ''
                        }</span>
                        <span class="timestamp">${new Date(
                          msg.timestamp,
                        ).toLocaleTimeString([], {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</span>
                    </div>
                </div>
            </div>
        </div>
        `
  }

  return { htmlBody: headerHtml + messagesHtml, mediaMap }
}

// Function to get the full HTML document string
const getFullHtmlDocument = (bodyContent: string, chat: any) => {
  const styles = `
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; background-color: #E5DDD5; }
        .chat-container { max-width: 800px; margin: auto; padding: 20px; }
        .export-header { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #dee2e6; font-size: 0.9em; }
        .export-header h1 { margin: 0 0 10px 0; font-size: 1.5em; color: #005c4b; }
        .export-header p { margin: 2px 0; color: #333; }
        .export-header b { color: #111; }
        .message-cluster { display: flex; flex-direction: column; margin-bottom: 2px; padding: 0 9%; scroll-margin-top: 20px; }
        .message-cluster.message-out { align-items: flex-end; }
        .message-cluster.message-in { align-items: flex-start; }
        .message { max-width: 65%; word-wrap: break-word; margin-bottom: 10px; }
        .message-bubble { padding: 6px 9px; border-radius: 7.5px; box-shadow: 0 1px 0.5px rgba(11,20,26,.13); position: relative; }
        .message-out .message-bubble { background-color: #d9fdd3; color: #0f1010; }
        .message-in .message-bubble { background-color: #fff; color: #111b21; }
        .message-out .message-bubble::after { content: ''; position: absolute; top: 0px; right: -4px; width: 0px; height: 0px; border-top: 0px solid transparent; border-left: 8px solid #d9fdd3; border-bottom: 10px solid transparent; }
        .message-in .message-bubble::before { content: ''; position: absolute; top: 0px; left: -4px; width: 0px; height: 0px; border-top: 0px solid transparent; border-right: 8px solid #fff; border-bottom: 10px solid transparent; }
        .sender-name { font-size: 0.8rem; font-weight: 500; color: #028a76; margin-bottom: 4px; }
        .message-content img, .message-content video { width: 100%; max-width: 300px; border-radius: 6px; margin-top: 5px; display: block; }
        .message-content a { color: #0088cc; }
        .timestamp { font-size: 0.7rem; color: #667781; display: flex; justify-content: flex-end; padding-top: 4px; }
        .media-placeholder { padding: 10px; background-color: #f0f0f0; border: 1px dashed #ccc; border-radius: 6px; color: #888; font-style: italic; font-size: 0.9em; margin-top: 5px; text-align: center; }
        .quoted-message-link { text-decoration: none; color: inherit; }
        .quoted-message { background-color: #f0f2f5; border-left: 4px solid #4CAF50; padding: 8px 10px; margin-bottom: 5px; border-radius: 4px; opacity: 0.85; transition: opacity 0.2s; }
        .quoted-message:hover { opacity: 1; }
        .quoted-sender { font-weight: bold; font-size: 0.85em; color: #4CAF50; }
        .quoted-content { font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word; }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetElement = document.querySelector(this.getAttribute('href'));
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        targetElement.style.transition = 'none';
                        targetElement.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
                        setTimeout(() => {
                            targetElement.style.transition = 'background-color 0.5s';
                            targetElement.style.backgroundColor = '';
                        }, 1500);
                    }
                });
            });
        });
    </script>
    `

  return `
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Chat with ${_.escape(getContactName(chat.data.contact))}</title>
            ${styles}
        </head>
        <body><div class="chat-container">${bodyContent}</div></body>
    </html>
    `
}
// Main HTML Exporter
export const exportToHtml = async (params: ExporterParams) => {
  const { filename, setProgress } = params

  const { htmlBody, mediaMap } = await generateHtmlBody(params)
  const fullHtml = getFullHtmlDocument(htmlBody, params.chat)

  // Clean up blob URLs created for HTML generation
  mediaMap.forEach((blob, url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })

  if (mediaMap.size > 0 && params.includeMediaTypes.length > 0) {
    const zip = new JSZip()
    const mediaFolders: { [key: string]: JSZip | null } = {
      image: zip.folder('images'),
      video: zip.folder('videos'),
      document: zip.folder('documents'),
      ptt: zip.folder('audio'),
    }

    for (const [msgId, blob] of mediaMap.entries()) {
      const msg = params.messages.find((m) => m.id === msgId)
      if (msg && msg.type !== 'chat') {
        const mediaType = msg.type as 'image' | 'video' | 'document' | 'ptt'
        const folder = mediaFolders[mediaType]
        const extension = blob.type.split('/')[1] || 'bin'
        const mediaFilename = `${msg.id}.${extension}`
        folder?.file(mediaFilename, blob)
      }
    }

    zip.file(`${filename}.html`, fullHtml)
    setProgress({ value: 98, label: 'Compressing files...' })
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(zipBlob, `${filename}.zip`)
  } else {
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
    FileSaver.saveAs(blob, `${filename}.html`)
  }
}

// ++ ADDED: New PDF Exporter
export const exportToPdf = async (params: ExporterParams) => {
  const { filename, setProgress, validationRef } = params

  // Generate HTML with blob URLs for rendering, but don't include media for download
  const { htmlBody, mediaMap } = await generateHtmlBody({
    ...params,
    includeMediaTypes: ['image'], // PDF generation works best with just images
    isForPdf: true,
  })
  const fullHtml = getFullHtmlDocument(htmlBody, params.chat)

  if (!validationRef.current) {
    // Clean up blobs if cancelled during generation
    mediaMap.forEach((blob, url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
    })
    return
  }

  setProgress({ value: 92, label: 'Generating PDF document...' })

  // Create a temporary, off-screen div to render the HTML for capturing
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px' // Position off-screen
  container.style.width = '800px' // Set a fixed width for consistent rendering
  document.body.appendChild(container)
  container.innerHTML = fullHtml

  try {
    const canvas = await html2canvas(container, {
      useCORS: true, // Important for images from blob URLs
      scale: 2, // Increase resolution
    })

    // Clean up the off-screen container and blob URLs
    document.body.removeChild(container)
    mediaMap.forEach((blob, url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
    })

    if (!validationRef.current) return

    setProgress({ value: 95, label: 'Formatting PDF pages...' })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const ratio = canvasWidth / pdfWidth
    const canvasHeightInPdf = canvasHeight / ratio

    let heightLeft = canvasHeightInPdf
    let position = 0

    // Add the first page
    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      pdfWidth,
      canvasHeightInPdf,
      undefined,
      'FAST',
    )
    heightLeft -= pdfHeight

    // Add new pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - canvasHeightInPdf
      pdf.addPage()
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        pdfWidth,
        canvasHeightInPdf,
        undefined,
        'FAST',
      )
      heightLeft -= pdfHeight
    }

    setProgress({ value: 98, label: 'Saving PDF file...' })
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
    mediaMap.forEach((blob, url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
    })
    throw new Error('Failed to generate PDF from chat content.')
  }
}
