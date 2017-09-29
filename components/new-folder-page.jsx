var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');

module.exports = React.createClass({
    getInitialState:function(){
        return {title:""};
    },

    updateParent:function(){
        this.props.onUpdate(this.state)
    },

    handleTitleChange:function(){
        this.setState({title:this.refs.title.value}, this.updateParent);
    },

    render:function(){
        
        return <Page>
            <Panel title="Add a new folder">
                <div>

                    <div>
                        <input className="form-control input-lg" type="text" placeholder="Enter a folder name..." value={this.state.title} onChange={this.handleTitleChange} ref="title" />
                    </div>

                 
                </div>
            </Panel>
        </Page>
    }
});

