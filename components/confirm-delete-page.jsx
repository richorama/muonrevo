var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');

module.exports = React.createClass({

    render:function(){
        
        return <Page>
            <Panel title="Are you sure you want to delete this entry?" boxClass="box-danger">
                <div>
                    <p className="lead">{this.props.path}</p>
                    <p>The file cannot be recovered once deleted.</p>
                </div>
            </Panel>
        </Page>
    }
});

