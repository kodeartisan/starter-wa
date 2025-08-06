import { useCallback, useEffect } from 'react'

type MessageListener<T = any> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void | boolean

/**
 * A React hook for handling Chrome runtime messages
 * @param listener The callback function to handle incoming messages
 * @returns void
 *
 * @example
 * useRuntimeMessage((message, sender, sendResponse) => {
 *   if (message.type === 'getData') {
 *     sendResponse({ data: 'example' })
 *   }
 *   // Return true to keep the message channel open for async responses
 *   return true
 * })
 */
const useRuntimeMessage = <T = any>(listener: MessageListener<T>): void => {
  const memoizedHandler = useCallback<MessageListener<T>>(
    (message, sender, sendResponse) => {
      return listener(message, sender, sendResponse)
    },
    [listener],
  )

  useEffect(() => {
    chrome.runtime.onMessage.addListener(memoizedHandler)

    return () => {
      chrome.runtime.onMessage.removeListener(memoizedHandler)
    }
  }, [memoizedHandler])
}

export default useRuntimeMessage
