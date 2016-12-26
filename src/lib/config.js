export const getConfig = () => {
  try {
    return require('../../config')
  } catch (e) {
    console.log('You must configure the application creating "config.json" file.')
  }
}
