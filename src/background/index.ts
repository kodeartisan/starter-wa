import { Action, Setting } from '@/constants'
import { storage } from '@/libs/storage'
import { getTabByUrl, openWa } from '@/utils/ext'
import { sendToContentScript } from '@plasmohq/messaging'
import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await storage.set(Setting.LICENSE_KEY, null)
    await storage.set(Setting.IS_FIRST_TIME, true)
    await storage.set(Setting.NEED_TO_OPEN, true)
    await openWa()
  }
})

browser.action.onClicked.addListener(async () => {
  const waTab = await getTabByUrl('https://web.whatsapp.com/')
  if (waTab?.active) {
    sendToContentScript({
      name: Action.Window.SHOW_MODAL_MAIN,
    })
    return
  }
  await storage.set(Setting.NEED_TO_OPEN, true)
  await openWa()
})
