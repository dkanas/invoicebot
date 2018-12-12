const Dropbox = require('dropbox').Dropbox
const fetch = require('node-fetch')
const get = require('lodash/get')

// constants
const LAST_INVOICE_NUMBER_FILE_PATH = '/last_invoice_number'
const INVOICE_TEMPLATE_FILE_PATH = '/template.json'

// initialize dropbox api client
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch })

// create last invoice number if it doesn't exist and return 1 as the invoice number
const createLastInvoiceNumberFile = () =>
  dbx.filesUpload({ path: LAST_INVOICE_NUMBER_FILE_PATH, contents: '1' }).then(() => 1)

// a function that takes the file path and returns the file content as a string if
// the file exists or null if it doesn't
const getFileContentIfExists = path =>
  dbx
    .filesDownload({ path })
    .then(file => file.fileBinary.toString())
    .catch(e => {
      if (errorIsNotFoundError(e)) return null
      else throw e
    })

// this function gets the last invoice number from a dropbox file,
// or creates it and returns '1'
const getLastInvoiceNumber = () =>
  getFileContentIfExists(LAST_INVOICE_NUMBER_FILE_PATH).then(
    number => (!number ? createLastInvoiceNumberFile() : parseInt(number, 10))
  )
// check if the error is a 'not found' error
const errorIsNotFoundError = e => {
  const parsedError = JSON.parse(e.error)
  return get(parsedError, ['error', 'path', '.tag']) === 'not_found'
}

module.exports = {
  getLastInvoiceNumber,
}
