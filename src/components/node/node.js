import React, {Component} from 'react';

import './node.css';

class Node extends Component{
    constructor(props){
        super(props);

        this.state={

        }
    }

    render(){
        const {row, col, startingNode, endNode, visited, pathNode ,isWall, onMouseDown, onMouseEnter, onMouseUp} = this.props;

        const setStartEndNodes = endNode ? 'end-node' : startingNode ? 'starting-node' : visited ? 'visited' : isWall ? 'wall' : pathNode ? 'pathNode' : '';

        return(
            <div 
            className={`node ${(setStartEndNodes)}`}
            onMouseDown = {() => onMouseDown(row,col)}    
            onMouseEnter = {() => onMouseEnter(row,col)}
            onMouseUp = {() => onMouseUp()}
            />
        );
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col: 0
};

export default Node;