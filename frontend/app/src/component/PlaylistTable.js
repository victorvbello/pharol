import React from 'react';
import PlaylistRow from './PlaylistRow.js';

export default class PlaylistTable extends React.Component{
	constructor(){
		super();
	}

	render(){
		return(
			<div style={{border:"1px solid green"}}>
				PlaylistTable
				<PlaylistRow/>
				<PlaylistRow/>
				<PlaylistRow/>
				<PlaylistRow/>
			</div>
		);
	}
}