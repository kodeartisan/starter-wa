import type * as wajs from '@wppconnect/wa-js'

declare global {
  interface Window {
    WPP: typeof wajs
  }
  const WPP: typeof wajs
}
