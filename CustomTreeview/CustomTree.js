import React from "react";
import { CInput, CFormGroup, CButton, CLabel, CModal, CModalHeader, CModalBody, CModalFooter, CCard, CCardBody, CSpinner } from '@coreui/react';
import { DndProvider } from 'react-dnd';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import axios from 'axios';
import { SortableTreeWithoutDndContext as SortableTree } from "./src/react-sortable-tree";
import { removeNodeAtPath, getNodeAtPath, addNodeUnderParent, changeNodeAtPath, toggleExpandedForAll, getTreeFromFlatData } from './utils/tree-data-utils';
import "react-sortable-tree/style.css";
import ContextMenu from './Components/ContextMenu'
import OptionPanel from './Components/OptionPanel'
import './Resource/styles.css'
import 'font-awesome/css/font-awesome.min.css';
import Draggable from 'react-draggable';
import { match } from "assert";

const styles = {
  treeContent: {
    height: '400px',
    paddingTop: '10px'
  }
}

const isTouchDevice = !!('ontouchstart' in window || navigator.maxTouchPoints);
const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
export default class CustomTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      initialSearchString: "",
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
      isLoading: false,
      treeState: localStorage.getItem("t_setting")
    };
  }
  UNSAFE_componentWillMount() {
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store'
    }

    const months = ['Aaaa zzz', 'Aaaaaa bbb', 'Bbbbbb bbb', 'Bbbb ccc'];
    months.sort();
    console.log(months);

    const data = {};
    this.setState({ isLoading: true });
    // localStorage.removeItem("t_setting");
    axios.post(this.props.treeConfig.appUrl, data, { headers: headers })
      .then(response => {
        const initData = this.loadTreeState(response.data);
        localStorage.setItem("t_setting", JSON.stringify([]));
        let treeData = this.makeTreeData(initData);
        this.setState({ initialTreeData: treeData, treeData: treeData, isLoading: false }, () => {
          this.refreshTreeData();
        });
      });
  }

  componentDidUpdate() {
    if (this.state.treeData.length && this.state.treeData.length > 0) {
      if (localStorage.getItem("t_setting") !== null) {
        let treeState = [];
        treeState = this.fetchTreeState(this.state.treeData, []);
        let saveString = JSON.stringify(treeState);
        localStorage.setItem("t_setting", saveString);
      }
    }
  }

  loadTreeState = (flatData) => {
    let treeState = this.state.treeState;
    if (treeState) {
      treeState = JSON.parse(treeState);

      if (treeState.length > 0) {
        flatData.map(item => {
          treeState.map(sItem => {
            if (item.id === sItem.id) {
              item.expanded = sItem.expanded;
            }
          })

          return item;
        })
      }
    }
    return flatData;
  }
  makeTreeData = (flatData) => {
    let treeData = getTreeFromFlatData({
      flatData: flatData.map(node => ({ ...node, parent: node.parent !== "" ? node.parent : null })),
      getKey: node => node.id,
      getParentKey: node => node.parent,
      rootKey: null
    });

    return treeData;
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
      // this.setState({ searchString: e.target.checked ? this.state.initialSearchString : this.state.initialSearchString.toUpperCase() }, () => {
      //   console.log('this.state.searchString', this.state.searchString);
      // })

      if (!e.target.checked) {
        if (this.state.initialSearchString.toUpperCase() === this.state.initialSearchString) {
          this.setState({ searchString: this.state.initialSearchString.toLocaleLowerCase() })
        } else {
          this.setState({ searchString: this.state.initialSearchString.toUpperCase() })
        }
      } else {
        this.setState({ searchString: this.state.initialSearchString });
      }
    }

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

        if (item.disabled === "false" || item.disabled === 'true') {
          item.disabled = JSON.parse(item.disabled)
        };
        if (item.editable === "false" || item.editable === 'true') {
          item.editable = JSON.parse(item.editable)
        };
        if (item.expanded === "false" || item.expanded === 'true') {
          item.expanded = JSON.parse(item.expanded)
        };
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

      let nodeObject = {};
      if (tmpNode !== null && tmpNode.node !== undefined) {
        nodeObject = tmpNode.node;
        nodeObject.children = [];
        nodeObject.children.push(node);
      }

      parent = this.removeNodesWithoutMatching(nodeObject, parentPath)
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
    // Request: this.state.nodeContextState.contextItem, Response: TreeData

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
      // Request: newRowInfo, Response: TreeData
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
      // Request: newTree.treeData, Response: TreeData to update initialTreeData
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
      initialSearchString: e.target.value,
      searchString: this.state.caseSensitive ? e.target.value : e.target.value.toUpperCase()
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

  getNodeColor(rowInfo, itemType) {
    let itemColor = "";
    if (rowInfo.node.disabled) {
      itemColor = this.state.disabledColor;
    } else {
      if (rowInfo.node[itemType] !== null & rowInfo.node[itemType] !== undefined) {
        itemColor = rowInfo.node[itemType];
      } else {
        itemColor = this.state[itemType];
      }
    }
    return itemColor;
  }

  generateCustomNodeProps = (rowInfo) => ({
    onClick: (event) => {
      rowInfo.clicked = true;
      return rowInfo;
    },
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
        <CFormGroup check className="checkbox">
          <CInput className="form-check-input" type="checkbox" onChange={e => this.handleNodeCheckbox(rowInfo, e)} defaultChecked={rowInfo.node.checked} />
        </CFormGroup>
        <i className={`fa fa-${rowInfo.node.icon} fa-md ml-3 mr-1`} style={{ color: this.getNodeColor(rowInfo, "iconColor") }}></i>
        <span style={{ color: this.getNodeColor(rowInfo, "titleColor") }}>
          {rowInfo.node.title}
        </span>
      </div>
    ),
    buttons: [
      <>
        <span style={{ marginRight: '10px', color: this.getNodeColor(rowInfo, "infoColor") }}>
          {rowInfo.node.info}
        </span>
      </>
    ]
  })

  handleNodeCheckbox = (rowInfo, e) => {
    let newRowInfo = rowInfo.node;
    newRowInfo.checked = e.target.checked;

    // Call api to update node
    // Request: newRowInfo, Response: TreeData
    let newTree = changeNodeAtPath({
      treeData: this.state.treeData,
      path: rowInfo.path,
      newNode: newRowInfo,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    this.setState({ treeData: newTree }, () => ({
    }));
  }

  convertTree = node => {
    if (!node.child) {
      return node;
    }

    const children = node.child
      .map(child => this.convertTree(child));
    delete node.child;
    return Object.assign({}, node, { children });
  };

  fetchTreeState = (tData, tStateList) => {
    tData.map(item => {
      let tmpState = {};
      tmpState.id = item.id;
      tmpState.expanded = item.expanded;
      tStateList.push(tmpState);
      if (item.children) {
        this.fetchTreeState(item.children, tStateList)
      }
    })

    return tStateList;
  }
  handleSaveState = () => {
    let treeState = [];
    treeState = this.fetchTreeState(this.state.treeData, []);
    let saveString = JSON.stringify(treeState);
    localStorage.setItem("t_setting", saveString);
    this.setState({ treeState: saveString });
  }

  displayLoadingSpinner = () => {
    return (
      this.state.isLoading &&
      <div className="sk-circle">
        <div className="sk-circle1 sk-child"></div>
        <div className="sk-circle2 sk-child"></div>
        <div className="sk-circle3 sk-child"></div>
        <div className="sk-circle4 sk-child"></div>
        <div className="sk-circle5 sk-child"></div>
        <div className="sk-circle6 sk-child"></div>
        <div className="sk-circle7 sk-child"></div>
        <div className="sk-circle8 sk-child"></div>
        <div className="sk-circle9 sk-child"></div>
        <div className="sk-circle10 sk-child"></div>
        <div className="sk-circle11 sk-child"></div>
        <div className="sk-circle12 sk-child"></div>
      </div>
    )
  }

  render() {
    const {
      treeData,
      searchString,
      initialSearchString,
      searchFocusIndex,
      showDisabled,
      caseSensitive,
      showOnlyMatches,
      treeState
    } = this.state;

    return (
      <CCard
        custom accentColor="primary"
        headerSlot="Card outline primary"
        className="text-white"
        borderColor="primary"
        style={{ zIndex: 0, position: "relative" }}
      >
        <CCardBody onKeyUp={this.handleKeyEvent} tabIndex="0">
          <Draggable
            allowAnyClick={false}
            handle=".handle"
          >
            <OptionPanel
              handleSearch={this.handleSearchOnChange}
              toggleNodeExpansion={this.toggleNodeExpansion}
              expandCollapseOption={this.state.toggleNodeExpansion}
              bindOptionCheckbox={this.bindOptionCheckbox}
              handleExportJson={this.handleExportJson}
              handleSaveState={this.handleSaveState}
              searchString={initialSearchString}
              showDisabled={showDisabled}
              caseSensitive={caseSensitive}
              showOnlyMatches={showOnlyMatches}
            />
          </Draggable>
          {this.displayLoadingSpinner()}
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
                  onlyExpandSearchedNodes={true}
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
                  className={'modal-sm modal-primary custom-modal'}
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