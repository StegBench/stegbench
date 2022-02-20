const sg = require('any-steganography')
const variants = require('../variants')
const path = require('path')
const fs = require('fs')

const key = '70337336763979244226452948404D63'

async function encode (image, message, data) {
  return sg.write(image, message.toString('hex'), key)
}

async function decode (image, source, data) {
  const result = sg.decode(image, data.Format, key)
  return result ? Buffer.from(result, 'hex') : null
}


(async () => {
  console.log('StegBench32: any-steganography')
  fs.writeFileSync(path.join(__dirname, './results/StegBench32/any-steganography.json'), JSON.stringify(await variants.StegBench32(encode, decode)))

  console.log('StegBench32s: any-steganography')
  fs.writeFileSync(path.join(__dirname, './results/StegBench32s/any-steganography.json'), JSON.stringify(await variants.StegBench32s(encode, decode)))

  console.log('StegBench128: any-steganography')
  fs.writeFileSync(path.join(__dirname, './results/StegBench128/any-steganography.json'), JSON.stringify(await variants.StegBench128(encode, decode)))

  console.log('StegBench128s: any-steganography')
  fs.writeFileSync(path.join(__dirname, './results/StegBench128s/any-steganography.json'), JSON.stringify(await variants.StegBench128s(encode, decode)))
})()
