// load env variables from .env file if exists
require('dotenv').load()

const {
  generateAndDownloadInvoice,
  getLastInvoiceNumber,
  createInvoiceData,
  uploadInvoice,
} = require('./lib/invoice')
const createJob = require('./lib/cron')
const sendEmail = require('./lib/email')

const onTick = async () => {
  try {
    console.log('Starting invoicing...')
    const lastInvoiceNumber = await getLastInvoiceNumber()
    const currentInvoiceNumber = lastInvoiceNumber + 1
    const invoiceData = await createInvoiceData(currentInvoiceNumber)
    const invoice = await generateAndDownloadInvoice(invoiceData)
    await uploadInvoice(currentInvoiceNumber, invoice)
    await sendEmail(currentInvoiceNumber, invoice)
    console.log('Invoice generated successfully!')
  } catch (e) {
    console.error(e)
  }
}

const job = createJob(onTick)
job.start()
