// src/features/tools/backup-chat/components/PdfDocument.tsx
// English: This component defines the PDF structure and styling using @react-pdf/renderer.
// It creates a native PDF document directly, which is more performant than converting HTML to an image.

import { getContactName } from '@/utils/util'
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import _ from 'lodash'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 20,
    backgroundColor: '#E5DDD5',
    color: '#111b21',
  },
  header: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    border: '1px solid #dee2e6',
  },
  headerText: {
    fontSize: 9,
    marginBottom: 2,
  },
  limitNotice: {
    fontSize: 9,
    color: '#d9534f',
  },
  messageClusterOut: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  messageClusterIn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 8,
    borderRadius: 7,
  },
  bubbleOut: {
    backgroundColor: '#d9fdd3',
  },
  bubbleIn: {
    backgroundColor: '#ffffff',
  },
  senderName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#028a76',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 8,
    color: '#667781',
    textAlign: 'right',
    marginTop: 4,
  },
  image: {
    maxWidth: 250,
    maxHeight: 250,
    borderRadius: 6,
    marginTop: 5,
  },
  mediaPlaceholder: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    border: '1px dashed #ccc',
    borderRadius: 6,
    color: '#888',
    fontSize: 9,
    marginTop: 5,
  },
  quotedMessage: {
    backgroundColor: '#f0f2f5',
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50',
    padding: 6,
    marginBottom: 5,
    borderRadius: 4,
  },
  quotedSender: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#4CAF50',
  },
  quotedContent: {
    fontSize: 9,
    marginTop: 2,
  },
  redactedPlaceholder: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    border: '1px dashed #dee2e6',
    borderRadius: 6,
    color: '#6c757d',
    fontSize: 9,
    marginTop: 5,
  },
})

const REDACTED_PLACEHOLDER = '********'

// English: Renders a quoted message block within a message bubble.
const QuotedMessage = ({ quotedMsg }) => {
  if (!quotedMsg) return null

  const senderName = quotedMsg.sender.isMe
    ? 'You'
    : getContactName(quotedMsg.sender)
  let content = ''
  switch (quotedMsg.type) {
    case 'chat':
      content = _.truncate(quotedMsg.body, { length: 80 })
      break
    case 'image':
      content = '📷 Photo'
      break
    case 'video':
      content = '🎥 Video'
      break
    case 'document':
      content = `📄 ${quotedMsg.filename || 'Document'}`
      break
    case 'ptt':
      content = '🎤 Voice Message'
      break
    default:
      content = `[Unsupported: ${quotedMsg.type}]`
  }

  return (
    <View style={styles.quotedMessage}>
      <Text style={styles.quotedSender}>{senderName}</Text>
      <Text style={styles.quotedContent}>{content}</Text>
    </View>
  )
}

// English: Renders a single message bubble, handling different content types.
const MessageBubble = ({ msg, chat, mediaDataUrls }) => {
  const isOutgoing = msg.contact.isMe
  const isGroup = chat.data.isGroup
  const senderName =
    !isOutgoing && isGroup
      ? msg.contact?.pushname || msg.contact?.formattedName || 'Unknown'
      : ''
  const timestamp = new Date(msg.timestamp).toLocaleTimeString([], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const mediaUrl = mediaDataUrls.get(msg.id)

  let mediaContent = null
  const isMediaMessage = ['image', 'video', 'document', 'ptt'].includes(
    msg.type,
  )

  if (isMediaMessage && msg.isRedacted) {
    mediaContent = (
      <Text style={styles.redactedPlaceholder}>
        [Upgrade to Pro to view media]
      </Text>
    )
  } else if (mediaUrl) {
    if (msg.type === 'image' || msg.type === 'video') {
      mediaContent = <Image style={styles.image} src={mediaUrl} />
    }
  } else if (isMediaMessage) {
    let placeholderText = ''
    switch (msg.type) {
      case 'document':
        placeholderText = `📄 ${msg.filename || 'Document'}`
        break
      case 'ptt':
        const duration = new Date(msg.duration * 1000)
          .toISOString()
          .substr(14, 5)
        placeholderText = `🎤 Voice Message (${duration})`
        break
      default:
        placeholderText = `[${msg.type} not included]`
    }
    mediaContent = (
      <Text style={styles.mediaPlaceholder}>{placeholderText}</Text>
    )
  }

  const messageBody = msg.isRedacted
    ? REDACTED_PLACEHOLDER
    : msg.type === 'chat'
      ? msg.body
      : msg.caption ?? ''

  return (
    <View
      style={isOutgoing ? styles.messageClusterOut : styles.messageClusterIn}
    >
      <View
        style={[
          styles.messageBubble,
          isOutgoing ? styles.bubbleOut : styles.bubbleIn,
        ]}
      >
        {senderName && <Text style={styles.senderName}>{senderName}</Text>}
        <QuotedMessage quotedMsg={msg.quotedMsg} />
        {mediaContent}
        {messageBody && <Text>{messageBody}</Text>}
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  )
}

interface PdfDocumentProps {
  messages: any[]
  chat: any
  isLimitApplied?: boolean
  mediaDataUrls: Map<string, string>
}

// English: The main PDF document component that assembles all parts.
const PdfDocument: React.FC<PdfDocumentProps> = ({
  messages,
  chat,
  isLimitApplied = false,
  mediaDataUrls,
}) => (
  <Document
    title={`Chat with ${getContactName(chat.data.contact)}`}
    author="WhatsBackup Extension"
  >
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Chat With: {getContactName(chat.data.contact)}
        </Text>
        <Text style={styles.headerText}>
          Export Date: {new Date().toLocaleString()}
        </Text>
        <Text style={styles.headerText}>
          Total Messages Exported: {messages.length}
        </Text>
        {isLimitApplied && (
          <Text style={styles.limitNotice}>
            Notice: Some messages and media were omitted. Upgrade to Pro to save
            everything.
          </Text>
        )}
      </View>

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          chat={chat}
          mediaDataUrls={mediaDataUrls}
        />
      ))}
    </Page>
  </Document>
)

export default PdfDocument
