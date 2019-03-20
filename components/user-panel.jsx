const React = require('react')

module.exports = class extends React.Component {
  render() {
    return (
      <a href="#/settings" className="nav-link">
        <img
          src={this.props.user.profile_photo_url}
          className="img-avatar"
          alt="User Image"
        />
        <span className="hidden-xs">{this.props.user.name.display_name}</span>
      </a>
    )
  }
}
