var React = require('react')
var Page = require('./page.jsx')
var Panel = require('./panel.jsx')

module.exports = class extends React.Component {
  render() {
    return (
      <Page>
        <Panel
          title="Are you sure you want to delete this entry?"
          boxClass="box-danger"
        >
          <div>
            <p className="lead">{this.props.path}</p>
            <p>The file cannot be recovered once deleted.</p>
          </div>
        </Panel>
      </Page>
    )
  }
}
