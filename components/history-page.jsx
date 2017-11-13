var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var Loading = require('./loading.jsx');
var renderContent = require('../lib/renderContent');


function grouper(entries){
    if (!entries) return [];
    if (!entries.length) return [];
    
    var output = {};
    entries.forEach(x => {
        var day = x.client_modified.split('T')[0];
        if (!output[day]) output[day] = {day:day, items:[]};
        output[day].items.push(x);
    });
    var keys = Object.keys(output).sort();
    keys.reverse();
    return keys.map(key => output[key]);
}


var Files = React.createClass({
    render:function(){
        var items = [];

        grouper(this.props.files).forEach(group => {
            items.push(<li key={group.day} className="time-label"><span className="bg-gray">{group.day}</span></li>);

            group.items.forEach(file => {
                var style = "";
                if (file === this.props.selectedFile){ style = "active" }

                items.push(<li key={file.rev}><i className="fa fa-edit bg-blue"></i><div className={"timeline-item " + style}>
                        <span className="time"><i className="fa fa-clock-o"></i> {file.client_modified.split('T')[1]}</span>
                        
                        <h3 className="timeline-header"><a href="javascript:void(0);" onClick={this.props.onClick.bind(null, file)}>
                            {toDisplayName(file.name)}
                        </a></h3>
                </div></li>);
            });
   
        });
        items.push(<li key="end"><i className="fa fa-clock-o bg-gray"></i></li>);

        return <div style={{overflow:"auto", height:this.props.height}}>
            <ul className="timeline">
                {items}
            </ul>
        </div>
    

    }
});


var FilePreview = React.createClass({
    createMarkup : function() { 
        return {__html: renderContent(this.props.fileContent)}; 
    },
    render:function(){
        return <Panel title={toDisplayName(this.props.file.name)} noPadding={true}>
            <div style={{overflow:"auto", height:this.props.height, padding:"20px"}}>
                <If test={this.props.loading}>
                    <Loading/>
                    <div dangerouslySetInnerHTML={this.createMarkup()}></div>
                </If>
            </div>
        </Panel>
    }

});


module.exports = React.createClass({
    getInitialState:function(){
        return {
            selectedFile : null
        }
    },

    componentWillReceiveProps:function(newProps){
        var newState = {
            fileContent : newProps.fileContent,
            loading : false
        };
        
        this.setState(newState);
    },

    loadFile:function(){
        this.props.loadFile(this.state.selectedFile);
    },

    onClick:function(newFile){
        this.setState({selectedFile : newFile, fileContent : null, loading:true}, this.loadFile);
    },

    render:function(){

        var height = "calc(100vh - 150px)";
        if (this.props.path){
            height = "calc(100vh - 220px)"
        }

        return <Page>
            <div className="row">
                <div className="col-md-3">
                    <Files 
                        height={height}
                        files={this.props.revisions} 
                        onClick={this.onClick} 
                        selectedFile={this.state.selectedFile} />
                    
                </div>
                <div className="col-md-9">
                    <If test={this.state.selectedFile}>
                        <FilePreview height={height} file={this.state.selectedFile}  loading={this.state.loading} fileContent={this.state.fileContent} />     
                    </If>
                </div>
            </div>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}

function prettyDate(value){
    const parts = value.split('T');
    const hourParts = parts[1].split('.')[0].split(':');
    return `${parts[0]} ${hourParts[0]}:${hourParts[1]}`
  }
  