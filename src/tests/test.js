const path = require('path')
const fs = require('fs')

const variants = require('../variants')
const any_steganography = require('./algorithms/any-steganography')

const benchmarks = ['StegBench32', 'StegBench32s', 'StegBench128', 'StegBench128s'];

(async () => {
  const algorithms = [
    { name: 'any-steganography', functions: any_steganography }
  ]

  for (const algorithm of algorithms) {
    for (const benchmark of benchmarks) {
      console.log(benchmark + ': ' + algorithm.name)
      fs.writeFileSync(path.join(__dirname, './results/' + benchmark + '/' + algorithm.name + '.json'), JSON.stringify(await variants.StegBench32(algorithm.functions.encode, algorithm.functions.decode)))
    }
  }
})()
