/** @jsx React.DOM */

var page = this;

var ComponentTable = React.createClass({
    getDefaultProps: function(){
        return {
            initialRows: [],
            url: '../Home/JsonComponentTable',
            updateUrl: '../Home/UpdateBoundRecord',
            initialDataSources: [{name: null, data: null}],
            editable: false,
            editMode: false,
            onRowClick: function(){},
            onCellClick: function(){},
            onHeaderClick: function(){}
        };
    },
    getInitialState: function(){
        return {
            rows: this.props.initialRows,
            headers: [],
            selectedItems: [{ record: null, property: null }],
            addingRecord: false
        };
    },
    poller: null,
    componentDidMount: function(){
    	var self = this;

    	$.get(self.props.url, function(response){
    		self.setState(response);
    	});

    	this.poller = setInterval(function(){
	    	$.get(self.props.url, function(response){
	    		console.log(response);
	    		self.setState(response);
	    	});
    	}, 2000);
    },
    componentWillUnmount: function(){
    	clearInterval(this.poller);
    },
    render: function(){   
    	var self = this;
    	var tableRows = self.state.rows.map(function(row, i){
    		var rowCells = row.components.map(function(component, j){
    			component.props.onCellClick = self.handleCellClick;
    			component.props.onFieldChange = self.handleFieldChange;
				return <td key={i+'.'+j}>{window[component.type](component.props)}</td>;
    		});
    		return <tr key={i}>{rowCells}</tr>;
    	});
    	return (
    		<div>
    			<table>
    				{tableRows}
    			</table>
    			<button onClick={this.handleAddClick}>Add Customer</button>
    			<span hidden={!this.state.addingRecord}>Adding New Customer to Database...</span>
    		</div>
    	);

    	/*return self.state.rows.map(function(row, i){
    		row.components.map(function(component, j){
    			component.props.onCellClick = self.handleCellClick;
    			component.props.key = i+'.'+j;
	    		return (
	    			<td>
	    				{window[component.type](component.props)}
	    			</td>
	    		);
    		});
    	});*/
    },
    handleAddClick: function(){
    	var self = this;
    	self.setState({ addingRecord: true });
    	$.post('../Home/AddCustomer',
    		function(response){
    			response.addingRecord = false;
    			self.setState(response);
    		}
    	);
    },
    handleCellClick: function(event){
        console.log('reached table');
        console.log(event);
    },
    handleFieldChange: function(e){
    	var request = {
    		boundRecord: e.boundRecord,
    		newValue: e.value,
    		fieldToUpdate: e.name
    	};
    	$.ajax({
    			url: this.props.updateUrl,
    			type: 'POST',
    			contentType: 'application/json',
    			data: JSON.stringify(request),
    			success: function(response){
    				console.log(response);
    			}
    		}
    	);
    }
});

var TestCell = React.createClass({
	getDefaultProps: function(){
		return { onCellClick: function(){} };
	},
	render: function(){
		return <span onClick={this.handleCellClick}>{this.props.text}</span>;
	},
	handleCellClick: function(){
		this.props.onCellClick(this.props.text);
	}
});

var TextBox = React.createClass({
    propTypes: {
        //defaultValue: React.PropTypes.string,
        value: React.PropTypes.string
    },
    mixins: [BindableMixin],
    getDefaultProps: function(){
        return {
        	onFieldChange: function(){},
        	onBlur: function(){}, 
        	onFieldBlur: function(){}
        };
    },
    render: function(){
        return <input defaultValue={this.props.defaultValue || this.props.value} ref="input"
                      onChange={this.handleChange}
                      onBlur={this.handleBlur} />;
    },
    componentWillReceiveProps: function(nextProps){
    	var inputField = this.refs.input.getDOMNode();
        if (typeof nextProps.defaultValue != "undefined"){
            inputField.value = nextProps.defaultValue;  
        } else if (typeof nextProps.value != "undefined"){
        	if (inputField !== document.activeElement){
            	inputField.value = nextProps.value;  
        	}
        }
    },
    handleChange: function(e){
        this.props.onFieldChange({
        	name: this.props.name,
        	value: e.target.value,
        	boundRecord: this.props.boundRecord
        });
    },
    handleBlur: function(e){
        this.props.onFieldBlur({ name: this.props.name, value: e.target.value });
    }
});

var BindableMixin = {
	getDefaultProps: function(){
		return {
			boundRecord: {
				entityClass: null,
				primaryKey: null,
				value: null
			},
			updateUrl: null
		};
	},
	submitUpdate: function(){
		$.post(
			this.props.updateUrl,
			this.props.boundField,
			function(){
				alert('success');
			}
		);
	}
}

React.renderComponent(
	<ComponentTable url='../Home/CustomerTable' />,
	document.getElementById('react')
);

/*
React.renderComponent(
	<ComponentTable
		initialRows = {[
			{ record: null,
			  components: [
			  	{ type: 'TestCell', props: {text:'success'}},
			  	{ type: 'TestCell', props: {text:'win'}}
			  ]
			},
			{ record: null,
			  components: [
			    { type: 'TestCell', props: {text:'baws'}},
			    { type: 'TestCell', props: {text:'epic'}}
			  ]
			}
		]} />,
	document.getElementById('react')
);
*/