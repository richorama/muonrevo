var React = require('react');

module.exports = React.createClass({
    renderRow:function(key, value){
        return <tr><td>{key}</td><td>{value}</td></tr>
    },
    render:function(){
        return <table className="table table-striped">
            <tbody>
                {Object.keys(this.props.properties).map(x => this.renderRow(x, this.props.properties[x]))}
            </tbody>
        </table>
    }
});
