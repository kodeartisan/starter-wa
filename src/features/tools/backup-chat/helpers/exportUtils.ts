// src/features/tools/chat-backup/helpers/exportUtils.ts
import wa from '@/libs/wa'
import { getContactName } from '@/utils/util'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import _ from 'lodash'

interface ExporterParams {
  messages: any[]
  chat: any
  filename: string
  // Updated to be an array of media types
  includeMediaTypes: string[]
  setProgress: (progress: { value: number; label: string }) => void
  validationRef: React.MutableRefObject<boolean>
}

// Helper function to generate the HTML for a quoted message block.
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

// Main HTML Exporter
export const exportToHtml = async ({
  messages,
  chat,
  filename,
  includeMediaTypes, // Use the array of media types
  setProgress,
  validationRef,
}: ExporterParams) => {
  const styles = `
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; background-color: #E5DDD5; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaUAAAFaAQMAAAAPp1JDAAAABlBMVEXr8vT2+fu2qpt9AAAAAWJLR0QCZgtT6AAAA0NJREFUGBntV/tto1QYnptgVqQY8/8/Gjso0mBGM0qMUGvMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEf-qG459KAAAAAElFTkSuQmCC'); background-repeat: repeat; }
            .chat-container { max-width: 800px; margin: auto; padding: 20px; }
            .message-cluster { display: flex; flex-direction: column; margin-bottom: 2px; padding: 0 9%; scroll-margin-top: 10px; }
            .message-cluster.message-out { align-items: flex-end; }
            .message-cluster.message-in { align-items: flex-start; }
            .message { max-width: 65%; word-wrap: break-word; margin-bottom: 10px; }
            .message-bubble { padding: 6px 9px; border-radius: 7.5px; box-shadow: 0 1px 0.5px rgba(11,20,26,.13); position: relative; }
            .message-out .message-bubble { background-color: #d9fdd3; color: #0f1010; }
            .message-in .message-bubble { background-color: #fff; color: #111b21; }
            .message-out .message-bubble::after { content: ''; position: absolute; top: 0px; right: -4px; width: 0px; height: 0px; border-top: 0px solid transparent; border-left: 8px solid #d9fdd3; border-bottom: 10px solid transparent; }
            .message-in .message-bubble::before { content: ''; position: absolute; top: 0px; left: -4px; width: 0px; height: 0px; border-top: 0px solid transparent; border-right: 8px solid #fff; border-bottom: 10px solid transparent; }
            .sender-name { font-size: 0.8rem; font-weight: 500; color: #028a76; margin-bottom: 4px; }
            .message-content { }
            .message-content img, .message-content video, .message-content { width: 100%; max-width: 300px; border-radius: 6px; margin-top: 5px; display: block; }
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
  let htmlContent = `
        <html>
            <head>
                <meta charset="UTF-8">
                ${styles}
            </head>
            <body>
                <div class="chat-container">
    `
  const includeAnyMedia = includeMediaTypes.length > 0
  const zip = includeAnyMedia ? new JSZip() : null
  const mediaFolder = zip?.folder('media')

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]

    if (!['chat', 'image', 'video', 'document', 'ptt'].includes(msg.type))
      continue

    const progressValue = ((i + 1) / messages.length) * 100
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

    if (includeAnyMedia && isMediaMessage && shouldIncludeThisMedia) {
      const blob = await wa.chat.downloadMedia(msg.id)
      if (blob) {
        const mediaFilename = `${msg.id}.${blob.type.split('/')[1] || 'bin'}`
        mediaFolder?.file(mediaFilename, blob)
        switch (msg.type) {
          case 'image':
            mediaHtml = `<img src="./media/${mediaFilename}" alt="Image" />`
            break
          case 'video':
            mediaHtml = `<video controls src="./media/${mediaFilename}"></video>`
            break
          case 'ptt':
            mediaHtml = `<audio controls src="./media/${mediaFilename}"></audio>`
            break
          case 'document':
            mediaHtml = `<a href="./media/${mediaFilename}" target="_blank">Download: ${
              _.escape(msg.filename) || 'Document'
            }</a>`
            break
        }
      } else {
        const mediaType = msg.type === 'ptt' ? 'Audio' : msg.type
        mediaHtml = `<div class="media-placeholder">[${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} not found]</div>`
      }
    }

    const quotedHtml = renderQuotedMessage(msg.quotedMsg)

    htmlContent += `
            <div class="message-cluster message-${direction}" id="message-${msg.id}">
                <div class="message">
                    <div class="message-bubble">
                        ${senderName ? `<div class="sender-name">${_.escape(senderName)}</div>` : ''}
                        <div class="message-content">
                            ${quotedHtml}
                            ${mediaHtml}
                            <span>${_.escape(msg.type === 'chat' ? msg.body : msg.caption) ?? ''}</span>
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
  htmlContent += `</div></body></html>`

  if (zip) {
    zip.file(`${filename}.html`, htmlContent)
    setProgress({ value: 100, label: 'Compressing files...' })
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(zipBlob, `${filename}.zip`)
  } else {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    FileSaver.saveAs(blob, `${filename}.html`)
  }
}
