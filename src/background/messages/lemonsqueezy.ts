import lemonSqueezy from '@/libs/ls'
import type { PlasmoMessaging } from '@plasmohq/messaging'
import pkg from '../../../package.json'

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action, body } = req.body

  try {
    let response

    switch (action) {
      case 'validateLicense':
        response = await lemonSqueezy.validateLicense(body.licenseKey)
        break

      case 'activateLicense':
        response = await lemonSqueezy.activateLicense(body.licenseKey, pkg.name)
        break

      case 'deactivateLicense':
        response = await lemonSqueezy.deactivateLicense(
          body.licenseKey,
          body.instanceId,
        )
        break

      case 'getCustomer':
        response = await lemonSqueezy.getCustomer(body.customerId)
        break

      default:
        return res.send({ error: 'Invalid Lemon Squeezy action' })
    }

    res.send(response)
  } catch (error) {
    // Tangani error yang mungkin dilempar oleh SDK Lemon Squeezy
    res.send({
      error: true,
      message: error.message || 'An unknown error occurred.',
    })
  }
}

export default handler
