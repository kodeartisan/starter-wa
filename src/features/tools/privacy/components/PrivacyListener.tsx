import { Setting } from '@/constants'
import useWa from '@/hooks/useWa'
import privacy from '@/utils/privacy'
import { useMutationObserver } from '@mantine/hooks'
import { useStorage } from '@plasmohq/storage/hook'
import $ from 'jquery'
import React, { useEffect } from 'react'

const PrivacyListener: React.FC = () => {
  const wa = useWa()
  const [blurProfilePictures] = useStorage(Setting.BLUR_PROFILE_PICTURES)
  const [blurMessages] = useStorage(Setting.BLUR_MESSAGES)
  const [blurUserGroupNames] = useStorage(Setting.BLUR_USER_GROUP_NAMES)
  const [blurRecentMessages] = useStorage(Setting.BLUR_RECENT_MESSAGES)

  useMutationObserver(
    (mutations) => {
      privacy.blurProfilePictures().then().catch(console.error)
      privacy.blurUserGroupNames().then().catch(console.error)
      privacy.blurRecentMessages().then().catch(console.error)
    },
    {
      attributes: true,
      childList: true,
    },
    () => $('div[class="x1y332i5 x1n2onr6 x6ikm8r x10wlt62 xjwt4uw"]')[0],
  )

  useMutationObserver(
    (mutations) => {
      privacy.blurMessages()
    },
    {
      attributes: true,
      childList: true,
    },
    () =>
      $(
        'div[class="x3psx0u xwib8y2 xkhd6sd xrmvbpv xh8yej3 xquzyny x1gryazu xkrivgy"]',
      )[0],
  )

  useEffect(() => {
    if (!wa.isReady) return
    privacy.blurProfilePictures().then().catch(console.error)
  }, [wa.isReady, blurProfilePictures])

  useEffect(() => {
    if (!wa.isReady) return
    privacy.blurUserGroupNames().then().catch(console.error)
  }, [wa.isReady, blurUserGroupNames])

  useEffect(() => {
    if (!wa.isReady) return
    privacy.blurRecentMessages().then().catch(console.error)
  }, [wa.isReady, blurRecentMessages])

  useEffect(() => {
    if (!wa.isReady) return
    if (!wa.activeChat) return
    privacy.blurMessages()
  }, [wa.isReady, wa.activeChat, blurMessages])

  useEffect(() => {
    if (!wa.activeChat) return
  }, [wa.activeChat])
  return null
}

export default PrivacyListener
