class LevelData {
    constructor() {
        this.data = [
            {
                level_type: "Main",
                node_count: 20,
                random_nodes: true,
                range: false,
                type: "Start",
                pan_element: ".everything",
            },
            {
                level_type: "Introduction",
                node_count: 20,
                random_nodes: true,
                range: false,
                type: "circles",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: n => true,
                "lines": ["Hi! My name is Albot", "The circles you see are nodes, try and click on one!"],
                "success_message": "They reveal their value when you click on them.",
                "fail_message": "They reveal their value when you click on them.",
            },
            {
                level_type: "Find",
                node_count: 10,
                random_nodes: true,
                range: false,
                type: "circles",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["The nodes have a key, and a value. Lookup the value by clicking the node","Try to find"],
                "success_message": "Let us try again with another node.",
                "fail_message": "Let us try again with another node.",
            },
            {
                level_type: "Find",
                node_count: 10,
                random_nodes: true,
                range: false,
                type: "circles",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Try to find"],
                "success_message": "Let us try again with another node.",
                "fail_message": "Let us try again with another node.",
            },
            {
                level_type: "Find",
                node_count: 10,
                random_nodes: true,
                range: false,
                type: "circles",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Try to find"],
                "success_message": "There must be a way to orgazine this in a way.",
                "fail_message": "There must be a way to orgazine this in a way.",
            },
            {
                level_type: "Find",
                node_count: 4,
                random_nodes: true,
                range: 10,
                type: "array",
                subtype: "unsorted",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Let us try to arrange the nodes in a data structure, like an array!", "Try to find"],
                "success_message": "Let us try with more nodes.",
                "fail_message": "huh, that didn't make it easier, let us try with more nodes."
            },
            {
                level_type: "Find",
                node_count: 8,
                random_nodes: true,
                range: 10,
                type: "array",
                subtype: "unsorted",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Try to find"],
                "success_message": "Hmm there must be a better way to store the nodes…",
                "fail_message": "Hmm there must be a better way to store the nodes…",
            },
            {
                level_type: "Find",
                node_count: 10,
                random_nodes: true,
                range: 10,
                type: "array",
                subtype: "sorted",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Let us see if we can make it faster by using a SORTED array", "Try to find"],
                "success_message": "Let us try with more nodes",
                "fail_message": "hmm, are you familiar with binary search? perhaps that will speed it up! Let us try with more nodes.",
            },
            {
                level_type: "Find",
                node_count: 15,
                random_nodes: true,
                range: 40,
                type: "array",
                subtype: "sorted",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Try to find"],
                "success_message": "Let us try with more nodes.",
                "fail_message": "hmm, are you familiar with binary search? perhaps that will speed it up! Let us try with more nodes.",
            }, {
                level_type: "Find",
                node_count: 100,
                random_nodes: true,
                range: 30,
                type: "array",
                subtype: "sorted",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Wow that is a lot of nodes! Try to find"],
                "success_message": "Is this just the perfect way of storing nodes or what?",
                "fail_message": "Is this just the perfect way of storing nodes or what?",
            }, {
                level_type: "Demonstration",
                node_count: 100,
                random_nodes: true,
                range: 30,
                type: "array",
                subtype: "insert_demonstration",
                pan_element: ".everything",
                pan_timer: 200,
                success_criteria: (n) => true,
                "lines": ["Maybe i spoke too soon...", "When i want to insert a new node, it can take a long time!", "Click on a node to complete the level"],
                "success_message": "Let try another way to store the nodes",
                "fail_message": "Let try another way to store the nodes",
                initial_mood: "nocomment"
            }, {
                level_type: "Sandbox",
                node_count: 7,
                node_count: 10,
                random_nodes: true,
                range: 40,
                type: "bst",
                subtype: "demonstration",
                pan_element: ".everything",
                pan_timer: 1500,
                success_criteria: (n) => true,
                "lines": ["This is a binary tree.", "See how it is built!", "Right-click the root to test the functionalities!",
                    "Click on a node to complete the level"],
                "success_message": "Now, it is your turn to play with it! Right-click the root to test the functionalities!",
                "fail_message": "Now, it is your turn to play with it! Right-click the root to test the functionalities!"
            }, {
                level_type: "Find",
                node_count: 10,
                random_nodes: false,
                data_list: [5, 2, 8, 1, 3, 4, 7, 9, 6, 0],
                range: false,
                type: "bst",
                subtype: "find",
                pan_element: ".everything",
                pan_timer: 1500,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["If you click on the root node, you can enter the tree", "Try to find"],
                "success_message": " Let us try with a bigger tree",
                "fail_message": " Let us try with a bigger tree",
            }, {
                level_type: "Find",
                node_count: 20,
                random_nodes: true,
                range: 50,
                type: "bst",
                subtype: "find",
                pan_element: ".everything",
                pan_timer: 2500,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Try to find"],
                "success_message": " Let us try with a bigger tree",
                "fail_message": " Let us try with a bigger tree",
            }, {
                level_type: "Find",
                node_count: 20,
                random_nodes: true,
                range: 60,
                type: "bst",
                subtype: "find",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n) => n.value === dataHandler.success_node,
                "lines": ["Try to find"],
                "success_message": "let us see how easy it is to insert new nodes",
                "fail_message": "let us see how easy it is to insert new nodes",
            }, {
                level_type: "Insert",
                node_count: 20,
                random_nodes: true,
                range: 60,
                type: "bst",
                subtype: "insert",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { return n.locked_to_tree && bst.isValid() },
                "lines": ["Try to Insert"],
                "success_message": "",
                "fail_message": "",
            }, {
                level_type: "Insert",
                node_count: 40,
                random_nodes: true,
                range: 60,
                type: "bst",
                subtype: "insert",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { return n.locked_to_tree && bst.checkValidity(n, n) },
                "lines": ["Try to Insert"],
                "success_message": "",
                "fail_message": "",
            }, {
                level_type: "Delete",
                node_count: 30,
                random_nodes: true,
                range: 20,
                type: "bst",
                subtype: "delete",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => {
                    return (!n.locked_to_tree && d3.select(".circle").data().every(c => c.locked_to_tree === bst) && bst.isValid())
                },
                "lines": ["Left-click the links between nodes, to remove a subtree.", "Add a node to the tree by dragging and dropping on null pointers", "Try to only remove "],
                "success_message": "",
                "fail_message": "",
            }, {
                title: "Fix the code on the right side  ",
                level_type: "Coding",
                node_count: 10,
                random_nodes: true,
                range: 60,
                type: "bst",
                subtype: "insert_user_code",
                code:
                    [
                        { text: "insert (node, h) {", editable: false },
                        { text: "    if (h == null) ", editable: false },
                        { text: "    {", editable: false },
                        { text: "        return node;", editable: false },
                        { text: "    }", editable: false },
                        { text: "", editable: false },
                        { text: "    if      (node.value > h.value) {", editable: true },
                        { text: "        h.left = insert(node, h.left);", editable: false },
                        { text: "    }", editable: false },
                        { text: "    else if (node.value > h.value) {", editable: false },
                        { text: "        h.right = insert(node, h.right);", editable: false },
                        { text: "    }", editable: false },
                        { text: "    else {", editable: false },
                        { text: "        h.value = node.value;", editable: false },
                        { text: "    }", editable: false },
                        { text: "", editable: false },
                        { text: "    return h;", editable: false },
                        { text: "}", editable: false }
                    ],
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { return bst && bst.isValid() && dataHandler.getAllFiguresOfClass("Circle").every(c => c.locked_to_tree === bst) },
                "lines": ["Darn, I messed up, please fix my code buddy!", "Edit the lines with a green highlight, and press the button to rebuild."],
                "success_message": "You fixed it!",
                "fail_message": "hmm, that didn't work",
            },
            {
                title: "Fix the code on the right side  ",
                level_type: "Coding",
                node_count: 10,
                random_nodes: true,
                range: 60,
                type: "bst",
                subtype: "insert_user_code",
                code:
                    [
                        { text: "insert (node, h) {", editable: false },
                        { text: "    if (h == null) ", editable: false },
                        { text: "    {", editable: false },
                        { text: "        return node;", editable: false },
                        { text: "    }", editable: false },
                        { text: "", editable: false },
                        { text: "    if      (node.value < h.value) {", editable: false },
                        { text: "        h.left = insert(node, h.left);", editable: false },
                        { text: "    }", editable: false },
                        { text: "    else if (node.value > h.value) {", editable: false },
                        { text: "        h.right = insert(node, h.left);", editable: true },
                        { text: "    }", editable: false },
                        { text: "    else {", editable: false },
                        { text: "        h.value = node.value;", editable: false },
                        { text: "    }", editable: false },
                        { text: "", editable: false },
                        { text: "    return h;", editable: false },
                        { text: "}", editable: false }
                    ],
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { return bst && bst.isValid() && dataHandler.getAllFiguresOfClass("Circle").every(c => c.locked_to_tree === bst) },
                "lines": ["Whoops, now i made an error a different place!", "Edit the lines with a green highlight, and press the button to rebuild."],
                "success_message": "",
                "fail_message": "",
            },
            {
                title: "Fix the code on the right side  ",
                level_type: "Coding",
                node_count: 10,
                random_nodes: true,
                range: 60,
                type: "bst",
                subtype: "insert_user_code",
                code:
                    [
                        { text: "insert (node, h) {", editable: false },
                        {text: "    return h", editable: true}, 
                        { text: "}", editable: false }
                    ],
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { return bst && bst.isValid() && dataHandler.getAllFiguresOfClass("Circle").every(c => c.locked_to_tree === bst) },
                "lines": ["...", "I accidentally deleted all my insert code...", "Can you help me?"],
                "success_message": "",
                "fail_message": "",
                initial_mood: "nocomment"
            },
            {
                level_type: "Demonstration",
                node_count: 15,
                random_nodes: false,
                data_list: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                range: false,
                type: "bst",
                subtype: "insert_demonstration",
                pan_element: ".everything",
                pan_timer: 1500,
                success_criteria: (n) => true,
                "lines": ["Oh my processor...", "Looks like the BST can't solve all our problems :O", "Check the BST when inserting a sorted list of elements"],
                "success_message": "Dang! How can we ensure that the tree is balanced??",
                "fail_message": "Dang! How can we ensure that the tree is balanced??",
            },
            {
                title: "Sandbox",
                level_type: "Sandbox",
                node_count: 20,
                random_nodes: true,
                range: 50,
                type: "rb_bst",
                subtype: "demonstration",
                pan_element: ".everything",
                pan_timer: 1500,
                success_criteria: (n) => true,
                "lines": ["This is a Red-black binary tree.", "See how it is built!", "Right-click the root to test the functionalities!", 
                    "Click on a node to complete the level"],
                "success_message": "Now, it is your turn to play with it! Right-click the root to test the functionalities!",
                "fail_message": "Now, it is your turn to play with it! Right-click the root to test the functionalities!"
            }, {
                level_type: "Find",
                node_count: 40,
                random_nodes: true,
                range: 60,
                type: "rb_bst",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => n.value === dataHandler.success_node,
                "lines": ["...", "What is this?", "It looks similar but how do you even use this data structure?", "Can you help me find"],
                "success_message": "That makes so much sense! It's the same as searching in a regular BST! Thanks for showing me!",
                "fail_message": "",
                initial_mood: "confused"
            }, {
                level_type: "Insert",
                node_count: 40,
                random_nodes: true,
                range: 60,
                type: "rb_bst",
                subtype: "insert",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { console.log(n); return bst && bst.isValid() && d3.select(".circle").data().every(c => c.locked_to_tree === bst) && n.locked_to_tree == bst },
                "lines": ["Try to insert"],
                "success_message": "",
                "fail_message": "",
            }, 
            {
                title: "Fix the code on the right side  ",
                level_type: "Coding",
                node_count: 10,
                random_nodes: true,
                range: 60,
                type: "rb_bst",
                subtype: "insert_user_code",
                code:
                    [
                        { text: "insert (node, h) {",                       editable: false },
                        { text: "    if (h == null) ",                      editable: false },
                        { text: "    {",                                    editable: false },
                        { text: "        return node;",                     editable: false },
                        { text: "    }",                                    editable: false },
                        { text: "",                                         editable: false },
                        { text: "    if      (node.value < h.value) {",     editable: false },
                        { text: "        h.left = insert(node, h.left);",   editable: true },
                        { text: "    }",                                    editable: false },
                        { text: "    else if (node.value > h.value) {",     editable: false },
                        { text: "        h.right = insert(node, h.left);",  editable: true },
                        { text: "    }",                                    editable: false },
                        { text: "    else {",                               editable: false },
                        { text: "        h.value = node.value;",            editable: false },
                        { text: "    }",                                    editable: false },
                        { text: "",                                         editable: false },
                        { text: "    return h;",                            editable: false },
                        { text: "}",                                        editable: false }
                    ],
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: (n, bst) => { return bst && bst.isValid() && dataHandler.getAllFiguresOfClass("Circle").every(c => c.locked_to_tree === bst) },
                "lines": ["...", "This can't be for real.", "How do they expect us to fix this bananas code??"],
                "success_message": "",
                "fail_message": "",
                initial_mood: "notamused"
            },
            {
                level_type: "Sandbox",
                node_count: 10,
                random_nodes: true,
                range: 200,
                type: "sandbox",
                pan_element: ".everything",
                pan_timer: 15000,
                success_criteria: () => false,
                "lines": ["Try to find"],
                "success_message": "",
                "fail_message": "",
            }];
    }
}