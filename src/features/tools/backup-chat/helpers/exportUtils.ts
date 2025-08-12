// src/features/tools/chat-backup/helpers/exportUtils.ts
import wa from '@/libs/wa'
import { getContactName } from '@/utils/util'
import FileSaver from 'file-saver'
import JSZip from 'jszip'

interface ExporterParams {
  messages: any[]
  chat: any
  filename: string
  includeMedia: boolean
  setProgress: (progress: { value: number; label: string }) => void
  validationRef: React.MutableRefObject<boolean>
}

// --- HTML Export ---
export const exportToHtml = async ({
  messages,
  chat,
  filename,
  includeMedia,
  setProgress,
  validationRef,
}: ExporterParams) => {
  const styles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; background-color: #E5DDD5; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaUAAAFaAQMAAAAPp1JDAAAABlBMVEXr8vT2+fu2qpt9AAAAAWJLR0QCZgtT6AAAA0NJREFUGBntV/tto1QYnptgVqQY8/8/Gjso0mBGM0qMUGvMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEfMGEf-DqG459KAAAAAElFTkSuQmCC'); background-repeat: repeat; }
      .chat-container { max-width: 800px; margin: auto; padding: 20px; }
      .message-cluster { display: flex; flex-direction: column; margin-bottom: 2px; padding: 0 9%; }
      /* This is the corrected rule that aligns the message bubble */
      .message-cluster.message-out { align-items: flex-end; /* Aligns item (the message bubble) to the right */ }
      /* This rule ensures incoming messages stay on the left */
      .message-cluster.message-in { align-items: flex-start; /* Aligns item to the left */ }
      .message { max-width: 65%; word-wrap: break-word; margin-bottom: 10px; }
      .message-bubble { padding: 6px 9px; border-radius: 7.5px; box-shadow: 0 1px 0.5px rgba(11,20,26,.13); position: relative; }
      .message-out .message-bubble { background-color: #d9fdd3; color: #0f1010; }
      .message-in .message-bubble { background-color: #fff; color: #111b21; }
      /* Tail for outgoing messages */
      .message-out .message-bubble::after { content: ''; position: absolute; top: 0px; right: -4px; width: 0px; height: 0px; border-top: 0px solid transparent; border-left: 8px solid #d9fdd3; border-bottom: 10px solid transparent; }
      /* Tail for incoming messages */
      .message-in .message-bubble::before { content: ''; position: absolute; top: 0px; left: -4px; width: 0px; height: 0px; border-top: 0px solid transparent; border-right: 8px solid #fff; border-bottom: 10px solid transparent; }
      .sender-name { font-size: 0.8rem; font-weight: 500; color: #028a76; margin-bottom: 4px; }
      .message-content { }
      .message-content img, .message-content video, .message-content { width: 100%; max-width: 300px; border-radius: 6px; margin-top: 5px; display: block; }
      .message-content a { color: #0088cc; }
      .timestamp { font-size: 0.7rem; color: #667781; display: flex; justify-content: flex-end; padding-top: 4px; }
      /* ++ ADDED: Style for media placeholders */
      .media-placeholder { padding: 10px; background-color: #f0f0f0; border: 1px dashed #ccc; border-radius: 6px; color: #888; font-style: italic; font-size: 0.9em; margin-top: 5px; text-align: center; }
    </style>
    `
  let htmlContent = `
    <html>
      <head>
        ${styles}
      </head>
      <body>
        <div class="chat-container">
    `
  const zip = includeMedia ? new JSZip() : null
  const mediaFolder = zip?.folder('media')

  for (let i = 0; i < messages.length; i++) {
    if (!validationRef.current) break
    const msg = messages[i]

    // Skip message types that are not supported for backup
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
    if (includeMedia && isMediaMessage) {
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
              msg.filename || 'Document'
            }</a>`
            break
        }
      } else {
        const mediaType = msg.type === 'ptt' ? 'Audio' : msg.type
        mediaHtml = `<div class="media-placeholder">[${
          mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
        } not found]</div>`
      }
    }

    htmlContent += `
        <div class="message-cluster message-${direction}">
          <div class="message">
            <div class="message-bubble">
              ${senderName ? `<div class="sender-name">${senderName}</div>` : ''}
              <div class="message-content">
                ${mediaHtml}
                <span>${(msg.type === 'chat' ? msg.body : msg.caption) ?? ''}</span>
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
