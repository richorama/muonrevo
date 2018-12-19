var React = require('react')

const MenuSection = class extends React.Component {
  render() {
    return (
      <li
        key={this.props.name}
        className={'treeview ' + (this.props.active ? 'active' : '')}
      >
        <a href={this.props.path}>
          <i className={`fa ${this.props.icon || 'bug'}`} /> {this.props.name}
        </a>
      </li>
    )
  }
}

const ClickSection = class extends React.Component {
  render() {
    return (
      <li
        key={this.props.name}
        className={'treeview ' + (this.props.active ? 'active' : '')}
      >
        <a href="javascript:void(0);" onClick={this.props.onClick}>
          <i className={`fa ${this.props.icon || 'bug'}`} /> {this.props.name}
        </a>
      </li>
    )
  }
}

const HeaderSection = class extends React.Component {
  render() {
    var key = 0
    return (
      <li key={this.props.name} className="header">
        {this.props.title}
      </li>
    )
  }
}

module.exports = class extends React.Component {
  render() {
    return (
      <ul key="menu" className="sidebar-menu">
        {this.props.menu
          .filter(x => {
            if (x.show) return x.show()
            return true
          })
          .map(x => {
            if (x.title) {
              return <HeaderSection key={x.name} title={x.title} />
            } else if (x.onClick) {
              return (
                <ClickSection
                  key={x.name}
                  icon={x.icon}
                  name={x.name}
                  onClick={x.onClick}
                  active={x.active}
                />
              )
            } else {
              return (
                <MenuSection
                  key={x.name}
                  icon={x.icon}
                  name={x.name}
                  path={x.path}
                  active={x.active}
                />
              )
            }
          })}
      </ul>
    )
  }
}
