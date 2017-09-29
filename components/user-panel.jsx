var React = require('react');

module.exports = React.createClass({
    render:function(){
        return <ul className="nav navbar-nav">
            <li className="dropdown user user-menu">
                <a href="#/settings" className="dropdown-toggle">
                    <img src={this.props.user.profile_photo_url} className="user-image" alt="User Image" />
                    <span className="hidden-xs">{this.props.user.name.display_name}</span>
                </a>
            </li>
        </ul>
    }    
});


/*
<ul className="dropdown-menu">
                    <li className="user-header">
        
                        <img src={this.props.user.profile_photo_url} className="img-circle" alt="User Image" />
                        <p>
                            {this.props.user.name.display_name}
                            <small>{this.props.user.email}</small>
                        </p>
                    </li>
                    
                    <li className="user-footer">
                        <div className="pull-right">
                            <a href="#/logout" className="btn btn-default btn-flat">Sign out</a>
                        </div>
                    </li>
                    
                </ul>
*/
