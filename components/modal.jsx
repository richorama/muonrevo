const React = require('react')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.renderFooter = this.renderFooter.bind(this)
  }

  renderFooter() {
    if (this.props.footer) {
      return <div className="modal-footer">{this.props.footer}</div>
    }
    return null
  }

  render() {
    return (
      <div className="modal" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">{this.props.children}</div>
            {this.renderFooter()}
          </div>
        </div>
      </div>
    )
  }
}
