import appMenuStyle from 'data-text:@/components/AppMenu.module.css'
import layoutStyle from 'data-text:@/components/Layout/LayoutPage.module.css'
import toastStyle from 'data-text:@/components/Toast/Toast.module.css'
import globalsStyle from 'data-text:@/styles/globals.css'
import coreStyle from 'data-text:@mantine/core/styles.css'
import dateStyle from 'data-text:@mantine/dates/styles.css'
import dropzoneStyle from 'data-text:@mantine/dropzone/styles.css'
import tableStyle from 'data-text:mantine-datatable/styles.layer.css'

const styles = [
  coreStyle,
  dateStyle,
  dropzoneStyle,
  tableStyle,
  toastStyle,
  globalsStyle,
  layoutStyle,
  appMenuStyle,
]

const generate = () => {
  return styles.join('')
}

export default { generate }
