import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, Card, CardBody, Row, Col, Label, Input, Button } from 'reactstrap';

export default class OptionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionPanelState: false,
            toggleExpandOption: this.props.expandCollapseOption,
        }

        this.toggleOption = this.toggleOption.bind(this)
        this.bindShowMatchesCheckbox = this.bindShowMatchesCheckbox.bind(this)
    }

    componentWillReceiveProps(nextprops) {
        this.setState({searchString: nextprops.searchString})
    }

    toggleOption = () => {
        return this.setState({ optionPanelState: !this.state.optionPanelState })
    }

    handleExpandToggle = () => {
        this.setState({toggleExpandOption: !this.state.toggleExpandOption})
        this.props.toggleNodeExpansion();
    }

    bindShowMatchesCheckbox = (e) => {
        if(e.target.checked) {
            this.setState({searchString: ""});
        }
        this.props.bindOptionCheckbox(e);
    }

    render() {
        return (
            <>
                <div className="option-panel">
                    <Dropdown isOpen={this.state.optionPanelState} toggle={() => { this.toggleOption() }}>
                        <DropdownToggle
                            tag="span"
                            onClick={() => { this.toggleOption() }}
                            data-toggle="dropdown"
                            aria-expanded={this.state.optionPanelState}
                        >
                            <div className="option-bar">
                                <i className={`fa fa-angle-${this.state.optionPanelState ? 'up' : 'down'}`}></i>
                                {" "}Option
                        </div>
                        </DropdownToggle>
                        <DropdownMenu>
                            <Card className="text-white bg-primary text-center option-content">
                                <CardBody>
                                    <Row>
                                        <Col xs="6" sm="6" md="6">
                                            <Label size="sm" className="pull-left">Search: </Label>
                                        </Col>
                                        <Col xs="6" sm="6" md="6">
                                            <Input type="text" bsSize="sm"  key={this.state.searchString !== "" ? 'notLoadedYet' : 'loaded'}  onChange={this.props.handleSearch} defaultValue={this.state.searchString}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6" sm="6" md="6">
                                            <Label size="sm" className="pull-left">Case Sensitive: </Label>
                                        </Col>
                                        <Col xs="6" sm="6" md="6">
                                            <Input className="form-check-input" type="checkbox" name="caseSensitive" defaultChecked={this.props.caseSensitive} onChange={this.props.bindOptionCheckbox} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6" sm="6" md="6">
                                            <Label size="sm" className="pull-left">Show only matches: </Label>
                                        </Col>
                                        <Col xs="6" sm="6" md="6">
                                            <Input className="form-check-input" type="checkbox" name="showOnlyMatches" defaultChecked={this.props.showOnlyMatches} onChange={this.bindShowMatchesCheckbox} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6" sm="6" md="6">
                                            <Label size="sm" className="pull-left">Show Disabled: </Label>
                                        </Col>
                                        <Col xs="6" sm="6" md="6">
                                            <Input className="form-check-input" name="showDisabled" type="checkbox" defaultChecked={this.props.showDisabled} onChange={this.props.bindOptionCheckbox}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6" sm="6" md="6">
                                            <Label size="sm" className="pull-left">Toggle All: </Label>
                                        </Col>
                                        <Col xs="6" sm="6" md="6">
                                            <Button color="secondary" size="sm" block outline onClick={this.handleExpandToggle}>
                                            {
                                                this.state.toggleExpandOption ? "Collapse All" : "Expand All"
                                            }</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6" sm="6" md="6">
                                            <Label className="pull-left" size="sm">Save State: </Label>
                                        </Col>
                                        <Col xs="6" sm="6" md="6">
                                            <Button color="secondary" size="sm" block outline onClick={this.props.handleExportJson}>Export</Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </>
        )
    }
}