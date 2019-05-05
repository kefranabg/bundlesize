const gzip = require('gzip-size')

const getCompressedSize = (data, compression = 'gzip') => {
  let size
  switch (compression) {
    case 'gzip':
      size = gzip.sync(data)
      break
    case 'none':
    case 'brotli':
      size = require('brotli-size').sync(data)
      break
    default:
      size = Buffer.byteLength(data)
  }

  return size
}

module.exports = getCompressedSize
