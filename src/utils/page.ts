import { Action } from '@/constants'
import { postMessage } from './util'

const goTo = (page: string) => {
  postMessage(Action.Window.GO_TO_PAGE, page)
}

export default {
  goTo,
}
