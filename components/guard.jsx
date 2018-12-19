var React = require('react')

module.exports = class extends React.Component {
  render() {
    if (this.props.allow.indexOf(this.props.level) !== -1) {
      return this.props.children
    }
    return null
  }
}
