var React = require('react');

module.exports = React.createClass({

    renderFooter:function(){
        if (this.props.footer){
            return <div className="modal-footer">{this.props.footer}</div>
        }
        return null;
    },

    render:function(){
        return <div className="modal" style={{display:"block"}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
              {this.renderFooter()}
            </div>
          </div>
        </div>
    }
});
