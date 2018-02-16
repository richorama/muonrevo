var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var storage = require('../lib/storage');
var Dropdown = require('./dropdown.jsx');

module.exports = React.createClass({

    getInitialState:function(){
        return {
            theme : storage.get("editor-theme") || "vs",
            notificationValue : (storage.get("mute") === "true") ? 'Hide notifications' : 'Show notifications'
        };
    },

    updateParent:function(){
        this.props.onUpdate(this.state);
    },

    handleSignOut:function(){
        storage.del("accessToken");
        window.location.reload();
    },

    handleNewEditorTheme:function(_,newTheme){
        this.setState({
            theme:newTheme
        }, this.updateParent);
    },

    handleNotificationsChange:function(_, newValue){
        this.setState({
            notificationValue : newValue
        }, this.updateParent);
    },

    render:function(){
        return <Page>
            <Panel title="Settings">
                <div>

                    <div className="form-group row">
                        <label className="col-sm-2 control-label">Editor theme</label>
                        <div className="col-sm-10">
                            <Dropdown values={['vs', 'vs-dark', 'hc-black']} value={this.state.theme} onChange={this.handleNewEditorTheme} />
                            <p>The colour theme used by the text editor.</p>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 control-label">Account</label>
                        <div className="col-sm-10">
                            <p><a href="javascript:void(0);" onClick={this.handleSignOut} className="btn btn-primary" >Sign Out</a></p>
                            <p>Delete the stored dropbox access token and reload the application.</p>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 control-label">Dropbox notifications</label>
                        <div className="col-sm-10">
                            <Dropdown values={['Show notifications', 'Hide notifications']} value={this.state.notificationValue} onChange={this.handleNotificationsChange} />
                            <p>Control whether the dropbox client application shows notifications when files are created or updated.<br/>
                            Notifications will always be shown when files are deleted</p>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 control-label">About</label>
                        <div className="col-sm-10">
                            <p><i className="fa fa-twitter"></i> Developed by <a href="https://twitter.com/richorama" target="_blank">Richard Astbury</a></p>
                            <p><i className="fa fa-bug"></i> Report an issue <a href="https://github.com/richorama/muonrevo/issues/new" target="_blank">here</a></p>
                            <p><i className="fa fa-github"></i> Feel free to fork the <a href="https://github.com/richorama/muonrevo/" target="_blank">repository</a></p>
                        </div>
                    </div>

                </div>
            </Panel>
        </Page>
    }
});
