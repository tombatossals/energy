import urljoin from 'url-join'
import moment from 'moment'
import cla from 'command-line-args'
import phantom from 'phantom'
import XLSX from 'xlsx'
import { getServerConfig } from '../../lib/config'
import {
  addMeasures,
  removeMeasuresByDate
} from '../../lib/firebase-admin'

class Iberdrola {
  constructor (username, password) {
    this.baseUrl = 'https://www.iberdroladistribucionelectrica.com/consumidores/'
    this.username = username
    this.password = password
  }

  sleep (ms = 1000) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
  }

  async waitFor (checkFn) {
    const start = new Date()
    const timeout = 10000
    while (new Date() - start < timeout) {
      if (await this.page.evaluate(checkFn)) break
      await this.sleep()
    }
  }

  async init () {
    this.instance = await phantom.create()
    this.page = await this.instance.createPage()

    this.page.setting('userAgent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36')

    this.page.property('viewportSize', {
      width: 1280,
      height: 800
    })

    this.page.addCookie({
      name: 'leyAnticookies',
      value: '0000tQtj5SWlXPjJVsbbkWUZbuJ:18bld1a44',
      domain: 'www.iberdroladistribucionelectrica.com',
      path: '/',
      httponly: false,
      secure: true,
      expires: '9999-12-31T23:59:59.000Z'
    })

    this.page.addCookie({
      name: 'NSC_wt_mc_mbssvo-10161',
      value: 'ffffffffaf1b3f8345525d5f4f58455e445a4a421181',
      domain: 'www.iberdroladistribucionelectrica.com',
      path: '/',
      httponly: false,
      secure: true,
      expires: '9999-12-31T23:59:59.000Z'
    })

    this.page.addCookie({
      name: 'i18next',
      value: 'es',
      domain: 'www.iberdroladistribucionelectrica.com',
      path: '/',
      httponly: false,
      secure: true,
      expires: '9999-12-31T23:59:59.000Z'
    })

    this.page.addCookie({
      name: 'JSESSIONID',
      value: '',
      domain: 'www.iberdroladistribucionelectrica.com',
      path: '/consumidores',
      httponly: false,
      secure: true,
      expires: '9999-12-31T23:59:59.000Z'
    })

    this.page.property('onConsoleMessage', (msg, lineNum, sourceId) =>
      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")')
    )
  }

  async login () {
    await this.page.open(urljoin(this.baseUrl, '/inicio.html#login'))

    // Wait for login form loaded
    await this.waitFor({ check: () => window.$('#form_login').is(':visible') })

    // Fill and submit login form
    await this.page.evaluate((username, password) => {
      window.$('#inputUser').val(username)
      window.$('#inputPassword').val(password)
      window.$('#btnIngresarIbd').click()
    }, this.username, this.password)
  }

  async loadLocation (location) {
    await this.waitFor({ check: () => window.$('#tablaListaContratos').is(':visible') })

    // Wait for location list loaded
    await this.waitFor({ check: () => window.$('#tablaListaContratos tr').is(':visible') })

    await this.page.evaluate(location => window.$('td:contains("' + location + '")').click(), location)

    // Wait for location loaded
    await this.waitFor({ check: () => window.$('ul#InfoContratoTabs').is(':visible') })
  }

  async exit () {
    await this.instance.exit()
  }

  getXLSXUrl (dt) {
    return urljoin(this.baseUrl,
        '/rest/consumoNew/exportarAXLSNew/fecha/',
        dt.format('DD-MM-YYYY') + '00:00:00',
        '/fecha2/0/frecuencia/horas/comparacion/false')
  }

  async getData (date) {
    const url = this.getXLSXUrl(date)
    const b64string = await this.page.evaluate(url => {
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

    return b64string
  }
}

(async function () {
  const { location: locationName, dates: cmdDates, username: usernameCmd } = cla([
    { name: 'dates', type: String, multiple: true, defaultOption: true },
    { name: 'username', type: String, alias: 'u' },
    { name: 'location', alias: 'l', type: String }
  ])

  const getLocationByName = (locations, name) => [ locations.find(current => current.name === name) ]
  const config = getServerConfig().collect.iberdrola
  const username = usernameCmd || Object.keys(config)[0]
  const password = config[username].password

  const locations = locationName
    ? getLocationByName(config[username].locations, locationName)
    : config[username].locations

  const iberdrola = new Iberdrola(username, password)
  await iberdrola.init()
  await iberdrola.login()

  for (let location of locations) {
    console.log(`Getting into Iberdrola page location ${location.id}, wait a few seconds...`)
    await iberdrola.loadLocation(location.id)
    const initDate = cmdDates && cmdDates.length > 0
          ? moment(cmdDates[0], 'DD-MM-YYYY')
          : moment().subtract(2, 'd')
    const endDate = cmdDates && cmdDates.length > 1
          ? moment(cmdDates[1], 'DD-MM-YYYY').subtract(1, 'day')
          : moment().subtract(3, 'd')
    
    while (initDate.isAfter(endDate)) {
      console.log(`Downloading ${initDate.format('DD-MM-YYYY')} into "data" folder...`)
      const b64string = await iberdrola.getData(initDate)
      const data = XLSX.read(Buffer.from(b64string, 'base64')).Sheets.Consumo
      const result = []
      Object.keys(data).map(function (key, index) {
        if (key[0] === 'B' && data[key].v && data[key].v !== 'Mi consumo') {
          const hour = parseInt(index / 2, 10)
          result.push({
            date: (hour === 24 ? initDate.clone().add(1, 'day').format('YYYYMMDD') : initDate.format('YYYYMMDD')),
            time: initDate.clone().startOf('day').add(hour, 'hour').startOf('hour').toISOString(),
            value: data[key].v
          })
        }
      })

      removeMeasuresByDate(location.id, initDate.clone()).then(() => addMeasures(location.id, result))
      initDate.subtract(1, 'd')
    }
  }
  setTimeout(() => process.exit(), 5000)
})()

