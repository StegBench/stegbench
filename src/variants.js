const stegbench = require('./stegbench')

async function StegBench32 (encode, decode) {
  return stegbench(encode, decode, 4, false)
}

async function StegBench32s (encode, decode) {
  return stegbench(encode, decode, 4, true)
}

async function StegBench128 (encode, decode) {
  return stegbench(encode, decode, 16, false)
}

async function StegBench128s (encode, decode) {
  return stegbench(encode, decode, 16, true)
}

module.exports = {StegBench32, StegBench32s, StegBench128, StegBench128s}
