import React from 'react';
import LoginForm from './LoginForm.js';

export default class HeaderBar extends React.Component{
	constructor(){
		super();
	}

	render(){
		return(
			<div>
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="navbar-header">
				      <a className="navbar-brand" href="#">My Song App</a>
				    </div>
				   <ul className="nav navbar-nav navbar-right">
				    <LoginForm manageNotification={this.props.manageNotification} handleLogin={this.props.handleLogin}/>
				   </ul>
				  </div>
				</nav>
			</div>
		);
	}
}