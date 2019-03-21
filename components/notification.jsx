const React = require('react')

module.exports = class extends React.Component {
  render() {
    return (
      <span className="badge badge-default">
        <i className={`icons icon-${this.props.icon}`} /> {this.props.message}
      </span>
    )
  }
}
