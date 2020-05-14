const flatData = {
    settings: {
        titleColor: "#23282c",
        iconColor: "#23282c",
        infoColor: "#23282c",
        disabledColor: "#a64dff",
        maxDepth: 10,
        showDisabled: true,
        caseSensitive: true,
        showOnlyMatches: false,
    },
    data: [{
            editable: true,
            expanded: false,
            icon: "fa-tags",
            id: 4,
            title: "Advanced",
            dragable: false
        },
        {
            editable: true,
            expanded: true,
            icon: "fa-tag",
            id: 4,
            title: "Any node can be",
        },
        {
            editable: false,
            expanded: true,
            disabled: true,
            icon: "fa-bus",
            id: 14,
            title: "Limit nesti",
            parentId: 4
        },
        {
            editable: true,
            expanded: true,
            icon: "fa-thumbs-o-up",
            id: 5,
            title: "Chicken",
            parentId: 4
        },
        {
            editable: false,
            expanded: true,
            icon: "fa-bus",
            id: 6,
            title: "Egg",
            parentId: 5
        },
        {
            editable: false,
            expanded: true,
            icon: "fa-contao",
            id: 7,
            info: 232,
            title: "Button(s) can",
        },
        {
            editable: true,
            expanded: true,
            disabled: true,
            icon: "fa-envelope-open",
            id: 1,
            info: 10,
            title: "Can be used for Title",
        },
        {
            editable: false,
            expanded: true,
            icon: "fa-user-circle",
            id: 2,
            info: 14,
            title: "Child Node",
            parentId: 1
        },
        {
            disabled: true,
            editable: false,
            expanded: true,
            icon: "fa-credit-card-alt",
            id: 3,
            info: 22,
            title: "Nested structure",
            parentId: 1
        },
        {
            editable: true,
            expanded: true,
            icon: "fa-paypal",
            id: 8,
            info: 122,
            title: "Limit nesti",
        },
        {
            expanded: true,
            icon: "fa-bus",
            id: 9,
            info: 23,
            title: "Bruce",
            parentId: 8
        },
        {
            editable: false,
            expanded: true,
            icon: "fa-user",
            id: 10,
            title: "Bruce Jr",
            parentId: 9
        },
        {
            editable: true,
            expanded: true,
            icon: "fa-user",
            id: 11,
            title: "Brucette",
            parentId: 9
        }
    ]
}

export default flatData;