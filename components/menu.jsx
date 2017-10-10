var React = require('react');

var MenuSection = React.createClass({
    render:function(){
        return <li key={this.props.name} className={"treeview " + (this.props.active ? "active" : "")}><a href={this.props.path}><i className={`fa ${this.props.icon || "bug"}`}></i> {this.props.name}</a></li>
    }
});

var ClickSection = React.createClass({
    render:function(){
        return <li key={this.props.name} className={"treeview " + (this.props.active ? "active" : "")}><a href="javascript:void(0);" onClick={this.props.onClick}><i className={`fa ${this.props.icon || "bug"}`}></i> {this.props.name}</a></li>
    }
});

var HeaderSection = React.createClass({
    render:function(){
        var key = 0;
        return <li key={this.props.name} className="header">
           {this.props.title}
        </li>
    }
});

module.exports = React.createClass({
    render:function(){
        return <ul className="sidebar-menu">
            {this.props.menu.map(x => {
                if (x.title){
                    return <HeaderSection key={x.name} title={x.title} />
                } else if (x.onClick){
                    return <ClickSection key={x.name} icon={x.icon} name={x.name} onClick={x.onClick} active={x.active} />
                } else {
                    return <MenuSection key={x.name} icon={x.icon} name={x.name} path={x.path} active={x.active} />
                }
            })}
        </ul>
    }
});

