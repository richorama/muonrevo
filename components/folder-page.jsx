const React = require('react')
const Page = require('./page.jsx')
const Panel = require('./panel.jsx')
const If = require('./if-else.jsx')
const Loading = require('./loading.jsx')
const renderContent = require('../lib/renderContent')

let Files = class extends React.Component {
  render() {
    return (
      <Panel
        title={this.props.title ? `"${this.props.title}" Results` : 'Entries'}
        noPadding={true}
      >
        <div style={{ overflow: 'auto', height: this.props.height }}>
          <table className="table">
            <tbody>
              {this.props.files
                .filter(x => x['.tag'] === 'file')
                .reverse()
                .map(file => {
                  var style = ''
                  if (file === this.props.selectedFile) {
                    style = 'active'
                  }

                  return (
                    <tr key={file.id} className={style}>
                      <td
                        onClick={this.props.onClick.bind(null, file)}
                        style={{ cursor: 'pointer' }}
                      >
                        <a
                          href="javascript:void(0);"
                          onClick={this.props.onClick.bind(null, file)}
                        >
                          <strong>{toDisplayName(file.name)}</strong>
                          <p className="text-muted">
                            {prettyDate(file.client_modified)}
                          </p>
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </Panel>
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
      <Panel title={toDisplayName(this.props.file.name)} noPadding={true}>
        <div
          style={{
            overflow: 'auto',
            height: this.props.height,
            padding: '20px'
          }}
        >
          <If test={this.props.loading}>
            <Loading />
            <div dangerouslySetInnerHTML={this.createMarkup()} />
          </If>
        </div>
      </Panel>
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
    var height = 'calc(100vh - 150px)'
    if (this.props.path) {
      height = 'calc(100vh - 220px)'
    }

    return (
      <Page path={this.props.path}>
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
      </Page>
    )
  }
}

function toDisplayName(value) {
  return (value || '').replace('.md', '')
}

function prettyDate(value) {
  const parts = value.split('T')
  const hourParts = parts[1].split('.')[0].split(':')
  return `${parts[0]} ${hourParts[0]}:${hourParts[1]}`
}
