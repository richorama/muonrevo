const React = require('react')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleValueChange(e) {
    if (e.key === 'Enter') this.handleSearch(e)
    this.setState({
      value: e.target.value
    })
  }

  handleSearch(e) {
    e.preventDefault()
    if (!this.state.value) return
    var value = this.state.value
    this.props.onSearch(value)
    this.setState({ value: '' })
  }

  render() {
    return (
      <form onClick={this.handleSearch} className="sidebar-form">
        <div className="input-group">
          <input
            type="text"
            ref="searchText"
            className="form-control"
            placeholder="Search..."
            value={this.state.value}
            onChange={this.handleValueChange}
          />
          <span className="input-group-btn">
            <button
              type="submit"
              name="search"
              id="search-btn"
              style={{color:'#e4e7ea'}}
              className="btn btn-flat"
            >
              <i className="icon-magnifier" />
            </button>
          </span>
        </div>
      </form>
    )
  }
}
