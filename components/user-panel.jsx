const React = require('react')

module.exports = class extends React.Component {
  render() {
    return (
      <ul className="nav navbar-nav">
        <li className="dropdown user user-menu">
          <a href="#/settings" className="dropdown-toggle">
            <img
              src={this.props.user.profile_photo_url}
              className="user-image"
              alt="User Image"
            />
            <span className="hidden-xs">
              {this.props.user.name.display_name}
            </span>
          </a>
        </li>
      </ul>
    )
  }
}
