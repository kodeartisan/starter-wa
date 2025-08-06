const isProduction = () => {
  return process.env.NODE_ENV === 'production'
}

const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}

export const isStaging = () => {
  return process.env.PLASMO_PUBLIC_STAGING === 'true'
}

export default {
  isProduction,
  isDevelopment,
  isStaging,
}
