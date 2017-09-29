var React = require('react');
var If = require('./if-else.jsx');

var Breadcrumbs = React.createClass({
    render:function(){
        if (!this.props.path) return null;

        var parts = this.props.path.split('/');
        var directories = [];
        for (var i = 0; i < parts.length; i++){
            var thisDirectory = [];
            for (var j = 0; j <= i; j++){
                thisDirectory.push(parts[j]);
            }
            directories.push({path : thisDirectory.join('/'), name : parts[i]});
        }

        directories[0].name = "root";

        return <ol className="breadcrumb">
            {directories.map(x => <li><a href={`#/path${x.path}`}><i className={"fa " + x.icon}></i> {x.name}</a></li>)}
        </ol>

    }
});

module.exports = React.createClass({
    render:function(){
        return <div>
            <If test={this.props.path}>
                <section className="content-header">
                    <h1><small><Breadcrumbs path={this.props.path} /></small></h1>
                </section>
            </If>
            <section className="content" style={{position:'relative'}}>
                {this.props.children}
            </section>
        </div>
    }
});


