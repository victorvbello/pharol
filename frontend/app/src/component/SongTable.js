import React from 'react';
import SongRow from './SongRow.js';

export default class SongTable extends React.Component{
	constructor(){
		super();

		this.state={
			songArray:[]
		}
	}
	
	componentDidMount(){
		var songArray=[];
		var songElement=[];
		var count=0;
		if(this.props.songsList.length>0){
			this.props.songsList.forEach(function(song){
				if(count==4){
					songArray.push(
						<div className="row">
							{songElement}
						</div>
					);
					count=0;
					songElement=[];
				}
				songElement.push(
					<div className="col-xs-3">
						<SongRow key={song.objectID} song={song}/>
					</div>
				);
				count++;
			})
		}
		this.setState({
			songArray:songArray
		})
	}

	render(){
		return(
			<div className="row">
			  <div className="col-xs-12">			  	
			  	{this.state.songArray}
			  </div>
			</div>
		);
	}
}