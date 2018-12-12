const { INVOICE_NUMBER_PREFIX } = require('./constants')

// this function generates the prefixed invoice number based on numeric part
const invoiceNumberWithPrefix = invoiceNumber => INVOICE_NUMBER_PREFIX + invoiceNumber

// this function generates the prefixed invoice number based on numeric part
const generateInvoicePath = invoiceNumber => '/' + invoiceNumberWithPrefix(invoiceNumber) + '.pdf'

module.exports = { invoiceNumberWithPrefix, generateInvoicePath }
