const React = require('react')

const menuItems = [
  {
    icon: 'copy outline'
  },
  {
    icon: 'search'
  },
  {
    icon: 'cog'
  }
]

const MainMenu = props => (
  <div>
    {menuItems.map(item => (
      <div style={{ paddingTop: 10, paddingBottom: 5 }}>
        <button
          className="ui massive grey icon button"
          style={{ background: '#282C34' }}
        >
          <i className={`icon ${item.icon}`} />
        </button>
      </div>
    ))}
  </div>
)

module.exports = MainMenu
