const React = require('react')
const If = require('./if-else.jsx')

const Breadcrumbs = class extends React.Component {
  render() {
    if (!this.props.path) return null

    var parts = this.props.path.split('/')
    var directories = []
    for (var i = 0; i < parts.length; i++) {
      var thisDirectory = []
      for (var j = 0; j <= i; j++) {
        thisDirectory.push(parts[j])
      }
      directories.push({ path: thisDirectory.join('/'), name: parts[i] })
    }

    directories[0].name = 'root'

    return (
      <ol className="breadcrumb" style={{ background: 'white' }}>
        {directories.map(x => (
          <li className="breadcrumb-item">
            <a href={`#/path${x.path}`}>
              <i className={'fa ' + x.icon} /> {x.name}
            </a>
          </li>
        ))}
      </ol>
    )
  }
}

module.exports = class extends React.Component {
  render() {
    return (
      <div>
        <If test={this.props.path}>
          <section className="content-header">
            <Breadcrumbs path={this.props.path} />
          </section>
        </If>
        <section className="content" style={{ position: 'relative' }}>
          {this.props.children}
        </section>
      </div>
    )
  }
}
