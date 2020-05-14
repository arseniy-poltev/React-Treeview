const treeInitData = {
  "settings": {
      "titleColor": "#23282c",
      "iconColor": "#23282c",
      "infoColor": "#23282c",
      "maxDepth": 10,
      "showDisabled": true,
      "caseSensitive": true,
      "showOnlyMatches": false,
  },
  "data": [
      {
          "title": "Advanced",
          "icon": "fa-bus",
          "editable": true,
          "id": 12,
          "children": [
              {
                  "expanded": true,
                  "title": "Limit nesti",
                  "icon": "fa-bus",
                  "editable": false,
                  "id": 14
              }
          ],
          "expanded": true
      },
      {
          "expanded": true,
          "title": "Any node can be ",
          "info": 67,
          "icon": "fa-tag",
          "editable": true,
          "id": 4,
          "children": [
              {
                  "expanded": true,
                  "title": "Chicken",
                  "info": 67,
                  "editable": true,
                  "icon": "fa-thumbs-o-up",
                  "children": [
                      {
                          "title": "Egg",
                          "id": 6
                      }
                  ],
                  "id": 5
              }
          ]
      },
      {
          "title": "Button(s) can",
          "info": 232,
          "icon": "fa-contao",
          "editable": true,
          "id": 7
      },
      {
          "title": "Can be used for Title",
          "icon": "fa-envelope-open",
          "info": 10,
          "expanded": true,
          "id": 1,
          "editable": true,
          "disabled": true,
          "children": [
              {
                  "title": "Child Node",
                  "info": 14,
                  "icon": "fa-user-circle",
                  "id": 2,
                  "editable": true
              },
              {
                  "title": "Nested stru",
                  "info": 22,
                  "icon": "fa-credit-card-alt",
                  "id": 3,
                  "disabled": true,
                  "editable": false
              }
          ]
      },
      {
          "title": "Show node chil",
          "info": 122,
          "icon": "fa-paypal",
          "editable": true,
          "id": 8,
          "children": [
              {
                  "title": "Bruce",
                  "info": 122,
                  "id": 9,
                  "children": [
                      {
                          "title": "Bruce Jr.",
                          "id": 10
                      },
                      {
                          "title": "Brucette",
                          "id": 11
                      }
                  ],
                  "expanded": true
              }
          ],
          "expanded": true
      }
  ]
}

export default treeInitData;