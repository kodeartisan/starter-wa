import { Message } from '@/constants'
import db from '@/libs/db'
import { useForm } from '@mantine/form'
import _ from 'lodash'

const defaultValues = {
  type: Message.TEXT,
  inputText: '',
  inputImage: {
    file: null,
    caption: '',
  },
  inputVideo: {
    file: null,
    caption: '',
  },
  inputAudio: {
    file: null,
    isPtt: false,
    caption: '',
  },
  inputFile: {
    file: null,
    caption: '',
  },
  inputLocation: {
    lat: '',
    lng: '',
    name: '',
    address: '',
    url: '',
  },
  inputPoll: {
    name: '',
    choices: ['Choice 1'],
  },
  // ++ MODIFIED: Default value is an empty array for storing selected contacts
  inputVCard: {
    contacts: [],
  },
}
const useInputMessage = () => {
  const form = useForm({
    initialValues: defaultValues,
    validate: {
      inputText: (value, parent) => {
        if (parent.type === Message.TEXT && _.isEmpty(value)) {
          return 'Required'
        }
        return null
      },
      inputImage: {
        file: (value, parent) => {
          if (parent.type === Message.IMAGE && !value) {
            return 'Required'
          }
          return null
        },
      },
      inputVideo: {
        file: (value, parent) => {
          if (parent.type === Message.VIDEO && !value) {
            return 'Required'
          }
          return null
        },
      },
      inputAudio: {
        file: (value, parent) => {
          if (parent.type === Message.AUDIO && !value) {
            return 'Required'
          }
          return null
        },
      },
      inputFile: {
        file: (value, parent) => {
          if (parent.type === Message.FILE && !value) {
            return 'Required'
          }
          return null
        },
      },
      inputLocation: {
        lat: (value, parent) => {
          if (parent.type === Message.LOCATION && _.isEmpty(value)) {
            return 'Required'
          }
          return null
        },
        lng: (value, parent) => {
          if (parent.type === Message.LOCATION && _.isEmpty(value)) {
            return 'Required'
          }
          return null
        },
      },
      // ++ ADDED: Validation rule for VCard message type
      inputVCard: {
        contacts: (value, parent) => {
          if (parent.type === Message.VCARD && (!value || value.length === 0)) {
            return 'At least one contact must be selected.'
          }
          return null
        },
      },
    },
  })
  const getMessage = () => {
    const {
      type,
      inputText,
      inputImage,
      inputVideo,
      inputFile,
      inputLocation,
      inputPoll,
      inputVCard,
    } = form.values
    const messages = {
      [Message.TEXT]: inputText,
      [Message.IMAGE]: {
        caption: inputImage.caption,
      },
      [Message.VIDEO]: {
        caption: inputVideo.caption,
      },
      [Message.FILE]: inputFile.caption,
      [Message.LOCATION]: {
        lat: inputLocation.lat,
        lng: inputLocation.lng,
        name: inputLocation.name,
        address: inputLocation.address,
        url: inputLocation.url,
      },
      [Message.VCARD]: inputVCard.contacts,
      [Message.POLL]: {
        name: inputPoll.name,
        choices: inputPoll.choices,
      },
    }
    return messages[type] ?? inputText
  }
  const insertBroadcastFile = async (
    parentId: number,
    broadcastFileType: string,
  ) => {
    const { type, inputImage, inputVideo, inputAudio, inputFile } = form.values
    const inputTypes = {
      [Message.IMAGE]: inputImage.file,
      [Message.VIDEO]: inputVideo.file,
      [Message.AUDIO]: inputAudio.file,
      [Message.FILE]: inputFile.file,
    }
    const file = inputTypes[type] as File
    await db.media.add({
      parentId,
      type: broadcastFileType,
      name: file.name,
      file,
      ext: file.type,
    })
  }
  return {
    form,
    getMessage,
    insertBroadcastFile,
  }
}
export default useInputMessage
