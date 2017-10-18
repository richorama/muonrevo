var React = require('react');

module.exports = React.createClass({
    handleSearch:function(e){
        e.preventDefault();
        if (!this.refs.searchText.value) return;
        this.props.onSearch(this.refs.searchText.value)
    },

    render:function(){
        return <form onClick={this.handleSearch} className="sidebar-form">
            <div className="input-group">
                <input type="text" ref="searchText" className="form-control" placeholder="Search..." />
                <span className="input-group-btn">
                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
                    </button>
                </span>
            </div>
        </form>
    }
});