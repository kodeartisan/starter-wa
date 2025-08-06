import { Setting } from '@/constants'
import { storage } from '@/libs/storage'
import $ from 'jquery'

const init = async () => {}

const blurProfilePictures = async () => {
  const state = ((await storage.get(Setting.BLUR_PROFILE_PICTURES)) ??
    false) as boolean
  $('div[class="x1n2onr6 x14yjl9h xudhj91 x18nykt9 xww2gxu"]').css(
    'filter',
    state ? 'blur(3px)' : '',
  )
  $('span[data-icon="default-contact-refreshed"]').css(
    'filter',
    state ? 'blur(3px)' : '',
  )
}
const blurMessages = () => {
  setTimeout(async () => {
    const state = ((await storage.get(Setting.BLUR_MESSAGES)) ??
      false) as boolean

    $(
      'div[class="_amkz message-in focusable-list-item _amjy _amjz _amjw"]',
    ).css('filter', state ? 'blur(3px)' : '')
    $('div[class="message-in focusable-list-item _amjy _amjz _amjw"]').css(
      'filter',
      state ? 'blur(3px)' : '',
    )
    $('div[class="message-out focusable-list-item _amjy _amjz _amjw"]').css(
      'filter',
      state ? 'blur(3px)' : '',
    )
    $('div[class="_aml8"]').css('filter', state ? 'blur(3px)' : '')
  }, 200)
}
const blurUserGroupNames = async () => {
  const state = ((await storage.get(Setting.BLUR_USER_GROUP_NAMES)) ??
    false) as boolean
  $('div[class="_ak8q"]').css('filter', state ? 'blur(3px)' : '')
}
const blurRecentMessages = async () => {
  const state = ((await storage.get(Setting.BLUR_RECENT_MESSAGES)) ??
    false) as boolean
  $('div[class="_ak8j"]').css('filter', state ? 'blur(3px)' : '')
}
export default {
  init,
  blurProfilePictures,
  blurMessages,
  blurUserGroupNames,
  blurRecentMessages,
}
