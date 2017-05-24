import React from 'react';

export default class SongRow extends React.Component{
	constructor(){
		super();
	}

	render(){
		var fecha="";
		var fechaFull="";
		if(this.props.song.date){
			fechaFull= new Date(this.props.song.date);			
			fecha=fechaFull.getDate()+"/"+(fechaFull.getMonth()+1)+"/"+fechaFull.getFullYear();
		}
		return(
			<div className="panel panel-success">
				<div className="panel-heading">{this.props.song.name}</div>
			  <div className="panel-body">
			    <ul className="list-group">
						<li className="list-group-item"><b>Artista:</b>{this.props.song.artist}</li>
						<li className="list-group-item"><b>Genero:</b>{this.props.song.gender}</li>
						<li className="list-group-item"><b>Fecha:</b>{fecha}</li>
					</ul>
			  </div>
			</div>
		);
	}
}