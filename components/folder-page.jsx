const React = require('react')
const Page = require('./page.jsx')
const Panel = require('./panel.jsx')
const If = require('./if-else.jsx')
const Loading = require('./loading.jsx')
const renderContent = require('../lib/renderContent')

let Files = class extends React.Component {
  render() {
    return (
      <div style={{ overflow: 'auto', height: this.props.height }}>
        <div className="list-group">
          {this.props.files
            .filter(x => x['.tag'] === 'file')
            .reverse()
            .map(file => {
              return (
                <a
                  key={file.name}
                  href="javascript:void(0);"
                  onClick={this.props.onClick.bind(null, file)}
                  className={
                    file === this.props.selectedFile
                      ? 'list-group-item list-group-item-action active'
                      : 'list-group-item-action list-group-item '
                  }
                >
                  <h5>{toDisplayName(file.name)}</h5>
                  <p style={{ marginBottom: 0 }}>
                    {prettyDate(file.client_modified)}
                  </p>
                </a>
              )
            })}
        </div>
      </div>
    )
  }
}

const FilePreview = class extends React.Component {
  constructor(props) {
    super(props)
    this.createMarkup.bind(this)
  }
  createMarkup() {
    return { __html: renderContent(this.props.fileContent) }
  }
  render() {
    return (
      <div
        style={{
          overflow: 'auto',
          height: this.props.height
        }}
      >
        <If test={this.props.loading}>
          <Loading />
          <div className="list-group">
            <div className="list-group-item">
              <div dangerouslySetInnerHTML={this.createMarkup()} />
            </div>
          </div>
        </If>
      </div>
    )
  }
}

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedFile: null }

    this.loadFile = this.loadFile.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  componentWillReceiveProps(newProps) {
    var newState = {
      fileContent: newProps.fileContent,
      loading: false
    }

    this.setState(newState)
  }

  loadFile() {
    this.props.loadFile(this.state.selectedFile)
  }

  onClick(newFile) {
    this.setState(
      { selectedFile: newFile, fileContent: null, loading: true },
      this.loadFile
    )
  }

  render() {
    var height = 'calc(100vh - 195px)'
    if (this.props.path) {
      height = 'calc(100vh - 240px)'
    }

    return (
      <Page path={this.props.path}>
        <Panel title="Notes">
          <div className="row">
            <div className="col-md-3">
              <Files
                height={height}
                title={this.props.searchTerm}
                files={this.props.files}
                onClick={this.onClick}
                selectedFile={this.state.selectedFile}
              />
            </div>
            <div className="col-md-9">
              <If test={this.state.selectedFile}>
                <FilePreview
                  height={height}
                  file={this.state.selectedFile}
                  loading={this.state.loading}
                  fileContent={this.state.fileContent}
                />
              </If>
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

function prettyDate(value) {
  return new Date(value).toLocaleString()
}
