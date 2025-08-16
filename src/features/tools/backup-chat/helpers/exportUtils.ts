// src/features/tools/backup-chat/helpers/exportUtils.ts
import wa from '@/libs/wa'
import { generateVideoThumbnail, getContactName } from '@/utils/util'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import JSZip from 'jszip'
import _ from 'lodash'

interface ExporterParams {
  messages: any[]
  chat: any
  filename: string
  includeMediaTypes: string[]
  setProgress: (progress: { value: number; label: string }) => void
  validationRef: React.MutableRefObject<boolean>
  isLimitApplied?: boolean
  password?: string
}

const renderQuotedMessage = (quotedMsg: any): string => {
  if (!quotedMsg) return ''
  const quotedSenderName = quotedMsg.sender.isMe
    ? 'You'
    : getContactName(quotedMsg.sender)
  let quotedContent = ''
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
  return `
    <a href="#message-${quotedMsg.id}" class="quoted-message-link">
      <div class="quoted-message">
        <div class="quoted-sender">${_.escape(quotedSenderName)}</div>
        <div class="quoted-content">${quotedContent}</div>
      </div>
    </a>
    `
}

const getLimitNoticeHtml = (): string => {
  return `
  <div class="limit-notice">
    <b></b> Only the first 10 messages are shown. Upgrade to Pro to view all content.
  </div>
  `
}

const generateHtmlBody = async ({
  messages,
  chat,
  includeMediaTypes,
  setProgress,
  validationRef,
  isForPdf = false,
  isLimitApplied = false,
}: ExporterParams & { isForPdf?: boolean }): Promise<{
  htmlBody: string
  mediaMap: Map<string, Blob>
}> => {
  const headerHtml = `
    <div class="export-header">
      <p><b>Chat With:</b> ${_.escape(getContactName(chat.data.contact))}</p>
      <p><b>Export Date:</b> ${new Date().toLocaleString()}</p>
      <p><b>Total Messages Exported:</b> ${messages.length}</p>
      ${isLimitApplied ? getLimitNoticeHtml() : ''}
    </div>
    `
  let messagesHtml = ''
  const mediaMap = new Map<string, Blob>()

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]
    if (
      !['chat', 'image', 'video', 'document', 'ptt', 'location'].includes(
        msg.type,
      )
    )
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

    if (
      isMediaMessage &&
      shouldIncludeThisMedia &&
      !mediaMap.has(msg.id) &&
      !msg.isRedacted
    ) {
      setProgress({
        value: progressValue,
        label: `Downloading media for message ${i + 1}... (${
          msg.filename || msg.type
        })`,
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
            if (isForPdf) {
              //@ts-ignore
              const thumb = await generateVideoThumbnail(blob)
              mediaHtml = `<div class="video-thumb-container"><img src="${thumb}" alt="Video Thumbnail" /><div class="play-button">▶</div></div>`
            } else {
              mediaHtml = `<video controls src="${filePath}"></video>`
            }
            break
          case 'ptt':
            if (isForPdf) {
              const duration = new Date(msg.duration * 1000)
                .toISOString()
                .substr(14, 5)
              mediaHtml = `<div class="media-placeholder">🎤 Voice Message (${duration})</div>`
            } else {
              mediaHtml = `<audio controls src="${filePath}"></audio>`
            }
            break
          case 'document':
            if (isForPdf) {
              mediaHtml = `<div class="media-placeholder">📄 ${
                _.escape(msg.filename) || 'Document'
              }</div>`
            } else {
              mediaHtml = `<a href="${filePath}" target="_blank">Download: ${
                _.escape(msg.filename) || 'Document'
              }</a>`
            }
            break
        }
      }
    } else if (isMediaMessage) {
      const mediaType = msg.type === 'ptt' ? 'Audio' : msg.type
      let placeholderText = `[${
        mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
      } not included]`
      if (msg.isRedacted) {
        placeholderText = `[Upgrade to Pro to view this media]`
      }
      mediaHtml = `<div class="media-placeholder">${placeholderText}</div>`
    }

    const quotedHtml = renderQuotedMessage(msg.quotedMsg)

    messagesHtml += `
      <div class="message-cluster message-${direction}" id="message-${msg.id}">
        <div class="message">
          <div class="message-bubble">
            ${
              senderName
                ? `<div class="sender-name">${_.escape(senderName)}</div>`
                : ''
            }
            <div class="message-content">
              ${quotedHtml}
              ${mediaHtml}
              <span>${
                _.escape(msg.type === 'chat' ? msg.body : msg.caption) ?? ''
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

const getFullHtmlDocument = (bodyContent: string, chat: any) => {
  const styles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; background-color: #E5DDD5; }
      .chat-container { max-width: 800px; margin: auto; padding: 20px; }
      .export-header { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #dee2e6; font-size: 0.9em; }
      .export-header p { margin: 2px 0; color: #333; }
      .export-header b { color: #111; }
      .limit-notice {
        background-color: #fffbe6;
        border: 1px solid #ffe58f;
        border-radius: 4px;
        padding: 10px;
        margin-top: 10px;
        font-size: 0.85em;
        text-align: center;
        color: #856404;
      }
      .message-cluster { display: flex; flex-direction: column; margin-bottom: 2px; padding: 0 9%; scroll-margin-top: 20px; }
      .message-cluster.message-out { align-items: flex-end; }
      .message-cluster.message-in { align-items: flex-start; }
      .message { max-width: 65%; word-wrap: break-word; margin-bottom: 10px; }
      .message-bubble { padding: 6px 9px; border-radius: 7.5px; box-shadow: 0 1px 0.5px rgba(11,20,26,.13); position: relative; }
      .message-out .message-bubble { background-color: #d9fdd3; color: #0f1010; }
      .message-in .message-bubble { background-color: #fff; color: #111b21; }
      .sender-name { font-size: 0.8rem; font-weight: 500; color: #028a76; margin-bottom: 4px; }
      .message-content img, .message-content video { width: 100%; max-width: 300px; border-radius: 6px; margin-top: 5px; display: block; }
      .message-content a { color: #0088cc; }
      .timestamp { font-size: 0.7rem; color: #667781; display: flex; justify-content: flex-end; padding-top: 4px; }
      .media-placeholder { padding: 10px; background-color: #f0f0f0; border: 1px dashed #ccc; border-radius: 6px; color: #888; font-style: italic; font-size: 0.9em; margin-top: 5px; text-align: center; }
      .quoted-message-link { text-decoration: none; color: inherit; }
      .quoted-message { background-color: #f0f2f5; border-left: 4px solid #4CAF50; padding: 8px 10px; margin-bottom: 5px; border-radius: 4px; opacity: 0.85; }
      .quoted-sender { font-weight: bold; font-size: 0.85em; color: #4CAF50; }
      .quoted-content { font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word; }
      .video-thumb-container { position: relative; display: inline-block; }
      .video-thumb-container img { display: block; width: 100%; max-width: 300px; border-radius: 6px; }
      .video-thumb-container .play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: white; background-color: rgba(0, 0, 0, 0.5); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; text-shadow: 1px 1px 2px black;}
    </style>
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

export const exportToHtml = async (params: ExporterParams) => {
  const { filename, setProgress, password } = params
  const { htmlBody, mediaMap } = await generateHtmlBody(params)
  const fullHtml = getFullHtmlDocument(htmlBody, params.chat)

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

    const zipOptions: any = { type: 'blob' }
    if (password) {
      zipOptions.password = password
    }
    const zipBlob = await zip.generateAsync(zipOptions)
    //@ts-ignore
    FileSaver.saveAs(zipBlob, `${filename}.zip`)
  } else {
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
    FileSaver.saveAs(blob, `${filename}.html`)
  }
}

export const exportToPdf = async (params: ExporterParams) => {
  const { filename, setProgress, validationRef } = params
  const { htmlBody, mediaMap } = await generateHtmlBody({
    ...params,
    includeMediaTypes: ['image', 'video'],
    isForPdf: true,
  })
  const fullHtml = getFullHtmlDocument(htmlBody, params.chat)

  if (!validationRef.current) {
    mediaMap.forEach((blob, url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
    })
    return
  }

  setProgress({ value: 92, label: 'Generating PDF document...' })

  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = '800px'
  document.body.appendChild(container)
  container.innerHTML = fullHtml

  try {
    const canvas = await html2canvas(container, { useCORS: true, scale: 2 })
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

export const exportToTxt = async (params: ExporterParams) => {
  const {
    messages,
    chat,
    filename,
    setProgress,
    validationRef,
    isLimitApplied,
  } = params
  let textContent = `Chat With: ${getContactName(chat.data.contact)}\r\n`
  textContent += `Export Date: ${new Date().toLocaleString()}\r\n`
  textContent += `Total Messages Exported: ${messages.length}\r\n\r\n`

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]
    setProgress({
      value: ((i + 1) / messages.length) * 100,
      label: `Processing message ${i + 1} of ${messages.length}...`,
    })

    const sender = msg.contact.isMe ? 'You' : getContactName(msg.contact)
    const timestamp = new Date(msg.timestamp).toLocaleString()
    let content = ''

    switch (msg.type) {
      case 'chat':
        content = msg.body
        break
      case 'image':
        content = msg.isRedacted
          ? `[Upgrade to Pro to view this media]`
          : `[Image: ${msg.filename || 'image.jpg'}]`
        if (msg.caption) content += `\r\n${msg.caption}`
        break
      case 'video':
        content = msg.isRedacted
          ? `[Upgrade to Pro to view this media]`
          : `[Video: ${msg.filename || 'video.mp4'}]`
        if (msg.caption) content += `\r\n${msg.caption}`
        break
      case 'document':
        content = msg.isRedacted
          ? `[Upgrade to Pro to view this media]`
          : `[Document: ${msg.filename || 'file'}]`
        if (msg.caption) content += `\r\n${msg.caption}`
        break
      case 'ptt':
        const duration = new Date(msg.duration * 1000)
          .toISOString()
          .substr(14, 5)
        content = msg.isRedacted
          ? `[Upgrade to Pro to view this media]`
          : `[Voice Message: ${duration}]`
        break
      default:
        content = `[${msg.type}]`
        break
    }
    if (msg.quotedMsg) {
      const quotedSender = msg.quotedMsg.sender.isMe
        ? 'You'
        : getContactName(msg.quotedMsg.sender)
      const quotedContent = _.truncate(
        msg.quotedMsg.body || `[${msg.quotedMsg.type}]`,
        { length: 40 },
      )
      content = `[Quoting ${quotedSender}: "${quotedContent}"]\r\n${content}`
    }

    textContent += `[${timestamp}] ${sender}: ${content}\r\n\r\n`
  }

  if (validationRef.current) {
    if (isLimitApplied) {
      textContent += `\r\n\r\n---\r\nUpgrade to Pro to view all content.\r\n---`
    }
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(blob, `${filename}.txt`)
  }
}

export const exportToJson = async (params: ExporterParams) => {
  const {
    messages,
    chat,
    filename,
    setProgress,
    validationRef,
    isLimitApplied,
  } = params
  const messageList: object[] = []

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]
    setProgress({
      value: ((i + 1) / messages.length) * 100,
      label: `Processing message ${i + 1} of ${messages.length}...`,
    })

    let bodyContent = msg.body || null
    if (msg.type !== 'chat') {
      if (msg.isRedacted) {
        bodyContent = `[Upgrade to Pro to view this media]`
      } else {
        let placeholder = `[${msg.type}]`
        if (msg.filename) {
          placeholder = `[${msg.type}: ${msg.filename}]`
        } else if (msg.type === 'ptt' && msg.duration) {
          const duration = new Date(msg.duration * 1000)
            .toISOString()
            .substr(14, 5)
          placeholder = `[Voice Message: ${duration}]`
        }
        bodyContent = placeholder
      }
    }

    messageList.push({
      id: msg.id,
      timestamp: new Date(msg.timestamp).toISOString(),
      sender: {
        name: msg.contact.isMe ? 'You' : getContactName(msg.contact),
        id: msg.from,
        isMe: msg.contact.isMe,
      },
      type: msg.type,
      body: bodyContent,
      caption: msg.caption || null,
      filename: msg.isRedacted ? null : msg.filename || null,
      quotedMessage: msg.quotedMsg
        ? {
            id: msg.quotedMsg.id,
            sender: getContactName(msg.quotedMsg.sender),
            body: msg.quotedMsg.body || `[${msg.quotedMsg.type}]`,
          }
        : null,
    })
  }

  if (validationRef.current) {
    const finalJson = {
      metadata: {
        chatWith: getContactName(chat.data.contact),
        chatId: chat.data.id,
        exportDate: new Date().toISOString(),
        totalMessages: messages.length,
        ...(isLimitApplied && {
          notice:
            'Free Preview Limit Reached. Upgrade to Pro for full content.',
        }),
      },
      messages: messageList,
    }
    const jsonString = JSON.stringify(finalJson, null, 2)
    const blob = new Blob([jsonString], {
      type: 'application/json;charset=utf-8',
    })
    FileSaver.saveAs(blob, `${filename}.json`)
  }
}

export const exportToMarkdown = async (params: ExporterParams) => {
  const {
    messages,
    chat,
    filename,
    setProgress,
    validationRef,
    isLimitApplied,
  } = params
  let mdContent = `# Chat with: ${getContactName(chat.data.contact)}\n\n`
  mdContent += `**Export Date:** ${new Date().toLocaleString()}\n`
  mdContent += `**Total Messages:** ${messages.length}\n\n---\n\n`

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]
    setProgress({
      value: ((i + 1) / messages.length) * 100,
      label: `Processing message ${i + 1} of ${messages.length}...`,
    })

    const senderName = msg.contact.isMe ? 'You' : getContactName(msg.contact)
    const timestamp = new Date(msg.timestamp).toLocaleString()

    mdContent += `**${_.escape(senderName)}** (*${timestamp}*)\n\n`
    if (msg.quotedMsg) {
      const quotedSenderName = msg.quotedMsg.sender.isMe
        ? 'You'
        : getContactName(msg.quotedMsg.sender)
      const quotedBody = _.truncate(
        msg.quotedMsg.body || `[${msg.quotedMsg.type}]`,
        { length: 80 },
      )
      mdContent += `> > **${_.escape(quotedSenderName)}**: ${_.escape(
        quotedBody,
      )}\n\n`
    }

    let mdMessageContent = ''
    switch (msg.type) {
      case 'chat':
        mdMessageContent = msg.body.replace(/\n/g, ' \n') // Markdown line breaks
        break
      case 'image':
        mdMessageContent = msg.isRedacted
          ? `*[Upgrade to Pro to view this media]*`
          : `*Image: \`${_.escape(msg.filename)}\`*`
        if (msg.caption) mdMessageContent += `\n> ${_.escape(msg.caption)}`
        break
      case 'video':
        mdMessageContent = msg.isRedacted
          ? `*[Upgrade to Pro to view this media]*`
          : `*Video: \`${_.escape(msg.filename)}\`*`
        if (msg.caption) mdMessageContent += `\n> ${_.escape(msg.caption)}`
        break
      case 'document':
        mdMessageContent = msg.isRedacted
          ? `*[Upgrade to Pro to view this media]*`
          : `*Document: \`${_.escape(msg.filename)}\`*`
        if (msg.caption) mdMessageContent += `\n> ${_.escape(msg.caption)}`
        break
      case 'ptt':
        const duration = new Date(msg.duration * 1000)
          .toISOString()
          .substr(14, 5)
        mdMessageContent = msg.isRedacted
          ? `*[Upgrade to Pro to view this media]*`
          : `*Voice Message (${duration})*`
        break
      default:
        mdMessageContent = `*[Unsupported message type: ${msg.type}]*`
    }

    mdContent += `${mdMessageContent}\n\n---\n`
  }

  if (validationRef.current) {
    if (isLimitApplied) {
      mdContent += `\n---\n** Only the first 10 messages are shown. Upgrade to Pro to view all content.\n---\n`
    }
    const blob = new Blob([mdContent], {
      type: 'text/markdown;charset=utf-8',
    })
    FileSaver.saveAs(blob, `${filename}.md`)
  }
}
