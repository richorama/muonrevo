var React = require('react');

module.exports = React.createClass({
    render:function(){
        return <section className="content" style={{height:"100vh"}}>
            <span style={{paddingTop: "25px"}}><i className="fa fa-spinner fa-pulse fa-fw"></i>Loading...</span>
        </section>
    }
});
