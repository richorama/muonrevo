var React = require('react');
var ReactDom = require('react-dom');

module.exports = React.createClass({
	getInitialState:function(){
		return {
			selectedValue: this.props.value ? this.props.value : this.props.values[0]
		};
	},
	handleChange:function(e){
		var newValue = ReactDom.findDOMNode(this.refs["dropdown-control"]).value;
		this.setState({selectedValue : newValue});
		if (this.props.onChange) this.props.onChange(e, newValue);
	},
	render: function(){
		var that = this;
		return <select className="form-control" ref="dropdown-control" onChange={this.handleChange} value={this.state.selectedValue} disabled={!!this.props.disabled}>
			{ this.props.values.map(function(x){
				if (typeof x === "string"){
					var id = x;
					var name = x;
				} else {
					var id = x._key;
					var name = x.name;
				}
				return <option value={id} key={id}>{name}</option>
			}) }
		</select>
	}
});
