import React, { Component } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from '../algos/dijkstra';

import Node from './node/node';

import './visualizer.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 15;
const END_NODE_COL = 15;

class Visualizer extends Component{
    constructor(props){
        super(props);

        this.state={
            nodes: [],
            mouseIsPressed: false,
            choosingStartEndNodes: false,
            startingNodeRow: 10,
            startingNodeCol: 15,
            endNodeRow: 15,
            endNodeCol: 15,
        }
    }

    

    componentDidMount(){
        const nodes = buildGrid();
        this.setState({nodes});
        
    }

    handleMouseDown(row, col){
        if (this.state.choosingStartEndNodes === false){
            const newNodes = updateWallOnGrid(this.state.nodes, row, col);
            this.setState({nodes: newNodes, mouseIsPressed: true});
            
        }
        else{
            this.setState({startingNodeRow: row, startingNodeCol: col})
            console.log(this.state.startingNodeRow, this.state.startingNodeCol);
        }
    }

    handleMouseEnter(row, col){
        //if (this.state.choosingStartEndNodes === false){
        //    if (!this.state.mouseIsPressed) return;

        //    const newNodes = updateWallOnGrid(this.state.nodes, row, col);
        //    this.setState({nodes: newNodes});
        //}
    }

    handleMouseUp(){
        if (this.state.choosingStartEndNodes === false){
            this.setState({mouseIsPressed: false});
        }
    }

    animate(visitedNodes, pathNodes){
        for (let i = 0; i <= visitedNodes.length; i++){
            if (i === visitedNodes.length){
                setTimeout(() => {
                    this.animatePath(pathNodes);
                }, 25 * i)
            return;
            }

            setTimeout(() => {
                const newNodes = this.state.nodes.slice();

                const node = visitedNodes[i];
                const newNode = {
                    ...node,
                    visited: true,
                }
                newNodes[node.row][node.col] = newNode;
                this.setState({nodes: newNodes});
            }, 25 * i);
        }
    }

    animatePath(pathNodes){
        for (let i = 0; i < pathNodes.length; i++){

            setTimeout(() => {
                const newNodes = this.state.nodes.slice();

                const node = pathNodes[i];
                const newNode = {
                    ...node,
                    pathNode: true,
                }
            
                newNodes[node.row][node.col] = newNode;
                this.setState({nodes: newNodes});
            }, 25 * i);
        }
    }

    visualize(){
        const {nodes} = this.state;

        const startingNode = nodes[this.state.startingNodeRow][this.state.startingNodeCol];
        const endNode = nodes[this.state.endNodeRow][this.state.endNodeCol];

        const visitedNodes = dijkstra(nodes, startingNode, endNode);
        const pathNodes = getNodesInShortestPathOrder(endNode);
        
        this.animate(visitedNodes, pathNodes);

    }

    resetNodes(){
        const nodes = buildGrid();
        this.setState({nodes});
    }

    chooseStartEndNodes(){
        this.setState({choosingStartEndNodes: true});
    }

    render(){
        const {nodes} = this.state;

        return(
            <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home"> PathFinder </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="#home"> About </Nav.Link>
                    <Nav.Link href="#link"> Help  </Nav.Link>
                    <NavDropdown title="Actions" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => this.visualize()}> Find Path </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => this.chooseStartEndNodes()}> Choose Start/End Node </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => this.resetNodes()}> Reset </NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="grid">
                {nodes.map((row, rowId) => {
                    return(
                        <div key={rowId}>
                            {row.map((node, nodeId) => {
                                const {row, col, startingNode, endNode, visited, pathNode, isWall, mouseIsPressed} = node;
                                return(
                                    <Node
                                        row={row}
                                        col={col}
                                        key={nodeId}
                                        startingNode={startingNode}
                                        endNode={endNode}
                                        visited={visited}
                                        pathNode={pathNode}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown = {(row, col) => this.handleMouseDown(row,col)}
                                        onMouseEnter = {(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp = {() => this.handleMouseUp()}
                                    />
                                );
                            })}
                        </div>
                    ); 
                })}
            </div>
            </>
        );
    }
}

const buildGrid = () =>{
    const nodes = [];
        
    for (let row = 0; row < 25; row++){
        const buildingRow = [];
        for (let col = 0; col < 50; col++){
            buildingRow.push(createNode(row,col));
        }
        nodes.push(buildingRow);
    }
    return nodes
};

const createNode = (row,col) => {
    //Creates a new node

    return{
        col,
        row,
        startingNode: row === START_NODE_ROW && col === START_NODE_COL,
        endNode: row === END_NODE_ROW && col === END_NODE_COL,
        distance: Infinity,
        visited: false,
        wallNode: false,
        previousNode: null
    }
};

const updateWallOnGrid = (grid, row, col) => {
    //!Make so this works for updating both wall and start/end nodes
    //Updates the grid with a newly added wallNode

    const newGrid = grid.slice(); //Returns copy of the grid array
    
    const wallNode = newGrid[row][col];

    const newNode = {
        ...wallNode,
        isWall: !wallNode.isWall
    };
    newGrid[row][col] = newNode;

    return newGrid;
};

export default Visualizer;