import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default class ContextMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseX: props.positionX,
            mouseY: props.positionY,
        }

        this.handleClose = this.handleClose.bind(this)
    }

    componentWillReceiveProps(nextProps, state) {
        this.setState({
            mouseX: nextProps.positionX,
            mouseY: nextProps.positionY
        })
    }
    

    handleClose = () => {
        this.setState({
            mouseX: null,
            mouseY: null
        })
    };

    render() {
        return (
            <Menu
                keepMounted
                open={this.state.mouseY !== null}
                onClose={this.handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    this.state.mouseY !== null && this.state.mouseX !== null
                        ? { top: this.state.mouseY, left: this.state.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={this.handleClose}>New</MenuItem>
                <MenuItem onClick={this.handleClose}>Edit</MenuItem>
                <MenuItem onClick={this.handleClose}>Highlight</MenuItem>
            </Menu>
        );
    }
}