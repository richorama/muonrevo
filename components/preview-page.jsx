var React = require('react')
var Page = require('./page.jsx')
var Panel = require('./panel.jsx')
var renderContent = require('../lib/renderContent')
var eventThing = require('eventthing')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.createMarkup = this.createMarkup.bind(this)
    this.handleFullscreen = this.handleFullscreen.bind(this)
  }

  createMarkup() {
    return { __html: renderContent(this.props.fileContent) }
  }

  componentDidMount() {
    eventThing.on('fullscreen', this.handleFullscreen)
  }

  componentWillUnmount() {
    eventThing.clear('fullscreen', this.handleFullscreen)
  }

  handleFullscreen() {
    if (this.refs.editContainer.requestFullscreen) {
      this.refs.editContainer.requestFullscreen()
      return
    }
    if (this.refs.editContainer.webkitRequestFullscreen) {
      this.refs.editContainer.webkitRequestFullscreen()
      return
    }
  }

  render() {
    return (
      <Page>
        <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
          <div
            ref="editContainer"
            style={{
              overflow: 'auto',
              height: 'calc(100vh - 150px)',
              margin: '20px',
              background: 'white'
            }}
          >
            <div dangerouslySetInnerHTML={this.createMarkup()} />
          </div>
        </Panel>
      </Page>
    )
  }
}

function toDisplayName(value) {
  return (value || '').replace('.md', '')
}
