const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const Jimp = require('jimp')
const sharp = require('sharp')

const cases = []

cases.push({
  name: 'scale-down-sm',
  function: (result) => sharp(result).resize(852, 480).toBuffer()
})

cases.push({
  name: 'scale-down-nonlinear',
  function: (result) => sharp(result).resize(320, 240).toBuffer()
})

cases.push({
  name: 'scale-down-xs',
  function: (result) => sharp(result).resize(256, 144).toBuffer()
})

cases.push({
  name: 'scale-up',
  function: (result) => sharp(result).resize(2560, 1440).toBuffer()
})

cases.push({
  name: 'compress-98',
  function: (result) => sharp(result).jpeg({ quality: 98 }).toBuffer()
})

cases.push({
  name: 'compress-75',
  function: (result) => sharp(result).jpeg({ quality: 75 }).toBuffer()
})

cases.push({
  name: 'noise-1',
  function: async (result) => {
    const noise = await sharp({
      create: {
        width: 1280,
        height: 720,
        channels: 3,
        noise: {
          type: 'gaussian',
          mean: 0,
          sigma: 3
        }
      }
    })
    return sharp(result).composite(noise).toBuffer()
  }
})

cases.push({
  name: 'noise-10',
  function: async (result) => {
    const noise = await sharp({
      create: {
        width: 1280,
        height: 720,
        channels: 3,
        noise: {
          type: 'gaussian',
          mean: 0,
          sigma: 26
        }
      }
    })
    return sharp(result).composite(noise).toBuffer()
  }
})

cases.push({
  name: 'rotate-ccw',
  function: (result) => sharp(result).rotate().toBuffer()
})

cases.push({
  name: 'mirror-y',
  function: (result) => sharp(result).flip().toBuffer()
})

cases.push({
  name: 'mirror-x',
  function: (result) => sharp(result).flop().toBuffer()
})

cases.push({
  name: 'crop-corner',
  function: (result) => sharp(result).extract({ top: 640, left: 0, width: 640, height: 360 }).toBuffer()
})

cases.push({
  name: 'crop-center',
  function: (result) => sharp(result).extract({ top: 640, left: 360, width: 320, height: 180 }).toBuffer()
})

cases.push({
  name: 'overlay',
  function: async (result) => {
    const overlay = await sharp(fs.readFileSync(path.join(__dirname, '/images/overlay.png')))
    return sharp(result).composite(overlay).toBuffer()
  }
})

cases.push({
  name: 'brightness',
  function: (result) => sharp(result).modulate({ brightness: 1.05 }).toBuffer()
})

cases.push({
  name: 'contrast',
  function: (result) => sharp(result).linear(1.15, -(128 * 1.15) + 128).toBuffer()
})

async function stegbench (encode, decode, bytes = 4, stateful = false) {
  // Setup Scoring
  let speed = 0
  let subtlety = 0
  let correctness = 0
  let resilience = 0
  let total = 0
  const tests = []

  // Prepare Test Data
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '/images/data.json')))
  const images = data.map(i => fs.readFileSync(path.join(__dirname, '/images/', i['File Name'])))

  // Stage 1
  for (let i = 1; i <= 10; i++) {
    console.log('Running test ' + i + '/26')
    const message = crypto.randomBytes(bytes)
    const test = { test: data[i], speed: 0, subtlety: 0, correctness: 0 }
    try {
      const estart = Date.now()
      const output = await encode(images[i], message, data[i])
      const e = Date.now() - estart

      const image1 = await Jimp.read(images[i])
      const image2 = await Jimp.read(output)
      const p = Jimp.diff(image1, image2, 0.005).percent
      const h = Jimp.distance(image1, image2)
      test.subtlety = Math.max(0, (0.3 - (h + p)) / 0.15)

      const dstart = Date.now()
      const result = await decode(output, stateful ? images[i] : null, data[i])
      const d = Date.now() - dstart

      const s = data[i].Width * data[i].Height

      const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
      test.speed = clamp(2.05 - ((1000 * (e + d)) / (s)), 0, 2)

      if (result.length === 0) {
        test.result = 'empty'
        test.correctness = 0.5
      } else if (message.equals(result)) {
        test.result = 'correct'
        test.correctness = 2.0
        total += test.correctness
        total += test.subtlety
        total += test.speed
      } else {
        test.result = 'incorrect'
        test.correctness = 0
      }
    } catch (e) {
      test.result = 'error'
      test.error = e
      test.correctness = 0.5
    }
    correctness += test.correctness
    subtlety += test.subtlety
    speed += test.speed
    tests.push(test)
  }

  // Stage 2
  for (let i = 0; i < 16; i++) {
    console.log('Running test ' + (11 + i) + '/26')
    const message = crypto.randomBytes(4)
    const test = { test: data, name: cases[0].name }
    try {
      const output = await encode(images[0], message, data[0])
      const transformed = await cases[0].function(output)
      const result = await decode(transformed, stateful ? images[0] : null, data[0])
      if (result.length === 0) {
        test.result = 'empty'
        test.resilience = 0.5
      } else if (message.equals(result)) {
        test.result = 'correct'
        test.resilience = 2.5
      } else {
        test.result = 'incorrect'
        test.resilience = 0
      }
    } catch (e) {
      test.result = 'error'
      test.error = e
      test.resilience = 0.5
    }
    resilience += test.resilience
    total += test.resilience
    tests.push(test)
  }

  const score = { speed, subtlety, correctness, resilience, total }
  const result = { score, tests }
  console.log(score)
  return result
}

module.exports = stegbench
