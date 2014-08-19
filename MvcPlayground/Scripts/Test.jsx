/** @jsx React.DOM */

var Test = React.createClass({
	render: function(){
		return (
			<div>
				{this.props.testProp}
			</div>
		);
	}
});