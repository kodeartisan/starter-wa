export const ready = (callback = () => {}) => {
  const targetSelector = '#side' // WhatsApp left-panel root
  const node = document.querySelector(targetSelector)

  if (node) {
    require('@wppconnect/wa-js/dist/wppconnect-wa')
    callback()
    return
  }

  // Wait for the node to appear only once
  const observer = new MutationObserver(() => {
    const el = document.querySelector(targetSelector)
    if (el) {
      console.log('✅✅✅✅✅')
      observer.disconnect() // stop watching
      require('@wppconnect/wa-js/dist/wppconnect-wa')
      callback()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}
