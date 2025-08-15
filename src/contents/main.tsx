import App from '@/components/App'
import AppMenu from '@/components/AppMenu'
import ToastProvider from '@/components/Toast/ToastProvider'
import theme from '@/libs/theme'
import style from '@/utils/style'
import { MantineProvider } from '@mantine/core'
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from 'plasmo'

export const getShadowHostId: PlasmoGetShadowHostId = () => `crm-main`

export const config: PlasmoCSConfig = {
  matches: ['https://web.whatsapp.com/*'],
}

export const getStyle = () => {
  const $style = document.createElement('style')
  $style.textContent = style.generate()
  return $style
}

const Main = () => {
  return (
    <>
      <MantineProvider
        theme={theme}
        //@ts-ignore
        cssVariablesSelector="div.plasmo-csui-container"
        getRootElement={() =>
          document
            .getElementById('crm-main')
            ?.shadowRoot?.querySelector('div.plasmo-csui-container') ||
          undefined
        }
      >
        <App />
        <ToastProvider />
      </MantineProvider>
    </>
  )
}

export default Main
