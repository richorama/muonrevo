var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');

module.exports = React.createClass({

    render:function(){
        
        return <Page>
            <Panel title="Welcome to MuonRevo">
                <div>
                    <p>
                        MuonRevo is a markdown based note taking application, which uses dropbox for storage.
                    </p>
                    <p>
                        The application requires access to your dropbox account, where it will read and write files in an 'Apps' folder.
                        It will not have access to any other files in your account.
                    </p>
                    <p><a href={this.props.url} className="btn btn-lg btn-primary" ><i className="fa fa-dropbox"></i> Log in with dropbox</a></p>
                </div>
            </Panel>
        </Page>
    }
});

