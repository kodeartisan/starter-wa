import type { PlasmoMessaging } from '@plasmohq/messaging'
import browser from 'webextension-polyfill'

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const url = browser.runtime.getURL('tabs/resource-page.html')
  await browser.tabs.create({ url })
  return res.send({})
}

export default handler
