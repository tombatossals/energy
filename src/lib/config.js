export const getServerConfig = () => {
  try {
    return require('../../config/config.server')
  } catch (e) {
    console.log('You must configure the application creating "config.server.json" file.')
  }
}

export const getClientConfig = () => {
  try {
    return require('../../config/config.client')
  } catch (e) {
    console.log('You must configure the application creating "config.client.json" file.')
  }
}
