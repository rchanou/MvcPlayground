/** @jsx React.DOM */

// UTILITY FUNCTIONS
 
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function convertTo12Hour(hour){
    hour = hour % 12;
    if (hour == 0){
        return 12;
    } else {
        return hour;
    }
}

function fromDotNetDate(dateString, returnMomentDate) {
    if(/\/Date\([0-9-]+\)\//.test(dateString)){
        if(returnMomentDate === true){
            return moment(new Date(parseInt(dateString.substr(6)))).format("M/D/YYYY h:mm A");
        } else if(returnMomentDate) {
            return moment(new Date(parseInt(dateString.substr(6)))).format(returnMomentDate);            
        } else {
            return new Date(parseInt(dateString.substr(6)));
        }
    } else {
        return dateString;
    }
}


// COMPONENTS 

var TextBox = React.createClass({
    propTypes: {
        //defaultValue: React.PropTypes.string,
        name: React.PropTypes.string
    },
    getDefaultProps: function(){
        return { onFieldChange: function(){}, onBlur: function(){}, onFieldBlur: function(){} };
    },
    render: function(){
        console.log('rendering textbox');
        return <input defaultValue={this.props.defaultValue} ref="input"
                      onChange={this.handleChange}
                      onBlur={this.handleBlur} />;
    },
    componentWillReceiveProps: function(nextProps){
        if (typeof nextProps.defaultValue != "undefined"){
            this.refs.input.getDOMNode().value = nextProps.defaultValue;  
        }
    },
    handleChange: function(e){
        this.props.onFieldChange({ name: this.props.name, value: e.target.value });
    },
    handleBlur: function(e){
        this.props.onFieldBlur({ name: this.props.name, value: e.target.value });
    }
});

var ComboBox = React.createClass({
    getDefaultProps: function(){
        return { sourceUrl: "../dispatch/employee-combobox", name: "EmpID", onFieldChange: function(){}, onFieldBlur: function(){}, onFieldComplete: function(){} };
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
        $.getJSON(this.props.sourceUrl, function(response){
            this.setState({ list: response }, function(){
                this.syncLabel();
            }.bind(this));

            $(this.getDOMNode()).autocomplete({ source: response, 
                                 delay: 0, 
                                 minLength: 0,
                                 select: function(event, ui){
                                        this.setState({ selectedValue: ui.item.value},
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

            //$(this.getDOMNode()).on("mousedown", "a", function(e){
            //}.bind(this));
        }.bind(this));
    },
    componentWillReceiveProps: function(nextProps){
        console.log('combo will receive props ' + JSON.stringify(nextProps));
        console.log('combo will receive props combo val ' + this.refs.combo.getDOMNode().value);
        /*if(true || this.refs.combo.getDOMNode().value == ""){
            this.setState({ selectedValue: nextProps.initialValue }, 
                function(){
                    if (!this.refs.combo.getDOMNode().value){
                        this.syncLabel();
                    }
                    console.log('receive props callback selectedvalue ' + this.state.selectedValue);
                }.bind(this));
        }*/
    },
    componentDidUpdate: function(){
        /*console.log('combo updated value ' + this.state.selectedValue);
        if (!this.state.selectedValue){
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
        }*/
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

var CreateFormMixin = {
    propTypes: {
        preparationUrl: React.PropTypes.string,
        validationUrl: React.PropTypes.string,
        submissionUrl: React.PropTypes.string,
        onCreate: React.PropTypes.func
    },
    getDefaultProps: function(){
        return { onCreate: function(){}, onFieldBlur: function(){}, onFieldComplete: function(){} };
    },
    getInitialState: function(){
        return { Submission: {},
                 Errors: {},
                 Warnings: {},
                 MissingRequiredFields: [],
                 IsValid: false
                 //options: {}
               };
    },
    formify: function(component){
        var errors = this.state.Errors;
        var warnings = this.state.Warnings;
        var fieldsWithValidation = React.Children.map(component.props.children, function(c, i){
            return c.props.name? <div>
                                    {c}
                                    <div>
                                        {errors[c.props.name]?
                                            errors[c.props.name].map(function(e){
                                                return <div className="error">{e}<br /></div>
                                            }): ""}
                                        {warnings[c.props.name]?
                                            warnings[c.props.name].map(function(e){
                                                return <span className="error">{e}<br /></span>
                                            }): ""}
                                    </div>
                                 </div>
                  :{c};
        });

        return <form className="block" onSubmit={this.handleSubmit}>
                {fieldsWithValidation}
                {<button ref="submit" disabled={this.state.IsValid? "": "disabled"}>Submit</button>}
               </form>;
    },
    componentDidMount: function(){
        if (this.props.preparationUrl){
            console.log('form mounted. loading form info');
            $.get(this.props.preparationUrl, function(response){
                console.log('received form info. setting form state ' + JSON.stringify(response.Result.Submission));
                _.each(response.Result.Submission, function(value, key){
                    response.Result.Submission[key] = fromDotNetDate(value, true);
                });
                this.setState(response.Result);
            }.bind(this));
        }
    },
    handleFieldChange: function(item){
        var submission = $.extend({}, this.state.Submission);
        submission[item.name] = item.value;
        console.log('received field change ' + JSON.stringify(item));
        this.setState({ Submission: submission, IsValid: false });
    },
    handleFieldBlur: function(item){
        console.log('validate ' + this.props.validationUrl + "?" + $.param(this.state.Submission));
        //this.setState({ IsValid: false }, function(){
            $.get(this.props.validationUrl + "?" + $.param(this.state.Submission), function(response){
                _.each(response.Result.Submission, function(value, key){
                    response.Result.Submission[key] = fromDotNetDate(value, true);
                });
                console.log('validation response ' + JSON.stringify(response.Result));
                this.setState(response.Result, function(){
                    this.props.onFieldBlur({ name: this.props.name, value: this.state.selectedValue });
                }.bind(this));
            }.bind(this));
        //}.bind(this));
    },
    handleSubmit: function(){
        var warnings = this.state.Warnings;
        var confirmedWarnings = true;
        if (!$.isEmptyObject(warnings)){
            var message = "Warnings:";
            _.each(warnings, function(field){
                field.forEach(function(warning){
                    message += "\n" + warning;
                });
            });
            message += "\nCreate record anyway?";
            confirmedWarnings = window.confirm(message);
        }
        if (confirmedWarnings){
            var request;
            if (!$.isEmptyObject(this.state.options)){
                request = { Submission: this.state.Submission, Options: this.state.options };
            } else {
                request = this.state.Submission;
            }

            //request = {Submission: {DispatchDtlID: 11111}, Options: {SendSmsOnSuccess: true }};

            console.log('request');
            console.log(request);

            $.ajax({
                url: '../dispatch/submit-dispatch-detail',
                type: 'POST',
                data: JSON.stringify(request),
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    console.log('response');
                    console.log(response);
                    this.props.onCreate(response);
                }.bind(this),
                error: function(response){
                    alert("An error occurred while creating the record.");
                }
            });

            /*$.post(this.props.submissionUrl, request, function(response){
                console.log('response');
                console.log(response);
                this.props.onCreate(response);
            }.bind(this))
            .fail(function(response){
                alert("An error occurred while creating the record.");
            });*/
        }

        return false;
    }
};