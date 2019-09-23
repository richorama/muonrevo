var React = require('react')
var Page = require('./page.jsx')
var Panel = require('./panel.jsx')

module.exports = class extends React.Component {
  render() {
    return (
      <div style={{ paddingTop: 20 }}>
        <div className="ui segment inverted container" style={{ fontSize: 24 }}>
          <h1>👋 Welcome!</h1>
          <p>
            MuonRevo is a markdown based note taking application, which uses
            dropbox for storage.
          </p>
          <p>
            The application requires access to your dropbox account, where it
            will read and write files in an 'Apps' folder. It will not have
            access to any other files in your account.
          </p>
          <p>
            <a href={this.props.url} className="huge ui blue button">
              <i className="ui icon dropbox" /> Log in with dropbox
            </a>
          </p>
        </div>
      </div>
    )
  }
}
