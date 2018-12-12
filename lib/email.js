const nodemailer = require('nodemailer')
const { invoiceNumberWithPrefix } = require('./utils')

const { EMAIL_USERNAME, EMAIL_PASSWORD, INVOICE_EMAIL } = process.env

// initiating nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Zoho',
  auth: { user: EMAIL_USERNAME, pass: EMAIL_PASSWORD },
})

// get message options object based on invoice number with prefix and the invoice file
const getMessageOption = (invoiceNumber, invoice) => ({
  from: EMAIL_USERNAME,
  to: INVOICE_EMAIL,
  subject: `Invoice ${invoiceNumberWithPrefix(invoiceNumber)} generated!`,
  html: `<h1>Hi! InvoiceBot here!</h1><p>I generated a new invoice for you. It's in the attachment :)`,
  attachments: [
    {
      filename: invoiceNumberWithPrefix(invoiceNumber) + '.pdf',
      content: invoice,
    },
  ],
})

// send Email
const sendEmail = (invoiceNumber, invoice) => {
  const messageOptions = getMessageOption(invoiceNumber, invoice)
  return transporter.sendMail(messageOptions)
}

module.exports = sendEmail
