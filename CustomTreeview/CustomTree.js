import React, { Component } from "react";
import { CInput, CFormGroup, CButton, CLabel, CModal, CModalHeader, CModalBody, CModalFooter, CCard, CCardBody } from '@coreui/react';
import { DndProvider } from 'react-dnd';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import axios from 'axios';
import { SortableTreeWithoutDndContext as SortableTree } from "./src/react-sortable-tree";
import { removeNodeAtPath, getNodeAtPath, addNodeUnderParent, changeNodeAtPath, toggleExpandedForAll } from './utils/tree-data-utils';
import "react-sortable-tree/style.css";
import ContextMenu from './Components/ContextMenu'
import OptionPanel from './Components/OptionPanel'
import 'font-awesome/css/font-awesome.min.css';

const styles = {
  treeContent: {
    height: '400px',
    paddingTop: '10px'
  }
}

const isTouchDevice = !!('ontouchstart' in window || navigator.maxTouchPoints);
const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
export default class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      searchToggleState: false,
      searchFocusIndex: 0,
      searchFoundCount: 0,
      initialTreeData: null,
      treeData: null,
      matchedTreedata: null,
      maxDepth: this.props.treeConfig.settings.maxDepth,
      showDisabled: this.props.treeConfig.settings.showDisabled,
      caseSensitive: this.props.treeConfig.settings.caseSensitive,
      showOnlyMatches: this.props.treeConfig.settings.showOnlyMatches,
      titleColor: this.props.treeConfig.titleColor,
      iconColor: this.props.treeConfig.iconColor,
      disabledColor: this.props.treeConfig.disabledColor,
      infoColor: this.props.treeConfig.infoColor,
      nodeContextState: {
        contextItem: null,
        mouseX: null,
        mouseY: null,
        nodeModalToggle: false
      },
      nodeItem: null,
      optionPanelState: false,
      expandCollapseOption: false,
    };
  }
  UNSAFE_componentWillMount() {
    const headers = {
      'Content-Type': 'application/json',
    }
    const data = {};

    axios.post(this.props.treeConfig.appUrl, data, { headers: headers })
      .then(response => {
        this.setState({ initialTreeData: response.data.payload.data, treeData: response.data.payload.data }, () => {
          this.refreshTreeData();
        });
      });
  }

  handleExportJson = async () => {
    const { treeData } = this.state;
    let treeSettings = {}, exportData = {};
    treeSettings['titleColor'] = this.state.titleColor;
    treeSettings['iconColor'] = this.state.iconColor;
    treeSettings['infoColor'] = this.state.infoColor;
    treeSettings['maxDepth'] = this.state.maxDepth;
    treeSettings['showDisabled'] = this.state.showDisabled;
    treeSettings['caseSensitive'] = this.state.caseSensitive;
    treeSettings['showOnlyMatches'] = this.state.showOnlyMatches;

    exportData['settings'] = treeSettings;
    exportData['data'] = treeData;

    const fileName = "treeData";
    const json = JSON.stringify(exportData);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  refreshTreeData = () => {
    let res = this.sortFilterNodesAndChildren(this.state.treeData);
    this.setState({ treeData: res })
  }

  bindOptionCheckbox = (e) => {
    if (e.target.name === 'showOnlyMatches' && e.target.checked === true && this.state.searchString !== "") {
      this.setState({
        initialTreeData: this.state.treeData,
        treeData: this.state.matchedTreedata
      });
    } else if (e.target.name === "showDisabled" && this.state.showOnlyMatches === false) {
      this.setState({ treeData: this.state.initialTreeData });

    } else if (e.target.name === "showDisabled" && this.state.showOnlyMatches === true) {

    } else {
      this.setState({ treeData: this.state.initialTreeData })
    }

    if (e.target.name === 'caseSensitive') {
      this.setState({ searchString: '' })
    }
    // this.setState({ treeData: this.state.initialTreeData })

    let checkState = {};
    checkState[e.target.name] = e.target.checked;

    this.setState(checkState, () => {
      this.refreshTreeData();
    });
  }

  sortFilterNodesAndChildren = (nodes) => {
    if (nodes != null) {
      nodes.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
      nodes = nodes.filter(item => {
        if (!this.state.showDisabled && item.disabled === true) {
          return false;
        } else {
          return true;
        }
      })

      nodes.map(item => {
        if (item.children !== undefined && item.children !== null) {
          item.children = this.sortFilterNodesAndChildren(item.children);
        }
        return item;
      });
    }

    return nodes;
  }

  unflatten = (arr) => {
    var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

    for (var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id]['children'] = [];
    }

    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        if (mappedElem.parentId) {
          mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
        }
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  getSearchPath = (matches) => {
    let matchFamilies = [];
    matches.map(item => {
      let tmpArr = [];
      tmpArr.push(item.path[0]);
      let tmpNodeAtPath = getNodeAtPath({
        treeData: this.state.treeData,
        path: tmpArr,
        getNodeKey: ({ treeIndex }) => treeIndex,
      });
      if (tmpNodeAtPath !== null) {
        matchFamilies.push(tmpNodeAtPath.node);
      }
      return item;
    })
    matchFamilies = Array.from(new Set(matchFamilies.map(JSON.stringify))).map(JSON.parse);
    this.setState({ matchedTreedata: matchFamilies });

    if (this.state.showOnlyMatches) {
      this.handleTreeOnChange(matchFamilies)
    }
  }

  removeNodesWithoutMatching = (node, path) => {
    let parent = node;

    let parentPath = path.slice(0, -1);
    if (parentPath.length > 0) {

      let tmpNode = getNodeAtPath({
        treeData: this.state.treeData,
        path: parentPath,
        getNodeKey: ({ treeIndex }) => treeIndex,
      });

      console.log("tmpnode", tmpNode)
      let nodeObject = {};
      if (tmpNode !== null && tmpNode.node !== undefined) {
        nodeObject = tmpNode.node;
        nodeObject.children = [];
        nodeObject.children.push(node);
      }

      parent = this.removeNodesWithoutMatching(nodeObject, parentPath)

      console.log("nodeoojbect", parent)

    };

    return parent;
  }

  handleTreeOnChange = treeData => {
    this.sortFilterNodesAndChildren(treeData);
    this.setState({ treeData });
  };

  handleModalFormChange(event) {
    let nodeItem = this.state.nodeItem;
    nodeItem[event.target.name] = event.target.value;
  }

  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  removeNode = () => {
    if (!this.state.nodeContextState.contextItem)
      return;
    let { path } = this.state.nodeContextState.contextItem;

    // Call api to remove TreeData
    // Request: this.state.nodeContextState.contextItem, Response: flatTreeData

    this.setState({
      treeData: removeNodeAtPath({
        treeData: this.state.treeData,
        path: path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: true,
      }),
      nodeContextState: {
        contextItem: null,
        mouseX: null,
        mouseY: null,
      }
    })
  }

  editNode = () => {
    if (!this.state.nodeContextState.contextItem)
      return;
    this.setState(prevState => ({
      nodeContextState: {
        ...prevState.nodeContextState,
        mouseX: null,
        mouseY: null,
        modalState: 'edit',
        nodeModalToggle: true,
      },
      nodeItem: this.state.nodeContextState.contextItem.node
    }));
  }

  saveNode = () => {

    if (this.state.nodeContextState.modalState === 'edit') {
      let originalRowInfo = this.state.nodeContextState.contextItem;
      let newRowInfo = this.state.nodeItem;

      // Call api to update node
      // Request: newRowInfo, Response: flatTreeData
      let newTree = changeNodeAtPath({
        treeData: this.state.treeData,
        path: originalRowInfo.path,
        newNode: newRowInfo,
        getNodeKey: ({ treeIndex }) => treeIndex,
      });
      this.setState({ treeData: newTree }, () => ({
      }));
    } else if (this.state.nodeContextState.modalState === 'add') {
      let { path } = this.state.nodeContextState.contextItem;
      path.pop();
      let parentNode = getNodeAtPath({
        treeData: this.state.treeData,
        path: path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: true
      });
      let getNodeKey = ({ node: object, treeIndex: number }) => {
        return number;
      };
      let parentKey = getNodeKey(parentNode);
      if (parentKey === -1) {
        parentKey = null;
      }


      let newTree = addNodeUnderParent({
        treeData: this.state.treeData,
        newNode: this.state.nodeItem,
        expandParent: true,
        parentKey: parentKey,
        getNodeKey: ({ treeIndex }) => treeIndex
      });

      // Call api to add new node
      // Request: newTree.treeData, Response: flatTreeData to update initialTreeData
      this.setState({ treeData: newTree.treeData })
    }

    this.setState({
      nodeContextState: {
        contextItem: null,
        mouseX: null,
        mouseY: null,
        nodeModalToggle: false,
        modalState: ''
      }
    })
  }

  addNode = () => {
    if (!this.state.nodeContextState.contextItem)
      return;
    let nodeItem = { title: 'New Item', id: this.uuidv4(), icon: "fa-gear" };
    if (this.state.nodeContextState.contextItem === null) {
      return;
    }
    this.setState(prevState => ({
      nodeContextState: {
        ...prevState.nodeContextState,
        mouseX: null,
        mouseY: null,
        nodeModalToggle: true,
        modalState: 'add'
      },
      nodeItem: nodeItem
    }));
  }

  handleSearchOnChange = e => {
    this.setState({
      searchString: e.target.value,
    });

    if (e.target.value === "") {
      this.setState({ treeData: this.state.initialTreeData })
    }
  };

  selectPrevMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1
    });
  };

  selectNextMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;
    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0
    });
  };

  toggleNodeExpansion = () => {
    this.setState(prevState => ({
      treeData: toggleExpandedForAll({ treeData: prevState.treeData, expanded: !this.state.expandCollapseOption })
    }));
    this.setState({ expandCollapseOption: !this.state.expandCollapseOption });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      nodeContextState: {
        ...prevState.nodeContextState,
        nodeModalToggle: !this.state.nodeContextState.nodeModalToggle
      }
    }))
  }

  handleKeyEvent = e => {
    if (e.keyCode === 38) {
      e.preventDefault()
      this.selectPrevMatch()
    } else if (e.keyCode === 40) {
      e.preventDefault()
      this.selectNextMatch()
    }
  }

  clearContextState = () => {
    this.setState({
      nodeContextState: {
        contextItem: null,
        mouseX: null,
        mouseY: null,
        nodeModalToggle: false
      },
      nodeItem: null,
    })
  }

  customSearchMethod = ({ node, searchQuery }) => {
    if (this.state.caseSensitive) {
      return searchQuery && node.title.indexOf(searchQuery) > -1;
    } else {
      return searchQuery && node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    }
  }

  checkCanDrag = ({ node }) => {
    if (node.disabled) {
      return false;
    } else {
      if (!this.state.showOnlyMatches || this.state.searchString === "") {
        return true;
      } else {
        return false;
      }
    }
  }

  // update server with new node data when on drag event trigger
  handleOnMobeNode = ({ node, nextPath, nextParentNode, treeData }) => {
    node.parentId = nextParentNode === null ? null : nextParentNode.id;

    // Call api to update db
    // Update db data with this node
    // Request param: node, response: update state
  }

  handleSearchFinishCallback = (matches) => {
    if (this.state.searchString === '' || this.state.searchString === null) {
    } else {
      this.getSearchPath(matches);

      // if (this.state.showOnlyMatches) {
      // }
    }
    this.setState({
      searchFoundCount: matches.length,
      searchFocusIndex:
        matches.length > 0 ? this.state.searchFocusIndex % matches.length : 0
    })
  }

  generateCustomNodeProps = (rowInfo) => ({
    onContextMenu: (event) => {
      event.preventDefault();
      this.setState({
        nodeContextState: {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
          contextItem: rowInfo
        }
      });
    },
    listIndex: 0,
    lowerSiblingCounts: [],
    title: (
      <div className='justify-content-between' style={{ width: '100%' }} >
        <i className={`fa ${rowInfo.node.icon} fa-md mr-2`} style={{ color: rowInfo.node.disabled ? this.state.disabledColor : this.state.iconColor }}></i>
        <span style={{ color: rowInfo.node.disabled ? this.state.disabledColor : this.state.titleColor }}>
          {rowInfo.node.title}
        </span>
      </div>
    ),
    buttons: [
      <>
        <span style={{ marginRight: '10px', color: rowInfo.node.disabled ? this.state.disabledColor : this.state.infoColor }}>
          {rowInfo.node.info}
        </span>
      </>
    ]
  })


  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      showDisabled,
      caseSensitive,
      showOnlyMatches
    } = this.state;

    return (
      <CCard
        custom accentColor="primary"
        headerSlot="Card outline primary"
        className="text-white"
        borderColor="primary"
      >
        <CCardBody onKeyUp={this.handleKeyEvent} tabIndex="0">
          <OptionPanel
            handleSearch={this.handleSearchOnChange}
            searchString={searchString}
            toggleNodeExpansion={this.toggleNodeExpansion}
            expandCollapseOption={this.state.toggleNodeExpansion}
            bindOptionCheckbox={this.bindOptionCheckbox}
            showDisabled={showDisabled}
            caseSensitive={caseSensitive}
            handleExportJson={this.handleExportJson}
            showOnlyMatches={showOnlyMatches}
          />
          {this.state.initialTreeData !== null &&
            <div className="tree-content text-white" style={styles.treeContent}>
              <DndProvider backend={dndBackend}>
                <SortableTree
                  theme={FileExplorerTheme}
                  treeData={treeData}
                  onChange={this.handleTreeOnChange}
                  onMoveNode={this.handleOnMobeNode}
                  maxDepth={this.state.maxDepth}
                  searchMethod={this.customSearchMethod}
                  searchQuery={searchString}
                  searchFocusOffset={searchFocusIndex}
                  canDrag={this.checkCanDrag}
                  canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
                  searchFinishCallback={this.handleSearchFinishCallback}
                  generateNodeProps={this.generateCustomNodeProps}
                />
                <ContextMenu
                  nodeContextState={this.state.nodeContextState}
                  editNode={this.editNode}
                  addNode={this.addNode}
                  removeNode={this.removeNode}
                  nodeItem={this.state.nodeContextState.contextItem}
                  clearContextState={this.clearContextState}
                />
                <CModal
                  show={this.state.nodeContextState.nodeModalToggle}
                  toggle={this.toggleModal}
                  className={'modal-sm modal-primary'}
                >
                  <CModalHeader
                    toggle={this.toggleModal}>
                    {this.state.nodeContextState.modalState === 'add' ? "Add Node" : "Edit Node"}
                  </CModalHeader>
                  <CModalBody>
                    <CFormGroup>
                      <CLabel htmlFor="title">Title</CLabel>
                      <CInput type="text" name="title" onKeyUp={e => this.handleModalFormChange(e)} className="form-control-success" id="title" defaultValue={this.state.nodeItem !== null ? this.state.nodeItem.title : null} />
                    </CFormGroup>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="primary" onClick={this.saveNode}>Save</CButton>
                    <CButton color="secondary" onClick={this.toggleModal}>Cancel</CButton>
                  </CModalFooter>
                </CModal>
              </DndProvider>
            </div>
          }
        </CCardBody>
      </CCard>
    );
  }
}