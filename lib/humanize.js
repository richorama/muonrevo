var humanizeDuration = require('humanize-duration')

module.exports = function(date) {
  return humanizeDuration(new Date().getTime() - new Date(date).getTime(), {
    round: true,
    largest: 2
  })
}

//  2017-03-28T13:42:09.3233868
module.exports.prettyDate = function(value) {
  const parts = value.split('T')
  const hourParts = parts[1].split('.')[0].split(':')
  return `${parts[0]} ${hourParts[0]}:${hourParts[1]}`
}
