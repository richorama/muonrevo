const React = require('react')

module.exports = class extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div
          style={{
            width: 250,
            background: '#1b1c1d',
            color: 'silver',
            padding: 2,
            overflow: 'auto'
          }}
        >
          {this.props.children[0]}
        </div>
        <div style={{ flex: 1, background: '#111' }}>
          {this.props.children[1]}
        </div>
      </div>
    )
  }
}
