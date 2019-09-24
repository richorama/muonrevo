const React = require('react')
const Frag = React.Fragment
const renderContent = require('../lib/renderContent')
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
      <Frag>
        <h1>{toDisplayName(this.props.fileName)}</h1>
        <div
          ref="editContainer"
          style={{
            margin: '20px',
          }}
        >
          <div dangerouslySetInnerHTML={this.createMarkup()} />
        </div>
      </Frag>
    )
  }
}

function toDisplayName(value) {
  return (value || '').replace('.md', '')
}
