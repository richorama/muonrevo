var React = require('react');

module.exports = React.createClass({
  render:function(){
    if (this.props.allow.indexOf(this.props.level) !== -1){
      return this.props.children;
    }
    return null;
  }
});
