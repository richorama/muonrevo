var marked = require('marked')
var emoji = require('node-emoji')

module.exports = function(content) {
  return emoji.emojify(marked(content || ''))
}
