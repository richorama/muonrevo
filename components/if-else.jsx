const React = require('react')

module.exports = class extends React.Component {
  render() {
    var children = this.props.children.length
      ? this.props.children
      : [this.props.children, null]
    var child = this.props.test ? children[0] : children[1]
    return child
  }
}
