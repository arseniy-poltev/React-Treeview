import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default class ContextMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseX: null,
            mouseY: null,
            nodeItem: null,
        }

        this.handleClose = this.handleClose.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps, state) {
        this.setState({
            mouseX: nextProps.nodeContextState.mouseX,
            mouseY: nextProps.nodeContextState.mouseY,
            nodeItem: nextProps.nodeContextState.contextItem
        })
    }

    handleClose = () => {
        this.setState({
            mouseX: null,
            mouseY: null
        })

        this.props.clearContextState();
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
                <MenuItem onClick={this.props.addNode}>New</MenuItem>
                <MenuItem onClick={this.props.editNode} disabled={this.props.nodeItem !== null && this.props.nodeItem.node.editable === false}>Edit</MenuItem>
                <MenuItem onClick={this.props.removeNode}>Delete</MenuItem>
            </Menu>
        );
    }
}