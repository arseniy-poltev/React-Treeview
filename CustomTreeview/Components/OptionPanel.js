import React, { Component } from 'react';
import { CCard, CCardBody, CRow, CCol, CLabel, CInput, CButton, CSwitch, CCollapse, CButtonGroup } from '@coreui/react';
import { freeSet } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import Draggable from 'react-draggable';

export default class OptionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionPanelState: false,
            toggleExpandOption: this.props.expandCollapseOption,
            fields: {
                searchString: this.props.searchString
            },
            optionBarStyle: {
                cursor: 'pointer',
                width: '100%',
            },
            dropdownMenuStyle: {
                width: '100%',
                padding: 0,
                zIndex: 1030,
                marginTop: 2
            },
            position: {
                mouseX: 0,
                mouseY: 0
            },
            saveStateToggle: true
        }

        this.toggleOption = this.toggleOption.bind(this)
        this.bindShowMatchesCheckbox = this.bindShowMatchesCheckbox.bind(this)
        this.bindSearch = this.bindSearch.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextprops) {
        this.setState({ searchString: nextprops.searchString })
    }

    toggleOption = () => {
        console.log("onclick")
    }

    handleExpandToggle = () => {
        this.setState({ toggleExpandOption: !this.state.toggleExpandOption })
        this.props.toggleNodeExpansion();
    }

    bindShowMatchesCheckbox = (e) => {
        if (e.target.checked) {
            this.setState({ searchString: "" });
        }
        this.props.bindOptionCheckbox(e);
    }

    bindSearch = (e) => {
        this.setState({ searchString: e.target.value });
        this.props.handleSearch(e);
    }

    handleDragEvent = (event, ui) => {
        if(ui.lastX === this.state.position.mouseX && ui.lastY === this.state.position.mouseY) {
            this.setState({ optionPanelState: !this.state.optionPanelState });
           
        } else {
            let position = {
                mouseX: ui.lastX,
                mouseY: ui.lastY
            };
            this.setState({position});
            this.setState(prevState => ({
                dropdownMenuStyle: {
                    ...prevState.dropdownMenuStyle,
                    position: "absolute"
                }
            }))
        }
    }

    getStateBtnTxt = () => {
        if(this.state.saveStateToggle) {
            return "Clear";
        } else {
            return "Save";
        }
    }

    SaveRemoveState = () => {
        if(this.state.saveStateToggle) {
            localStorage.removeItem("t_setting");
        } else {
            this.props.handleSaveState("save");
        }
        this.setState({saveStateToggle: !this.state.saveStateToggle})
    }

    render() {
        return (
            <Draggable
                handle=".handle"
                position={null}
                scale={1}
                onStop={this.handleDragEvent}
            >
                <div style={{ zIndex: 9999 }}>
                    <CButtonGroup className="justify-content-space-between handle" style={{width: "100%"}}>
                        <CButton color="primary" className="btn-brand btn-sm" ><CIcon name="cil-move" /></CButton>
                        <CButton
                            className="option-bar justify-content-space-between text-center"
                            color="primary"
                            style={this.state.optionBarStyle}
                        >Option
                        {"  "}
                        </CButton>
                    </CButtonGroup>
                    <CCollapse style={this.state.dropdownMenuStyle} custom show={this.state.optionPanelState}>
                        <CCard custom color="primary" className="text-white" style={{ marginBottom: 0 }}>
                            <CCardBody>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Search: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6">
                                        <CInput type="text" bsSize="sm" value={this.state.searchString || ""} onChange={this.bindSearch} />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Case Sensitive: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6" className="text-center">
                                        <CSwitch className={'mx-1'} variant={'3d'} color={'success'} name="caseSensitive" defaultChecked={this.props.caseSensitive} onChange={this.props.bindOptionCheckbox} size="sm" />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Show only matches: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6" className="text-center">
                                        <CSwitch className={'mx-1'} variant={'3d'} color={'success'} name="showOnlyMatches" defaultChecked={this.props.showOnlyMatches} onChange={this.bindShowMatchesCheckbox} size="sm" />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Show Disabled: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6" className="text-center">
                                        <CSwitch className={'mx-1'} variant={'3d'} color={'success'} name="showDisabled" onChange={this.props.bindOptionCheckbox} defaultChecked={this.props.showDisabled} size="sm" />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Toggle All: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6">
                                        <CButton color="secondary" size="sm" block variant="outline" onClick={this.handleExpandToggle}>
                                            {
                                                this.state.toggleExpandOption ? "Collapse All" : "Expand All"
                                            }</CButton>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel className="pull-left" size="sm">Remember State: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6">
                                        <CButton color="secondary" size="sm" block variant="outline" onClick={this.SaveRemoveState}>{this.getStateBtnTxt()}</CButton>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel className="pull-left" size="sm">Export Json: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6">
                                        <CButton color="secondary" size="sm" block variant="outline" onClick={this.props.handleExportJson}>Export</CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCollapse>
                </div>
            </Draggable>
        )
    }
}