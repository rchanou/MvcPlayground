/** @jsx React.DOM */

var page = this;

var ComponentTable = React.createClass({
    getDefaultProps: function(){
        return {
            headers: [],
            initialRows: [],
            url: '../Home/JsonComponentTable',
            updateUrl: '../Home/UpdateBoundRecord',
            deleteUrl: '../Home/DeleteBoundRecord',
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

        self.poller = setInterval(
            function(){
                $.get(self.props.url, function(response){
                    console.log(response);
                    self.setState(response);
                });
            },
            2000
        );
    },
    componentWillUnmount: function(){
        clearInterval(this.poller);
    },
    render: function(){   
        console.log('render');
        var self = this;
        var tableHeaders = self.state.headers.map(function(header, i){
            return <th><strong>{header}</strong></th>;
        });
        var tableRows = self.state.rows.map(function(row, i){
            console.log(row);
            var rowCells = row.components.map(function(component, j){
                component.props.onCellClick = self.handleCellClick;
                component.props.onFieldChange = self.handleFieldChange;
                return <td key={i+'.'+j}>{window[component.type](component.props)}</td>;
            });
            return (
                <tr key={i}>
                    {rowCells}
                    {/*<td><DeleteButton boundRecord={row.record} onDeleteClick={self.handleDeleteClick} /></td>*/}
                </tr>
            );
        });
        return (
            <div>
                <table>
                    <tr>
                        {tableHeaders}
                    </tr>
                    {tableRows}
                </table>
                <button onClick={this.handleAddClick}>Add Customer</button>
                {this.state.addingRecord? <span>Adding New Customer to Database...</span> : <span></span>}
            </div>
        );
    },
    handleAddClick: function(){
        var self = this;
        self.setState(
            { addingRecord: true },
            function(){
                $.post(
                    '../Home/AddCustomer',
                    function(response){
                        self.setState(
                            response, 
                            function(){
                                self.setState({ addingRecord: false });
                            }
                        );
                    }
                ); 
            }
        );
    },
    handleDeleteClick: function(boundRecord){
        console.log('delete');
        console.log(boundRecord);
        var request = {
            boundRecord: boundRecord
        };

        $.post(
            '../Home/DeleteCustomer',
            request,
            function(response){
                self.setState(
                    response, 
                    function(){
                        //self.setState({ addingRecord: false });
                    }
                );
            }
        );
    },
    handleCellClick: function(e){
        console.log('reached table');
        console.log(e);
    },
    handleFieldChange: function(e){
        var self = this;
        var request = {
            boundRecord: e.boundRecord,
            newValue: e.value,
            fieldToUpdate: e.name
        };
        _.debounce(function(){
            console.log('posting update');
            $.ajax({
                url: self.props.updateUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(request),
                success: function(response){
                    console.log(response);
                }
            });
        }, 500).call();
    }
});

var DeleteButton = React.createClass({
    getDefaultProps: function(){
        return { boundRecord: null };
    },
    render: function(){
        return <button onClick={this.handleDeleteClick}>X</button>;
    },
    handleDeleteClick: function(){
        this.props.onDeleteClick(this.props.boundRecord);
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
        return <input defaultValue={this.props.defaultValue || this.props.value}
                ref="input"
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

var ComboBox = React.createClass({
    mixins: [BindableMixin],
    getDefaultProps: function(){
        return {
            sourceList: [
                {value:1, label:'pizza'},
                {value:2, label:'burgers'},
                {value:3, label:'bbq'}
            ],
            sourceUrl: null, name: "EmpID", onFieldChange: function(){}, onFieldBlur: function(){}, onFieldComplete: function(){} };
    },
    getInitialState: function(){
        return { selectedValue: this.props.initialValue, list: [] };
    },
    render: function(){
        //console.log('received context ' + JSON.stringify(this.context));
        return <input ref="combo" 
            onChange={this.handleChange} onBlur={this.handleBlur} onClick={this.handleClick} onKeyDown={this.handleKeyDown}/>;
    },
    componentDidMount: function(){
        if (this.props.sourceList){

        } else if (this.props.sourceUrl) {
            $.getJSON(
                this.props.sourceUrl, 
                function(response){
                    this.setState(
                        { list: response },
                        function(){
                            this.syncLabel();
                        }.bind(this)
                    );

                $(this.getDOMNode())
                .autocomplete({
                    source: response, 
                     delay: 0, 
                     minLength: 0,
                     select: function(event, ui){
                        this.setState(
                            { selectedValue: ui.item.value },
                            function(){
                                this.syncLabel();
                                console.log('selected combo ' + ui.item.value);
                                this.props.onFieldChange({ name: this.props.name, value: this.state.selectedValue });
                                // should this be here? you decide
                                this.props.onFieldBlur();
                            }.bind(this));
                        return false;
                     }.bind(this),
                    focus: function(event, ui){
                        return false;
                    }
                });
            }.bind(this));
        }
    },
    syncLabel: function(){
        console.log('sync label ' + this.state.selectedValue);
        if (this.state.selectedValue == null){
            this.refs.combo.getDOMNode().value = "";
            return;
        }
        var result = _.find(this.state.list, function(item){
                                return (item.value+"".toLowerCase() == this.state.selectedValue+"".toLowerCase());
                           }.bind(this));
        if (typeof result == "undefined"){
            this.refs.combo.getDOMNode().value = "";
        } else {
            this.refs.combo.getDOMNode().value = result.label;
        }
    },
    handleChange: function(){
        var result = _.find(this.state.list, function(item){
            return ((item.label+"").toLowerCase().indexOf((this.refs.combo.getDOMNode().value+"").toLowerCase()) > -1);
        }.bind(this));
        if(this.refs.combo.getDOMNode().value == "" || typeof result == "undefined"){
            this.setState({ selectedValue: null }, function(){
                this.props.onFieldChange({ name: this.props.name, value: null });
            });
        } else {
            this.setState({ selectedValue: result.value }, function(){
                this.props.onFieldChange({ name: this.props.name, value: result.value });
            });
        }
        //this.props.onFieldChange({ name: this.props.name, value: this.refs.combo.getDOMNode().value });
    },
    handleClick: function(){
        $(this.getDOMNode()).select();
        $(this.getDOMNode()).autocomplete("search");
    },
    handleBlur: function(){
        console.log('blur');
        this.matchOnLabel();
        $(this.getDOMNode()).autocomplete("close");
        return false;
    },
    handleKeyDown: function(e){
        console.log('key down');
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){ // pressed enter  
            this.matchOnLabel();             
            return false;
        } else if (keyCode == '27') { // pressed escape 
        } else if (keyCode == '9'){ // pressed tab
        }
    },
    matchOnLabel: function(){
        if (this.refs.combo.getDOMNode().value == ""){
            this.setState({ selectedValue: null }, 
                function(){ 
                    this.syncLabel();
                    this.props.onFieldBlur();
                }.bind(this));
            return;
        }
        var result = _.find(this.state.list, function(item){
            return ((item.label+"").toLowerCase().indexOf((this.refs.combo.getDOMNode().value+"").toLowerCase()) > -1);
        }.bind(this));
        if (typeof result == "undefined"){
            this.setState({ selectedValue: null }, 
                function(){ 
                    this.syncLabel();
                    this.props.onFieldBlur();
                }.bind(this));
        } else {
            this.setState({ selectedValue: result.value }, 
                function(){ 
                    this.syncLabel();
                    this.props.onFieldBlur();
                }.bind(this));
        }
    },
    componentWillUnmount: function(){
        $(this.refs.combo.getDOMNode()).autocomplete("destroy");
    }
});

React.renderComponent(
    <ComponentTable url='../Home/CustomerTable' />,
    document.getElementById('react')
);

/*React.renderComponent(
    <ComboBox />,
    document.getElementById('test')
);*/

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