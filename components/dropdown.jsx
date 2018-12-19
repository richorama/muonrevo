var React = require('react')
var ReactDom = require('react-dom')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: this.props.value ? this.props.value : this.props.values[0]
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(e){
    var newValue = ReactDom.findDOMNode(this.refs['dropdown-control']).value
    this.setState({ selectedValue: newValue })
    if (this.props.onChange) this.props.onChange(e, newValue)
  }
  render() {
    return (
      <select
        className="form-control"
        ref="dropdown-control"
        onChange={this.handleChange}
        value={this.state.selectedValue}
        disabled={!!this.props.disabled}
      >
        {this.props.values.map(function(x) {
          if (typeof x === 'string') {
            var id = x
            var name = x
          } else {
            var id = x._key
            var name = x.name
          }
          return (
            <option value={id} key={id}>
              {name}
            </option>
          )
        })}
      </select>
    )
  }
}
