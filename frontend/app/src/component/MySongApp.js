import React from 'react';
import axios from 'axios';

import {config} from './Config.js';
import HeaderBar from './HeaderBar.js';
import PlaylistTable from './PlaylistTable.js';
import SongTable from './SongTable.js';
import Notification from './Notification.js';

export default class MySongApp extends React.Component{
	constructor(){
		super();

		this.publicAcces=true;		
		this.state={
			"notificationConfi":{},
			"publicSongList":{}
		};
	}

	componentDidMount(){
		if(this.publicAcces)this._fechPublicSongList();
	}

	_fechPublicSongList(){
		var songArray={};
		var notificationConfi={};
		axios.get(config.baseUrl+'/songs/public')
		.then(response=> {
			var data=response.data;
			if(data.success){
				songArray=data.songs;
				notificationConfi={"type":"success","message":"Lista de canciones cargada"};
			}else{
				notificationConfi={"type":"danger","message":data.error};
			}
			this.setState({
				"notificationConfi": notificationConfi,
				"publicSongList":songArray
			});
		})
		.catch(error=>{
			notificationConfi={"type":"danger","message":"Error al solicitar lista de canciones"};
			this.setState({"notificationConfi": notificationConfi});
		});
	}

	handleNotificationConfi(notificationConfi){
		this.setState({"notificationConfi": notificationConfi});
	}

	handleLogin(loginObject){
		this.publicAcces=!loginObject.isLoggedIn;
		this.setState({"isLoggedIn": loginObject.isLoggedIn, token:loginObject.token});
	}

	render(){
		return(
			<div className="container">
				<HeaderBar manageNotification={this.handleNotificationConfi.bind(this)} handleLogin={this.handleLogin.bind(this)}/>
				{(this.state.notificationConfi)&&<Notification notificationConfi={this.state.notificationConfi} />}
				{!this.publicAcces&&<PlaylistTable />}
				{this.publicAcces&&this.state.publicSongList.length>0&&<SongTable songsList={this.state.publicSongList}/>}
			</div>
		);
	}
}