import { useCallback, useEffect } from 'react'

type MessageListener<T = any> = (event: MessageEvent<T>) => void

const useWindowMessage = <T = any>(listener: MessageListener<T>): void => {
  const handleMessage = useCallback<MessageListener<T>>(
    (event) => {
      listener(event)
    },
    [listener],
  )

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])
}

export default useWindowMessage
