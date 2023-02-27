'use strict'

const config = require('../config')
const sendgrid = require('sendgrid')(config.sendgridKey)

exports.send = async (to, subject, body) => {
  sendgrid.send({
    to: to,
    from: 'noreply@server.com.br',
    subject: subject,
    html: body
  })
}