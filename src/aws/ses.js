const log = require('../log')

const AWS = require('aws-sdk')

const settings = {
  accessKeyId: process.env.LINODE_ACCESS_KEY_ID,
  secretAccessKey: process.env.LINODE_SECRET_ACCESS_KEY,
  region: process.env.LINODE_DEFAULT_REGION,
  bucket: process.env.LINODE_S3_BUCKET,
  endpoint: process.env.LINODE_S3_ENDPOINT
}

let client

exports.start = (cb) => {
  cb = cb || function () {}

  if (!settings.accessKeyId || !settings.secretAccessKey || !settings.region) {
    log.warn(`[aws/s3] client disabled because LINODE_ACCESS_KEY_ID, LINODE_SECRET_ACCESS_KEY, LINODE_DEFAULT_REGION, LINODE_S3_ENDPOINT and/or LINODE_S3_BUCKET is missing`)
    return cb()
  }

  client = new AWS.SESV2({
    credentials: {
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey
    },
    region: settings.region,
    endpoint: new AWS.Endpoint(settings.endpoint)
  })

  cb()
}

exports.sendEmail = (ToAddresses, subject, text, html, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  const params = {
    FromEmailAddress: ToAddresses[0],
    Destination: {
      ToAddresses
    },
    Content: {
      Simple: {
        Body: {}
      }
    }
  }

  if (subject) {
    params.Content.Simple.Subject = {
      Charset: 'UTF-8',
      Data: subject
    }
  }

  if (text) {
    params.Content.Simple.Body.Text = {
      Charset: 'UTF-8',
      Data: text
    }
  }

  if (html) {
    params.Content.Simple.Body.Html = {
      Charset: 'UTF-8',
      Data: html
    }
  }

  client.sendEmail(params, cb)
}
