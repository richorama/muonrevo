var React = require('react')

const MenuSection = class extends React.Component {
  render() {
    return (
      <li
        key={this.props.name}
        className="nav-item"
      >
        <a href={this.props.path} className={'nav-link ' + (this.props.active ? 'active' : '')}>
          <i className={`nav-icon ${this.props.icon || 'bug'}`} /> {this.props.name}
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
        className={'nav-item'}
      >
        <a className={'nav-link ' + (this.props.active ? 'active' : '')} href="javascript:void(0);" onClick={this.props.onClick}>
          <i className={`nav-icon ${this.props.icon || 'bug'}`} /> {this.props.name}
        </a>
      </li>
    )
  }
}

const HeaderSection = class extends React.Component {
  render() {
    return (
      <li key={this.props.name} className="nav-title">
        {this.props.title}
      </li>
    )
  }
}

module.exports = class extends React.Component {
  render() {
    return (
      <ul key="menu" className="nav">
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
