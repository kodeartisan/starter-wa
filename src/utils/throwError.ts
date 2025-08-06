const broadcastNotFound = () => {
  throw new Error('Broadcast not found')
}
const mediaNotFound = () => {
  throw new Error('Media not found')
}

const contactNotExist = () => {
  throw new Error('Contact not exist')
}

export default {
  broadcastNotFound,
  mediaNotFound,
  contactNotExist,
}
