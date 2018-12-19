var React = require('react')
var Page = require('./page.jsx')
var Panel = require('./panel.jsx')
var Monaco = require('react-monaco-editor').default
var storage = require('../lib/storage')
var eventThing = require('eventthing')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.content = this.props.fileContent || ''
    this.state = {
      height: window.innerHeight - 160
    }
    this.fullscreenRequested = false

    this.handleChange = this.handleChange.bind(this)
    this.handleEditorMount = this.handleEditorMount.bind(this)
    this.handleFullscreen = this.handleFullscreen.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.getStyle = this.getStyle.bind(this)
  }

  handleChange(value) {
    this.props.onUpdate({ content: value })
    this.content = value
  }

  handleEditorMount(editor) {
    this.editor = editor
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    eventThing.on('fullscreen', this.handleFullscreen)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    eventThing.clear('fullscreen', this.handleFullscreen)
  }

  handleFullscreen() {
    if (this.refs.editContainer.requestFullscreen) {
      this.refs.editContainer.requestFullscreen()
    } else if (this.refs.editContainer.webkitRequestFullscreen) {
      this.refs.editContainer.webkitRequestFullscreen()
    }
    // don't add the margin on the next resize
    this.fullscreenRequested = true
  }

  handleResize() {
    this.setState(
      {
        height: window.innerHeight - (this.fullscreenRequested ? 0 : 160)
      },
      () => this.editor.layout()
    )
    this.fullscreenRequested = false
  }

  getStyle() {
    if (this.props.fullscreen) {
      return {
        width: window.innerWidth
      }
    }
    return {}
  }

  render() {
    return (
      <Page>
        <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
          <div ref="editContainer" style={this.getStyle()}>
            <Monaco
              height={this.state.height}
              value={this.content}
              theme={storage.get('editor-theme') || 'vs'}
              language="markdown"
              options={{
                selectOnLineNumbers: true,
                lineNumbers: false,
                renderLineHighlight: 'none',
                fontSize: 18
              }}
              onChange={this.handleChange}
              editorDidMount={this.handleEditorMount}
            />
          </div>
        </Panel>
      </Page>
    )
  }
}

function toDisplayName(value) {
  return (value || '').replace('.md', '')
}
