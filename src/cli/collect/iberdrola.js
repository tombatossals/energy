import fs from 'fs'
import urljoin from 'url-join'
import moment from 'moment'
import phantom from 'phantom'
import XLSX from 'xlsx'
import { getConfig } from '../config'

const mkdirSync = (path) => {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
  }
}

const config = getConfig().collect.iberdrola
let initDate = moment().subtract(2, 'd')
let endDate = moment().subtract(5, 'y')

if (process.argv.length > 2) {
  initDate = moment(process.argv[2], 'DD-MM-YYYY')
  endDate = moment(process.argv[2], 'DD-MM-YYYY').subtract(1, 'day')
}

mkdirSync('data')

const baseUrl = 'https://www.iberdroladistribucionelectrica.com/consumidores/'

const getXLSXUrl = (dt) =>
    urljoin(baseUrl,
        '/rest/consumoNew/exportarAXLSNew/fecha/',
        dt.format('DD-MM-YYYY') + '00:00:00',
        '/fecha2/0/frecuencia/horas/comparacion/false')

const sleep = (ms = 1000) =>
  new Promise((resolve, reject) =>
    setTimeout(resolve, ms))

const waitFor = async (data) => {
  const start = new Date()
  const timeout = 10000
  while (new Date() - start < timeout) {
    if (await data.page.evaluate(data.check)) break
    await sleep()
  }
}

(async function () {
  const instance = await phantom.create()
  const page = await instance.createPage()

  page.property('viewportSize', {
    width: 1280,
    height: 800
  })

  page.property('onConsoleMessage', (msg, lineNum, sourceId) =>
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")')
  )

  console.log('Getting into Iberdrola page, wait a few seconds...')
  await page.open(urljoin(baseUrl, '/inicio.html#login'))

  // Wait for login form loaded
  await waitFor({ page, check: () => window.$('#form_login').is(':visible') })

  // Fill and submit login form
  const username = config.username
  const password = config.password
  await page.evaluate((username, password) => {
    window.$('#inputUser').val(username)
    window.$('#inputPassword').val(password)
    window.$('#btnIngresarIbd').click()
  }, username, password)

  await waitFor({
    page,
    check: () => window.$('#tablaListaContratos').is(':visible')
  })

  // Wait for contract list loaded
  await waitFor({
    page,
    check: () => window.$('#tablaListaContratos tr').is(':visible')
  })

  // Click contract
  const contract = config.contract
  await page.evaluate((contract) => window.$('td:contains("' + contract + '")').click(), contract)

  // Wait for contract loaded
  await waitFor({ page, check: () => window.$('ul#InfoContratoTabs').is(':visible') })

  while (initDate.isAfter(endDate)) {
    console.log(`Downloading ${initDate.format('DD-MM-YYYY')} into "data" folder...`)
    const url = getXLSXUrl(initDate)
    const b64string = await page.evaluate((url) => {
      var BASE64_ENCODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

      function encodeBase64 (str) {
        /* eslint max-statements:0 */
        var out = ''
        var i = 0
        var len = str.length
        var c1
        var c2
        var c3
        while (i < len) {
          c1 = str.charCodeAt(i++) & 0xff
          if (i === len) {
            out += BASE64_ENCODE_CHARS.charAt(c1 >> 2)
            out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4)
            out += '=='
            break
          }
          c2 = str.charCodeAt(i++)
          if (i === len) {
            out += BASE64_ENCODE_CHARS.charAt(c1 >> 2)
            out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4)
            out += BASE64_ENCODE_CHARS.charAt((c2 & 0xF) << 2)
            out += '='
            break
          }
          c3 = str.charCodeAt(i++)
          out += BASE64_ENCODE_CHARS.charAt(c1 >> 2)
          out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4)
          out += BASE64_ENCODE_CHARS.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6)
          out += BASE64_ENCODE_CHARS.charAt(c3 & 0x3F)
        }
        return out
      }

      var xhr = new window.XMLHttpRequest()
      xhr.open('GET', url, false)
      xhr.overrideMimeType('text/plain; charset=x-user-defined')
      xhr.send(null)

      return encodeBase64(xhr.responseText)
    }, url)

    if (!b64string) {
      console.log(`Can't find anything on ${initDate, 'DD-MM-YYYY'}`)
      initDate.subtract(1, 'd')
      continue
    }

    const data = XLSX.read(Buffer.from(b64string, 'base64')).Sheets.Consumo

    const result = []
    Object.keys(data).map(function (key, index) {
      if (key[0] === 'B' && data[key].v && data[key].v !== 'Mi consumo') {
        const hour = parseInt(index / 2, 10)
        result.push({
          date: (hour === 24 ? initDate.clone().add(1, 'day').format('YYYYMMDD') : initDate.format('YYYYMMDD')),
          time: initDate.clone().add(hour, 'hour').startOf('hour').toISOString(),          
          value: data[key].v
        })
      }
    })

    fs.writeFileSync('data/' + initDate.format('DD-MM-YYYY') + '.json', JSON.stringify(result, null, 4))
    initDate.subtract(1, 'd')
  }

  await instance.exit()
}())
