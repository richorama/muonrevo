var React = require('react');

module.exports = React.createClass({
	render:function(){
		var children = this.props.children.length ? this.props.children : [this.props.children,null];
		var child = this.props.test ? children[0] : children[1];
		return child
	}
});
