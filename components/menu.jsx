var React = require('react');

var MenuSection = React.createClass({
    render:function(){
        var key = 0;
        return <li className={(this.props.active ? "active" : "") + " treeview"}>
           <a href={this.props.path}><i className={`fa ${this.props.icon || "bug"}`}></i> {this.props.name}</a>
        </li>
    }
});


var HeaderSection = React.createClass({
    render:function(){
        var key = 0;
        return <li className="header">
           {this.props.title}
        </li>
    }
});

module.exports = React.createClass({
    render:function(){
        return <ul className="sidebar-menu">
            {this.props.menu.map(x => {
                if (x.title){
                    return <HeaderSection title={x.title} />
                } else {
                    return <MenuSection active={x.active} icon={x.icon} name={x.name} path={x.path} />
                }
            })}
        </ul>
    }
});

