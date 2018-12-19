const React = require('react')

module.exports = class extends React.Component {
  render() {
    return (
      <ul className="nav navbar-nav">
        <li>
          <a>
            <i className={`fa fa-${this.props.icon}`} /> {this.props.message}
          </a>
        </li>
      </ul>
    )
  }
}
