var React = require('react');

module.exports = React.createClass({

    getInitialState:function(){
        return {value:""};
    },

    handleValueChange:function(e){
        if (e.key === 'Enter') this.handleSearch(e);
        this.setState({
            value : e.target.value
        });
    },

    handleSearch:function(e){
        e.preventDefault();
        if (!this.state.value) return;
        var value = this.state.value;
        this.props.onSearch(value)
        this.setState({value:""});
    },

    render:function(){
        return <form onClick={this.handleSearch} className="sidebar-form">
            <div className="input-group">
                <input type="text" ref="searchText" className="form-control" placeholder="Search..." value={this.state.value} onChange={this.handleValueChange} />
                <span className="input-group-btn">
                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
                    </button>
                </span>
            </div>
        </form>
    }
});