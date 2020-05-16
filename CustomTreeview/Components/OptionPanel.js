import React, { Component } from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CCard, CCardBody, CRow, CCol, CLabel, CInput, CButton, CSwitch } from '@coreui/react';
import { freeSet } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

export default class OptionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionPanelState: false,
            toggleExpandOption: this.props.expandCollapseOption,
            fields: {
                searchString: this.props.searchString
            }
        }

        this.toggleOption = this.toggleOption.bind(this)
        this.bindShowMatchesCheckbox = this.bindShowMatchesCheckbox.bind(this)
        this.bindSearch = this.bindSearch.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextprops) {
        this.setState({ searchString: nextprops.searchString })
    }

    toggleOption = () => {
        return this.setState({ optionPanelState: !this.state.optionPanelState })
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
        this.setState({searchString: e.target.value});
        this.props.handleSearch(e);
    }

    render() {
        return (
            <>
                <CDropdown  custom  show={this.state.optionPanelState} toggle={() => { this.toggleOption() }} style={{width: '100%'}} className="justify-content-space-between">
                <CButton color="primary" className="btn-brand btn-sm" style={{cursor: "move"}}><CIcon name="cil-move"/></CButton> 
                    <CDropdownToggle
                        onClick={() => { this.toggleOption() }}
                        aria-expanded={this.state.optionPanelState}
                        className="option-bar justify-content-space-between text-center"
                        color="primary"
                    >Option 
                        {"  "}
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CCard  custom color="primary" className="text-white" style={{marginBottom: 0}}>
                            <CCardBody>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Search: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6">
                                        <CInput type="text" bsSize="sm" value={this.state.searchString ||""} onChange={this.bindSearch} />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Case Sensitive: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6" className="text-center">
                                        {/* <CInput className="form-check-input" type="checkbox" name="caseSensitive" defaultChecked={this.props.caseSensitive} onChange={this.props.bindOptionCheckbox} /> */}
                                        <CSwitch className={'mx-1'} variant={'3d'} color={'success'} name="caseSensitive" defaultChecked={this.props.caseSensitive} onChange={this.props.bindOptionCheckbox} size="sm"/>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Show only matches: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6" className="text-center">
                                        {/* <CInput className="form-check-input" type="checkbox" name="showOnlyMatches" defaultChecked={this.props.showOnlyMatches} onChange={this.bindShowMatchesCheckbox} /> */}
                                        <CSwitch className={'mx-1'} variant={'3d'} color={'success'} name="showOnlyMatches" defaultChecked={this.props.showOnlyMatches}  onChange={this.bindShowMatchesCheckbox}  size="sm"/>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol xs="6" sm="6" md="6">
                                        <CLabel size="sm" className="pull-left">Show Disabled: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6" className="text-center">
                                        {/* <CInput className="form-check-input" name="showDisabled" type="checkbox" defaultChecked={this.props.showDisabled} onChange={this.props.bindOptionCheckbox} /> */}
                                        <CSwitch className={'mx-1'} variant={'3d'} color={'success'}  name="showDisabled"  onChange={this.props.bindOptionCheckbox} defaultChecked={this.props.showDisabled}  size="sm"/>
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
                                        <CLabel className="pull-left" size="sm">Save State: </CLabel>
                                    </CCol>
                                    <CCol xs="6" sm="6" md="6">
                                        <CButton color="secondary" size="sm" block variant="outline" onClick={this.props.handleExportJson}>Export</CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CDropdownMenu>
                </CDropdown>
            </>
        )
    }
}