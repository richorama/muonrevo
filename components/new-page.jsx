const React = require('react')
const Page = require('./page.jsx')
const Panel = require('./panel.jsx')
const Monaco = require('react-monaco-editor').default
const storage = require('../lib/storage')
const eventThing = require('eventthing')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title || '',
      content: this.props.fileContent || '',
      height: window.innerHeight - 200
    }
    this.fullscreenRequested = false

    this.updateParent = this.updateParent.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleEditorMount = this.handleEditorMount.bind(this)
    this.handleFullscreen = this.handleFullscreen.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  updateParent() {
    this.props.onUpdate(this.state)
  }

  handleChange(value) {
    this.setState({ content: value }, this.updateParent)
  }

  handleTitleChange() {
    this.setState({ title: this.refs.title.value }, this.updateParent)
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
        height: window.innerHeight - (this.fullscreenRequested ? 0 : 200)
      },
      () => this.editor.layout()
    )
    this.fullscreenRequested = false
  }

  render() {
    return (
      <Page>
        <Panel title="Add a new entry" noPadding={true}>
          <div>
            <div>
              <input
                className="form-control input-lg"
                type="text"
                placeholder="Enter a title..."
                value={this.state.title}
                onChange={this.handleTitleChange}
                ref="title"
              />
            </div>

            <div ref="editContainer">
              <Monaco
                height={this.state.height}
                value={this.state.content || ''}
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
          </div>
        </Panel>
      </Page>
    )
  }
}

function toDisplayName(value) {
  return (value || '').replace('.md', '')
}
