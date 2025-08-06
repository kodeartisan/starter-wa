import {
  Button,
  createTheme,
  FileInput,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  Popover,
  Radio,
  Select,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core'

const theme = createTheme({
  colors: {
    emerald: [
      '#effbf3',
      '#ddf4e5',
      '#b6eac7',
      '#8cdfa7',
      '#6bd68c',
      '#56d07b',
      '#4acd72',
      '#3bb560',
      '#31a154',
      '#145229',
    ],
  },
  primaryColor: 'teal',
  cursorType: 'pointer',
  components: {
    Button: Button.extend({
      defaultProps: {
        size: 'sm',
      },
    }),

    FileInput: FileInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Menu: Menu.extend({ defaultProps: { withinPortal: false } }),
    Modal: Modal.extend({
      defaultProps: {
        size: 'xl',
        withCloseButton: false,
        withOverlay: false,
        withinPortal: false,
      },
    }),

    NumberInput: NumberInput.extend({ defaultProps: { size: 'md' } }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        size: 'md',
        comboboxProps: {
          withinPortal: false,
        },
      },
    }),
    Popover: Popover.extend({
      defaultProps: {
        withinPortal: false,
      },
    }),
    Radio: Radio.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: 'md',
        comboboxProps: {
          withinPortal: false,
        },
      },
    }),
    Switch: Switch.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    TagsInput: TagsInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Text: Text.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        position: 'left',
        withinPortal: false,
        withArrow: true,
      },
    }),
  },
})

export default theme
