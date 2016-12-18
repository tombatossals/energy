import fs from 'fs'
import urljoin from 'url-join'
import moment from 'moment'
import phantom from 'phantom'

const config = require('../../config')
const endDate = moment().add(1, 'd')
let initDate = moment()

if (process.argv.length > 2) {
  initDate = moment(process.argv[2], 'DD-MM-YYYY')
}

const baseUrl = 'https://www.iberdroladistribucionelectrica.com/consumidores/'

const getXLSXUrl = (dt) =>
    urljoin('https://www.iberdroladistribucionelectrica.com/consumidores/',
        '/rest/consumoNew/exportarAXLSNew/fecha/',
        dt.format('DD-MM-YYYY') + '00:00:00',
        '/fecha2/0/frecuencia/horas/comparacion/false')

const sleep = (ms = 1000) => new Promise(r => setTimeout(r, ms))

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

  page.property('onConsoleMessage',  (msg, lineNum, sourceId) =>
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")')
  )

  console.log('Getting into Iberdrola page, wait a few seconds...')
  await page.open(urljoin(baseUrl, '/inicio.html#login'))

  // Wait for login form loaded
  await waitFor({ page, check: () => $('#form_login').is(':visible') })

  // Fill and submit login form
  const username = config.collect.iberdrola.username
  const password = config.collect.iberdrola.password
  await page.evaluate((username, password) => {
      $('#inputUser').val(username)
      $('#inputPassword').val(password)
      $('#btnIngresarIbd').click()
  }, username, password)

  await waitFor({
    page,
    check: () => $('#tablaListaContratos').is(':visible')
  })

  // Wait for contract list loaded
  await waitFor({
    page,
    check: () => $('#tablaListaContratos tr').is(':visible')
  })

  // Click contract
  const contract = config.collect.iberdrola.contract
  await page.evaluate((contract) => $('td:contains("' + contract + '")').click(), contract)

  // Wait for contract loaded
  await waitFor({ page, check: () => $('ul#InfoContratoTabs').is(':visible') })

  while (initDate.isBefore(endDate)) {
    console.log(`Downloading ${initDate.format("DD-MM-YYYY")} into "data" folder...`)
    const url = getXLSXUrl(initDate)
    const result = await page.evaluate((url) => {
      var Base64 = {
        encode: function(s) {
          return btoa(unescape(encodeURIComponent(s)));
        },
        decode: function(s) {
          return decodeURIComponent(escape(atob(s)));
        }
      }

      var out
      $.ajax({
          async : false,
          url : url,
          error : function(xhr, error) {
            out = Base64.encode(xhr.responseText);
          }

      });
      return out
    }, url);

    fs.writeFileSync('data/' + initDate.format("DD-MM-YYYY") + '.xlsx', result);
    initDate.add(1, 'd')
  }

  await instance.exit()

}())
