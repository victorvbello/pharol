import React from 'react';

export default class Notification extends React.Component{
	constructor(){
		super();
	}
	
	render(){
		var confi=this.props.notificationConfi;
		return(
			<div className={'alert alert-'+confi.type} role="alert">
				{confi.message}
			</div>
		);
	}
}