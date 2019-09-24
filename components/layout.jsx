const React = require('react')

module.exports = class extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div
          style={{
            width: 70,
            background: '#282C34',
            color: 'silver',
            padding: 2,
            overflow: 'auto'
          }}
        >
          {this.props.children[0]}
        </div>
        <div
          style={{
            width: 250,
            background: '#21252B',
            color: 'silver',
            padding: 0,
            overflow: 'auto'
          }}
        >
          {this.props.children[1]}
        </div>
        <div style={{ flex: 1, background: '#21252B' }}>
          {this.props.children[2]}
        </div>
      </div>
    )
  }
}
