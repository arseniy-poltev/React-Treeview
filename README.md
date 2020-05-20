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


## Json Data Example 

```
payload:  [
            {
                "title": "Paul Estelle",
                "icon": "user",
                "editable": "true",
                "id": "12",
                "children": [
                    {
                        "expanded": "true",
                        "title": "Theresa Woodruff",
                        "icon": "user",
                        "editable": "false", 
                        "infoColor": "#bfff00",
                        "titleColor": "#0000ff",
                        "iconColor": "#ff4000",
                        "id": "14",
                        "children": [
                            {
                                "expanded": "true",
                                "title": "Lee Weekley",
                                "icon": "user",
                                "editable": "false",
                                "infoColor": "#bfff00",
                                "titleColor": "#0000ff",
                                "iconColor": "#ff4000",
                                "id": "14",
                                "children": [
                                    {
                                        "expanded": "false",
                                        "title": "Estela Anaya",
                                        "icon": "user",
                                        "editable": "false",
                                        "infoColor": "#bfff00",
                                        "titleColor": "#0000ff",
                                        "iconColor": "#ff4000",
                                        "id": "14",
                                        "children": [
                                            {
                                                "expanded": "true",
                                                "title": "Pauline Lassiter",
                                                "icon": "user",
                                                "editable": "false",
                                                "infoColor": "#bfff00",
                                                "titleColor": "#0000ff",
                                                "iconColor": "#ff4000",
                                                "id": "14",
                                                "children": [
                                                    {
                                                        "expanded": "true",
                                                        "title": "Nigel Nolen",
                                                        "icon": "user",
                                                        "editable": "false",
                                                        "infoColor": "#bfff00",
                                                        "titleColor": "#0000ff",
                                                        "iconColor": "#ff4000",
                                                        "disabled": "true",
                                                        "id": "14"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "expanded": "true"
            }
        ]

```
