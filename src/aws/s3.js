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

  if (!settings.accessKeyId || !settings.secretAccessKey || !settings.region || !settings.bucket) {
    log.warn(`[aws/s3] client disabled because LINODE_ACCESS_KEY_ID, LINODE_SECRET_ACCESS_KEY, LINODE_DEFAULT_REGION, LINODE_S3_ENDPOINT and/or LINODE_S3_BUCKET is missing`)
    return cb()
  }

  client = new AWS.S3({
    credentials: {
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey
    },
    region: settings.region,
    endpoint: new AWS.Endpoint(settings.endpoint)  
  })

  cb()
}

exports.putObject = (Key, Body, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  client.putObject({
    Bucket: settings.bucket,
    Key,
    Body
  }, cb)
}

exports.getSignedUrl = (Key, Expires, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  client.getSignedUrl('getObject', {
    Bucket: settings.bucket,
    Key,
    Expires
  }, cb)
}