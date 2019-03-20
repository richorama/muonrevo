const React = require('react')

module.exports = class extends React.Component {
  render() {
    if (this.props.children.length) {
      var body = this.props.children[0]
      var footer = (
        <div className="card-footer clearfix">{this.props.children[1]}</div>
      )
    } else {
      var body = this.props.children
      var footer = null
    }

    return (
      <div className={`card ${this.props.boxClass ? this.props.boxClass : ''}`}>
        <div className="card-header">
          {this.props.title}
          <small style={{ marginLeft: '10px' }}>{this.props.subTitle}</small>
        </div>
        <div
          className="card-body" style={(this.props.noPadding ? {padding:0} : {})}
        >
          {body}
        </div>
        {footer}
      </div>
    )
  }
}
