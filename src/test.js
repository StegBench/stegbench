const sg = require('any-steganography')
const stegbench32 = require('./stegbench32')

const key = '70337336763979244226452948404D63'

async function encode (image, message, data) {
  return sg.write(image, message.toString('hex'), key)
}

async function decode (image, source, data) {
  const result = sg.decode(image, data.Format, key)
  return result ? Buffer.from(result, 'hex') : null
}

stegbench32(encode, decode)
