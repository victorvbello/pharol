import React from 'react';
import axios from 'axios';

import {config} from './Config.js';

export default class LoginForm extends React.Component{
	constructor(){
		super();
		this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
	}

	handleLoginClick(){
		var notificationConfi={};
		axios.post(config.baseUrl+'/auth/login',{
			"user":this.textInputUsuario.value,
			"password":this.textInputPassword.value
		})
		.then(response=> {
			var data=response.data;
			if(data.success){
				notificationConfi={"type":"success","message":"Login iniciado corractamente"};
				var loginObject={isLoggedIn:data.success,token:data.token};
				this.setState({isLoggedIn:data.success});
				this.props.handleLogin(loginObject);
				this.props.manageNotification(notificationConfi);
			}else{
				notificationConfi={"type":"danger","message":"Error al iniciar session"};
				this.props.manageNotification(notificationConfi);
			}

		})/*
		.catch(error=>{
			notificationConfi={"type":"danger","message":"Error al iniciar session"};
			this.props.manageNotification(notificationConfi);
		});*/;
	}
	handleLogoutClick() {
		var loginObject={isLoggedIn:false,token:null};
		this.props.handleLogin(loginObject);
	}
	render(){

		var textButton='Logout';
		const isLoggedIn = this.state.isLoggedIn;

		if(!isLoggedIn){
			textButton="Login";
			return(
				<form className="navbar-form navbar-left">
	        <div className="form-group">
	          <input type="text" ref={(inputUsuario) => { this.textInputUsuario = inputUsuario; }} className="form-control" placeholder="Usuario" defaultValue="admin"/>
	        </div>
	        <div className="form-group">
	          <input type="text"  ref={(inputPassword) => { this.textInputPassword = inputPassword; }}  className="form-control" placeholder="Password"defaultValue="7890"/>
	        </div>
	        <button type="button" className="btn btn-default" onClick={this.handleLoginClick}>{textButton}</button>
	      </form>
			);
		}else{
			return(
				<form className="navbar-form navbar-left">
	        <button className="btn btn-default" onClick={this.handleLogoutClick}>{textButton}</button>
	      </form>
			);
		}
	}
}