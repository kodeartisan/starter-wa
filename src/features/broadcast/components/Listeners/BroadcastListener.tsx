import { Action } from '@/constants'
import useBroadcast from '@/features/broadcast/hooks/useBroadcast'
import useWa from '@/hooks/useWa'
import useWindowMessage from '@/hooks/useWindowMessage'
import _ from 'lodash'
import { useEffect } from 'react'

const BroadcastListener: React.FC = () => {
  const wa = useWa()
  const broadcast = useBroadcast()

  useWindowMessage(async (event: MessageEvent) => {
    const {
      data: { action },
    } = event

    switch (action) {
      case Action.Window.SEND_BROADCAST:
        await broadcast.init()
        break
      default:
        break
    }
  })

  useEffect(() => {
    if (!wa.isReady) return

    broadcast
      .init()
      .then(() => {
        console.log('Broadcast listener initialized.')
      })
      .catch(console.error)

    const interval = setInterval(broadcast.checkScheduled, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [wa.isReady])

  return null
}

export default BroadcastListener
