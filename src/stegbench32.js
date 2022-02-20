const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const Jimp = require('jimp')

async function stegbench32 (encode, decode) {
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
    const message = crypto.randomBytes(4)
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
      const result = await decode(output, images[i], data[i])
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
    const message = crypto.randomBytes(4)
    const test = { test: data, name: 'test' }
    try {
      const output = await encode(images[0], message, data[0])
      const result = await decode(output, images[0], data[0])
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

module.exports = stegbench32
