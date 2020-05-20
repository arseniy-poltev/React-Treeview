# React Custom Tree

##Dependency install
```sh
npm i react-sortable-tree
npm i react-sortable-tree-theme-file-explorer
npm i react-dnd
npm i react-dnd-html5-backend
npm i react-dnd-touch-backend
npm i @material-ui/core
npm i axios
npm i react-draggable
npm i font-awesome
```
##Installation and usage
```sh
Copy CustomTreeview folder in your project src.
And import this component into your component where you are goint to use it.


import CustomTree from './CustomTreeview/CustomTree';
.............

const treeConfig = {
  titleColor: "#23282c",
  iconColor: "#23282c",
  infoColor: "#23282c",
  disabledColor: "#a64dff",
  settings: {
    maxDepth: 10,
    showDisabled: true,
    caseSensitive: true,
    showOnlyMatches: false,
  },
  appUrl: "https://apiexample.com/"
}

<Row className="justify-content-center">
    <Col md="4">
        <CardGroup>
        <Card>
            <CardBody className="justify-content-center">
                <CustomTree treeConfig={treeConfig}/>
            </CardBody>
        </Card>
        </CardGroup>
    </Col>
</Row>

```
