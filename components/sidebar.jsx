const React = require('react')
const Frag = React.Fragment
const dbxUtil = require('../lib/dbxUtils')

const RenderList = props => (
  <Frag>
    <div style={{ fontWeight: 'bold', padding: 8, background: '#282C34' }}>
      {props.title}
    </div>
    <div style={{ padding: 4 }}>
      {props.values.map(item => (
        <div
          key={item.name}
          style={{ padding: 4, cursor: 'pointer' }}
          onClick={props.onClick.bind(null, item)}
        >
          <i className={item.icon || props.icon} /> {item.name}
        </div>
      ))}
    </div>
  </Frag>
)

const Sidebar = class extends React.Component {
  constructor(props) {
    super(props)
    this.getFiles = this.getFiles.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleFolderClick = this.handleFolderClick.bind(this)
    this.state = {
      path: '',
      files: [],
      folders: [],
      loading: true
    }
  }

  componentDidMount() {
    this.dbx = dbxUtil.getDbx()
    this.getFiles()
  }

  getFiles() {
    this.dbx
      .filesListFolder({ path: this.state.path })
      .then(data => {
        console.log(data)
        this.setState({
          folders: data.entries.filter(x => x['.tag'] === 'folder'),
          files: data.entries.filter(x => x['.tag'] === 'file'),
          loading: false
        })
      })
      .catch(this.handleError)
  }

  handleError(err) {
    console.log(err)
  }

  handleFolderClick(folder) {
    this.setState({ path: folder.path_lower, loading: true }, this.getFiles)
  }

  renderFolders() {
    const folders = [...this.state.folders]
    if (this.state.path) {
      const path = this.state.path.split('/')
      path.pop()
      const parent = path.join('/')
      folders.unshift({
        name: 'Parent Folder',
        icon: 'icon arrow alternate circle left outline',
        path_lower: parent
      })
    }
    if (!folders.length) {
      return null
    }
    return (
      <RenderList
        icon="icon folder outline"
        title="FOLDERS"
        onClick={this.handleFolderClick}
        values={folders}
      />
    )
  }

  renderFiles() {
    if (!this.state.files.length) {
      return null
    }
    return (
      <RenderList
        icon="icon file alternate outline"
        title="FILES"
        onClick={this.handleFolderClick}
        values={this.state.files}
      />
    )
  }

  render() {
    if (this.state.loading) return <span>Loading...</span>
    return (
      <Frag>
        {this.renderFolders()}
        {this.renderFiles()}
      </Frag>
    )
  }
}

module.exports = Sidebar
