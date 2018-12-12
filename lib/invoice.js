const fetch = require('node-fetch')
const { getFileContentIfExists, createFile } = require('./dropbox')
const { LAST_INVOICE_NUMBER_FILE_PATH, INVOICE_TEMPLATE_FILE_PATH } = require('./constants')
const { invoiceNumberWithPrefix, generateInvoicePath } = require('./utils')

// this function gets the last invoice number from a dropbox file,
// or creates it and returns '1'
const getLastInvoiceNumber = async () => {
  const invoiceNumberFileContent = await getFileContentIfExists(LAST_INVOICE_NUMBER_FILE_PATH)
  if (!invoiceNumberFileContent) {
    await createFile({ path: LAST_INVOICE_NUMBER_FILE_PATH, contents: '1' })
    return 1
  } else return parseInt(invoiceNumberFileContent, 10)
}

// create the invoice data object based on the invoice number
const createInvoiceData = invoiceNumber =>
  getFileContentIfExists(INVOICE_TEMPLATE_FILE_PATH)
    .then(content => content && JSON.parse(content))
    .then(template => {
      if (!template) throw new Error(`Template file doesn't exist!`)
      else return { ...template, number: invoiceNumberWithPrefix(invoiceNumber) }
    })

// call invoice generator api and download invoice pdf
const generateAndDownloadInvoice = invoiceData => {
  const dataString = JSON.stringify(invoiceData)
  return fetch('https://invoice-generator.com', {
    method: 'post',
    body: dataString,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataString),
    },
  }).then(res => res.buffer())
}

const updateInvoiceNumberFile = invoiceNumber =>
  createFile({
    path: LAST_INVOICE_NUMBER_FILE_PATH,
    contents: invoiceNumber,
    mode: { '.tag': 'overwrite' },
  })

const uploadInvoice = async (invoiceNumber, invoice) => {
  await createFile({
    path: generateInvoicePath(invoiceNumber),
    contents: invoice,
    mode: { '.tag': 'overwrite' },
  })
  await updateInvoiceNumberFile(invoiceNumber)
}

module.exports = {
  generateAndDownloadInvoice,
  createInvoiceData,
  getLastInvoiceNumber,
  uploadInvoice,
}
