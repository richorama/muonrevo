var React = require('react')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
  }
  renderRow(key, value) {
    return (
      <tr>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    )
  }
  render() {
    return (
      <table className="table table-striped">
        <tbody>
          {Object.keys(this.props.properties).map(x =>
            this.renderRow(x, this.props.properties[x])
          )}
        </tbody>
      </table>
    )
  }
}
