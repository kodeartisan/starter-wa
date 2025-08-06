import type { Tabs } from 'webextension-polyfill'
import browser from 'webextension-polyfill'

export async function getCurrentTab(): Promise<Tabs.Tab> {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await browser.tabs.query(queryOptions)
  return tab
}

export async function getTabs(): Promise<Tabs.Tab[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const tabs = await browser.tabs.query({ currentWindow: true })
      const filteredTabs = tabs.filter(
        (tab) => !tab.url?.startsWith('chrome://'),
      )
      return resolve(filteredTabs)
    } catch (error) {
      reject(error)
    }
  })
}

export async function getTabByUrl(url: string): Promise<Tabs.Tab | null> {
  const queryOptions = { url: url }
  const tabs = await browser.tabs.query(queryOptions)
  return tabs.length > 0 ? tabs[0] : null
}

export const openWa = async () => {
  await browser.tabs.create({ url: 'https://web.whatsapp.com' })
}

export const isWaTabActive = async (): Promise<boolean> => {
  const result = await getTabByUrl('https://web.whatsapp.com/')
  return result?.active
}

export const isWaTabAvailable = async (): Promise<boolean> => {
  const result = await getTabByUrl('https://web.whatsapp.com/')
  return !!result
}
