const Dropbox = require('dropbox').Dropbox
const fetch = require('node-fetch')
const get = require('lodash/get')
const { LAST_INVOICE_NUMBER_FILE_PATH, INVOICE_TEMPLATE_FILE_PATH } = require('./constants')

// initialize dropbox api client
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch })

// create file on dropbox
const createFile = options => dbx.filesUpload(options)

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

// check if the error is a 'not found' error
const errorIsNotFoundError = e => {
  const parsedError = JSON.parse(e.error)
  return get(parsedError, ['error', 'path', '.tag']) === 'not_found'
}

module.exports = {
  getFileContentIfExists,
  createFile,
}
