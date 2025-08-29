import useWa from '@/hooks/useWa'
import { useEffect } from 'react'
import useStatusScheduler from '../hooks/useStatusScheduler'

const StatusListener: React.FC = () => {
  const wa = useWa()
  const statusScheduler = useStatusScheduler()

  useEffect(() => {
    if (!wa.isReady) return

    statusScheduler.initializeScheduler().catch(console.error)

    const interval = setInterval(() => {
      statusScheduler.checkScheduled().catch(console.error)
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [wa.isReady, statusScheduler])

  return null
}

export default StatusListener
