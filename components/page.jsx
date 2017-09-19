var React = require('react');
var If = require('./if-else.jsx');

module.exports = React.createClass({
    render:function(){
        return <section className="content" style={{position:'relative'}}>
                {this.props.children}
            </section>
    }
});
