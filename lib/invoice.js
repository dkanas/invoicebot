const http = require('https')
const fs = require('fs')
const fetch = require('node-fetch')

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

module.exports = generateAndDownloadInvoice
