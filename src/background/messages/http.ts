import http from '@/libs/http'
import type { PlasmoMessaging } from '@plasmohq/messaging'

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { url, method, data, config } = req.body

  const httpInstance = {
    POST: () => {
      return http.post(url, data, config)
    },
    GET: () => {
      return http.get(url, config)
    },
  }

  const result = await httpInstance[method]?.()

  return res.send(result.data)
}

export default handler
