const Dropbox = require('dropbox').Dropbox
const fetch = require('node-fetch')
const get = require('lodash/get')

const LAST_INVOICE_NUMBER_FILE_PATH = '/last_invoice_number'
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch })

const errorIsNotFoundError = e => {
  const parsedError = JSON.parse(e.error)
  return get(parsedError, ['error', 'path', '.tag']) === 'not_found'
}

const createLastInvoiceNumberFile = () =>
  dbx.filesUpload({ path: LAST_INVOICE_NUMBER_FILE_PATH, contents: '1' }).then(() => 1)

const getLastInvoiceNumber = () =>
  dbx
    .filesDownload({ path: LAST_INVOICE_NUMBER_FILE_PATH })
    .then(file => file.fileBinary.toString())
    .catch(e => errorIsNotFoundError(e) && createLastInvoiceNumberFile())

module.exports = {
  getLastInvoiceNumber,
}
