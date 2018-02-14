var React = require('react');
module.exports = React.createClass({
    render:function(){
        return <ul className="nav navbar-nav">
            <li><a><i className={`fa fa-${this.props.icon}`}></i> {this.props.message}</a></li>
        </ul>
    }    
});