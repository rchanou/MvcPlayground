/** @jsx React.DOM */

var Bindable = React.createClass({
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
	render: function(){
		return (
			<div>
				{this.props.Value}
				<button onClick={this.submit}>
					Go!
				</button>
			</div>
		);
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
});

var BindableMixin = {
	getDefaultProps: function(){
		return {
			boundField: {
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

/*React.renderComponent(
	<Bindable Value='success' />,
	document.getElementById('react')
);*/
