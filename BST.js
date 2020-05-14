

class BST {
    constructor(root, x, y) {
        if (!root) {
            this.setRootToPlaceholder()
        }
        else {
            //this.createPlaceholderChildren(root)
        }
        console.log(this.root)
        this.root = root;
        root.isInteractable = true;
        root.isRevealed = true;
        this.root.locked_to_tree = this;
        this.d3tree = d3.hierarchy(root)
        /* this.root.data.fx = root.x
        this.root.data.fy = root.y */
        this.element = undefined;
        this.links = []
        this.z = -3
        this.x = x
        this.y = y
        this.linksCutable = true;
        //this.createPlaceholderChildren(root)
        this.visual_mode;
        this.width = 500;
        this.height = 500;
        this.current_node = null;
        this.isLectureMode = false;
        this.isAnimating = false;
        this.name = "bst";
        this.use_op = true
        this.node_to_insert;
        this.allowAddingChildToPlaceholder = true;
        this.draw();
        this.functionsCanBeCalled = false
        this.RedBlackBST = false
        

    }

    setRootToPlaceholder() {
        this.root = new Circle(null, circle_manager.max_id++, width / 2, height * 1.2)
        this.root.isPlaceholder = true;
        this.root.locked_to_tree = this;
        this.root.isInteractable = false;
        this.root.parent = node;
        circle_manager.add(this.root)
    }

    updateOnClick(c) {
        var temp = this;
        if (this.visual_mode) { // can "illegal operations be made", e.g. accessing a node somewhere in tree without descending from the root.

        }
        c.nodeClicked = function (thisCircle, i) {
            if (!thisCircle.isInteractable) return;


            onNodeClicked(thisCircle);

            if (!temp.isLectureMode) return;

            temp.d3tree.descendants().forEach(d => { d.data.isNumberVisible = false; d.data.isInteractable = false; d.data.drawArrowToCircle = false; d.data.isRevealed = false })


            c.children.filter(d => !d.isPlaceholder).forEach(d => { d.isInteractable = true; d.isRevealed = true })
            if (c.parent) {
                c.parent.isInteractable = true;
                c.parent.isRevealed = true
                c.parent.isNumberVisible = false
            }
            
            // make camera focus on list of available nodes
            var list = [c, c.children[0], c.children[1]]
            if (c.parent) list.push(c.parent)
            camera.SetFocus(list)

            c.isNumberVisible = true;
            c.isRevealed = true;
            c.drawArrowToCircle = true;


            temp.current_node = c;

            // everytime a valid node is clicked, check if win condition is met
            repaint();
            dataHandler.isSuccess(c, temp);

            // camera.panToD3Node(c, 300)
        }
    }

    updateOnClickForInsertion(c) {
        var temp = this;

        c.nodeClicked = function (thisCircle, i) {
            console.log(thisCircle)
            
            if (!thisCircle.isInteractable) return;

            if (thisCircle.isPlaceholder) { //this is where the user puts the node
                var index = thisCircle.parent.children.indexOf(thisCircle)
                //var index = n.this.children.indexOf(n)
                //bst.addChild(d, n.parent, index)
                if (index === 0) thisCircle.parent.left = temp.node_to_insert
                if (index === 1) thisCircle.parent.right = temp.node_to_insert

                
                //temp.node_to_insert.validInBST = temp.checkValidity(temp.node_to_insert, temp.node_to_insert)
                temp.updateLinks()
                temp.isValid()
                repaint();
                dataHandler.isSuccess(temp.node_to_insert, temp);

                return;
            }


            // make camera focus on list of available nodes
            var list = [c, c.children[0], c.children[1]]
            if (c.parent) list.push(c.parent)
            camera.SetFocus(list)

            onNodeClicked(thisCircle);

            if (!temp.isLectureMode) return;

            if (temp.node_to_insert) {
                temp.node_to_insert.cx = thisCircle.x
                temp.node_to_insert.cy = thisCircle.y - 75
            }
            temp.d3tree.descendants().forEach(d => { d.data.isNumberVisible = false; d.data.isInteractable = false; d.data.drawArrowToCircle = false; d.data.isRevealed = false })


            c.children/* .filter(d => d.isPlaceholder) */.forEach(d => { d.isInteractable = true; d.isRevealed = true })

            if (c.parent) {
                c.parent.isInteractable = true;
                c.parent.isRevealed = true
                c.parent.isNumberVisible = false
            }
            c.isNumberVisible = true;
            c.isRevealed = true;
            c.drawArrowToCircle = true;


            temp.current_node = c;

            // everytime a valid node is clicked, check if win condition is met
            dataHandler.isSuccess(temp.node_to_insert, temp)
            
            repaint();

            // camera.panToD3Node(c, 300)
        }
    }

    contains(circle, h) {
        if (h === null) return false;
        if (h === undefined) h = this.root
        
        if (circle.value < h.value) return this.contains(circle, h.children[0])
        if (circle.value > h.value) return this.contains(circle, h.children[1])
        else return true

        //return this.root == circle || this.d3tree.descendants().map(d => d.data).includes(circle)
    }

    delete() {
        this.deleted = true;
        if (this.element) {
            this.element.remove();
        }
    }

    createPlaceholderChildren(node, i) {
        var empty_circle = new Circle(null, circle_manager.max_id++, node.x, node.y)
        empty_circle.isPlaceholder = true;
        empty_circle.locked_to_tree = this;
        empty_circle.isInteractable = false;
        empty_circle.parent = node;
        empty_circle.color = "black";
        circle_manager.add(empty_circle)
        return empty_circle
    }


    isRed(n) {
        if (n == null) return false;
        return n.color == "red"
    }

    rotateLeft(h)
    {
        var x = h.right;
        h.right = x.left;
        x.left = h;
        x.color = x.left.color;
        x.left.color = "red";
        //x.left.color = "red"
        //h.color = "red";
        return x;
    }   

    rotateRight(h)
    {
        var x = h.left;
        h.left = x.right;
        x.right = h;
        x.color = x.right.color;
        x.right.color = "red";
        //x.right.color = "red"
        //h.color = "red";
        return x;
    }

    flipColors(h)
    {
        if (h.left == null || h.right == null) return;
        var inverse_color = (color) => color == "red" ? "black" : "red"
        h.color = inverse_color(h.color)
        h.left.color = inverse_color(h.left.color)
        h.right.color = inverse_color(h.right.color)
    }

    

    async public_find(value, root) {
        if (this.root.isPlaceholder) {
            console.log("deleting placehodler")
            dataHandler.removeFigure(this.root)
            this.root = node;
            return;
        } 
        return await this.find(root, value)
    }

    async find (h, value)
    { 
        if (this.deleted) return
        if (h && this.use_op) dataHandler.addOp({ str: "find("+ h.name + ", " + value + ")" })
        await this.animate(true, h)
         // Return value associated with key in the subtree rooted at x;
        // return null if key not present in subtree rooted at x.
        if (h == null) return null;
        
        if      (value < h.value) return await this.find(h.left, value);
        else if (value > h.value) return await this.find(h.right, value);
        else return h;
    }

    async public_insert(node, root) {
        node.noCollision = true
        if (this.root.isPlaceholder) {
            console.log("deleting placehodler")
            dataHandler.removeFigure(this.root)
            this.root = node;
            return;
        } 
        this.root = await this.insert(node, root)
        node.noCollision = false
    }

    async public_delete(h, value) {
        if (this.root.isPlaceholder) {
            return;
        } 

        this.root = await this.bst_delete(h, value)
        if (node.locked_to_tree === this) { 
            node.locked_to_tree = null;
            node.children.forEach(d => {
                if (d.isPlaceholder) {
                    dataHandler.removeFigure(d)
                    d.delete()
                }
            })
        }
    }
    
    async bst_delete(h, value) {
        if (this.deleted) return
        if (this.use_op) dataHandler.addOp({ str: "delete("+ h.name + ", " + value + ")" })
        await this.animate(true, h)

        console.log(h)
        if (h == null)  { return null; }
        
        if      (value < h.value) { h.left = await this.bst_delete(h.left, value); }
        else if (value > h.value) { h.right = await this.bst_delete(h.right, value); }
        else {
            if (h.left == null) return h.right;
            if (h.right == null) return h.left;
            var tmp = h;
            h = await this.min(tmp.right);  
            h.right = await this.deleteMin(tmp.right);
            h.left = tmp.left;
        }

        return h;
    }


    async public_balanced_insert(node, root) {
        if (this.root.isPlaceholder) {
            console.log("deleting placehodler")
            dataHandler.removeFigure(this.root)
            this.root = node;
            return;
        } 
        this.root = await this.balanced_insert(node, this.root)
        this.root.color = "black"
    }

    async delay() {
        return new Promise(resolve => setTimeout(resolve, timeout_time))
    }
    async insert(node, h) {
        if (this.deleted) return
        if (h != null && timeout_time > 25) {
            if (this.use_op) dataHandler.addOp({ str: "insert("+ h.name + ", " + node.value + ")" })
            if (node.value > h.value) node.cx = h.x + 100
            else node.cx = h.x - 100
            node.cy = h.y
            h.drawArrowToCircle = true
            this.updateLinks()
            repaint()
            await this.delay()   
            h.drawArrowToCircle = false
        }
        
        if (h == null)  // Do standard insert, with red link to parent.
        {
            return node;
        }

        if      (node.value < h.value) {
            h.left = await this.insert(node, h.left);
        }
        else if (node.value > h.value) {
            h.right = await this.insert(node, h.right);
        }
        else {
            h.value = node.value;
        }

        return h;
    }

    async balanced_insert(node, h) {
        if (this.deleted) return
        if (h != null && timeout_time > 25) {
            if (this.use_op) dataHandler.addOp({ str: "insert("+ h.name + ", " + node.value + ")" })
            if (node.value > h.value) node.cx = h.x + 100
            else node.cx = h.x - 100
            node.cy = h.y
            h.drawArrowToCircle = true
            this.updateLinks()
            repaint()
            await this.delay()   
            h.drawArrowToCircle = false
        }

        if (h == null)  // Do standard insert, with red link to parent.
        {
            node.color = "red";
            return node;
        }

        if      (node.value < h.value) {
            h.left = await this.balanced_insert(node, h.left);
        }
        else if (node.value > h.value) {
            h.right = await this.balanced_insert(node, h.right);
        }
        else {
            h.value = node.value;
        }

        
        if (this.isRed(h.right) && !this.isRed(h.left))    h = this.rotateLeft(h);
        if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
        if (this.isRed(h.left) && this.isRed(h.right))     this.flipColors(h);  

        return h;


    }
    async balance(h) {
        if (this.use_op) dataHandler.addOp({ str: "balance(" + h.name + ")" })
        await this.animate(true, h)

        if (this.isRed(h.right))                      h = this.rotateLeft(h);
        if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h);
        if (this.isRed(h.left) && this.isRed(h.right))     this.flipColors(h);
        

        return h;
    }


    

    isEmpty() {
        return this.root == null
    }
    moveRedLeft(h) {
        if (this.use_op) dataHandler.addOp({ str: "moveRedLeft("+ h.name + ")" })

        this.flipColors(h);
        if (this.isRed(h.right.left)) { 
            h.right = this.rotateRight(h.right);
            h = this.rotateLeft(h);
            this.flipColors(h);
        }

        return h;
    }

    moveRedRight(h)
    {  // Assuming that h is red and both h.right and h.right.left
    // are black, make h.right or one of its children red.
        //console.log(h)
        if (this.use_op) dataHandler.addOp({ str: "moveRedRight("+ h.name + ")" })
        
        this.flipColors(h)
        if (!this.isRed(h.left.left))
        {
            h = this.rotateRight(h);
            this.flipColors(h);

        }
        return h;
    }

    async animate(updateLinks, h) {
        if (h != null && timeout_time > 25) {
            h.drawArrowToCircle = true
            if (updateLinks) this.updateLinks()
            repaint()
            await this.delay(timeout_time)   
            h.drawArrowToCircle = false
        }
    }

    async min(h)
    {   
        if (this.use_op) dataHandler.addOp({ str: "min(" + h.name + ")" })
        await this.animate(true, h)
        if (h.left == null) return h;
        return await this.min(h.left);
    }

    async deleteMin(h)
    {
        if (this.use_op) dataHandler.addOp({ str: "deleteMin("+ h.name + ")" })
        await this.animate(false, h)

       if (h.left == null) return h.right;
       h.left = await this.deleteMin(h.left);
       return h;
    }

    async balanced_deleteMin(h) { 
        if (this.use_op) dataHandler.addOp({ str: "deleteMin("+ h.name + ")" })
        await this.animate(false, h)
        if (h.left == null)
            return null;

        if (!this.isRed(h.left) && !this.isRed(h.left.left))
            h = this.moveRedLeft(h);

        h.left = await this.balanced_deleteMin(h.left);
        return await this.balance(h);
    }


    async public_balanced_delete(h, value)
    {
        if (this.d3tree.descendants().filter(d => d.value == value).length == 0) return null; // assert the element is in the bst
        if (!this.isRed(this.root.left) && !this.isRed(this.root.right))
        {
            this.root.color = "red";
        }
        this.root = await this.bst_balanced_delete(this.root, value);
        if (!this.isEmpty()) this.root.color = "black";
        this.updateLinks()
        repaint()
    }

    

    async bst_balanced_delete(h, value) { 
        if (this.deleted) { return}
        if (this.use_op) dataHandler.addOp({ str: "delete("+ h.name + ", " + value + ")" })
        await this.animate(false, h)

        if (value < h.value)  {
            if (!this.isRed(h.left) && !this.isRed(h.left.left))
            {
                h = this.moveRedLeft(h);
            }
            h.left = await this.bst_balanced_delete(h.left, value);
        }
        else {
            if (this.isRed(h.left)) { 
                h = this.rotateRight(h); 
                console.log(h)
            }

            if (value == h.value && (h.right == null)) { return null; }

            if (!this.isRed(h.right) && !this.isRed(h.right.left)) { 
                console.log(h.left)
                h = this.moveRedRight(h); 
            }
                
            if (value == h.value) {
                var tmp = h;
                h = await this.min(tmp.right);  
                
                h.right = await this.balanced_deleteMin(tmp.right);
                h.left = tmp.left;
            }
            else { h.right = await this.bst_balanced_delete(h.right, value); }
        }
        
        return await this.balance(h);
    }

    
    

    async insertWithCustomCode(node, root) {
        var bst = this;
        var temp = this

        var textarea = d3.selectAll(".textarea").data()[0];

        var user_code = textarea.getText();

        var insert_method = convertInputToCode(user_code);
        
        var x = eval(insert_method)
        

        return await x
    }


    insertNoTimeout(node, root) {
        return this.insert(node, root, (n, r) => this.insertNoTimeout(n, r))
    }

    dir(index) { // gets index of element in list and returns str 
        return index === 1 ? "right" : "left";
    }


    rec_lock_to_tree(c, tree) {
        c.locked_to_tree = tree;
        if (c.children) c.children.forEach(d => this.rec_lock_to_tree(d, tree))
    }

    addChild(child, parent, index) {
        if (this.use_op) dataHandler.addOp({ str: parent.name + "." + this.dir(index) + " = " + child.name })
        if (child.locked_to_tree) {
            if (child.locked_to_tree.root == child) {
                dataHandler.removeFigure(child.locked_to_tree);
                child.locked_to_tree.delete()
            } else {
                var i = child.parent.children.indexOf(child)
                if (i == 0) { child.parent.left = null }
                if (i == 1) { child.parent.right = null }
                child.locked_to_tree.updateLinks()
            }
        }

        this.rec_lock_to_tree(child, parent.locked_to_tree)
        if (index === 0) parent.left = child
        if (index === 1) parent.right = child
        this.updateLinks()
    }

    removeChild(child, parent) {

        this.rec_lock_to_tree(child, undefined)

        var index = parent.children.indexOf(child);
        if (index !== null) parent.children.splice(index, 1);

        if (index === 0) parent.left = null
        if (index === 1) parent.right = null

        if (child.children) {
            if (child.children.filter(d => !d.isPlaceholder).length > 0) {

                //then create with child as root
                var coord = dataHandler.createRandomPointOnCircumference([child.x, child.y], 500)
                var bst = new BST(child, coord[0], coord[1])
                this.rec_lock_to_tree(child, bst)
                dataHandler.drawableList.push(bst);
                bst.updateLinks();
                repaint()
            } else {
                child.children.forEach(d => { circle_manager.remove(d) })
                child.children = undefined;
                var coord = dataHandler.createRandomPointOnCircumference([child.x, child.y], 500)
                child.cx = coord[0]
                child.cy = coord[1]
            }
        }

       // this.createPlaceholderChildren(parent, index)
        this.updateLinks()
    }

    removeLink(link) {
        var parent = link.source.data
        var child = link.target.data
        var index = link.source.data.children.indexOf(link.target.data)
        this.removeChild(link.target.data, link.source.data)
        //this.createPlaceholderChildren(link.source.data, index)
        if (this.use_op) dataHandler.addOp({ str: parent.name + "." + this.dir(index) + " = " + "null" })

        //dataHandler.isSuccess(child, this);
        //repaint();
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }


    updateLinks() {
        if (!this.root) {
            this.setRootToPlaceholder()
        }
        var temp = this;

        var rec_set_children = function(n) {
            if (n == null) return;
            if (n.children) {
                var children_this_update = n.children.reduce((list, element) => {
                    if (element.isPlaceholder) {
                        return list.concat(null)
                    } 
                    else {
                        return list.concat(element)
                    }
                }, [])
                
                if (!temp.arraysEqual(children_this_update, [n.left, n.right]))
                {
                    n.children.filter(d => d.isPlaceholder).forEach(d2 => {
                        circle_manager.remove(d2)
                    })
                } else {
                    rec_set_children(n.left)
                    rec_set_children(n.right)
                    return;
                }
            }
            n.children = []
            if (n.isPlaceholder) {
                n.children = null
                return;
            }
            n.locked_to_tree = temp;
            if (n.left == null) {
                n.children[0] = temp.createPlaceholderChildren(n);
                n.children[0].parent = n
            } 
            else {
                n.children[0] = n.left
                n.children[0].parent = n
                rec_set_children(n.left)
            }
            if (n.right == null) {
                n.children[1] = temp.createPlaceholderChildren(n);
                n.children[1].parent = n
            }
            else {
                n.children[1] = n.right
                n.children[1].parent = n
                rec_set_children(n.right)
            }
            d3.selectAll(".circle").data().filter(d => d.isPlaceholder && d.locked_to_tree == temp).forEach((d) => {
                if (!d.parent.children) return;
                if (!d.parent.children.includes(d)) {
                    d.delete()
                }
            })
            
        }


        
        rec_set_children(this.root)
        
        
        this.updateForces()

    }

    rec_minus_y(n, dist) {
        if (!n) return
        n.y = dist
        n.checked = true
        this.rec_minus_y(n.left, dist)
        this.rec_minus_y(n.right, dist)
    }


    updateTreeNodePositions() {
        var temp = this
        var treemap = d3.tree()
            .nodeSize([90, 90])
            .separation(function (a, b) {
                return a.parent == b.parent ? 1 : 2;
            });
        this.treeData = treemap(this.d3tree);
        var tree_nodes = this.treeData.descendants();

        tree_nodes.forEach(function (d) {

            if (d.parent && d.data.color == "red") {
                var dist = d.y - d.parent.y 
                //console.log(d.parent.descendants().length)
                //d.parent.descendants().forEach(d => d.y - dist + temp.y)
                //temp.rec_minus_y(d, d.parent.y + temp.y)
                d.y = d.parent.y
                //d.y += temp.y
                d.x += temp.x
                if (d.data.children.every(d => d.isPlaceholder)) {
                    d.x -= 50 //HACK: should probably be scaled proportionally to the height of the child
                }
            } else {
                d.y += temp.y
                d.x += temp.x
            }
            
            d.data.tree_x = d.x
            d.data.tree_y = d.y
            
        })

    }
    updateForces() {
        var temp = this
        this.d3tree = d3.hierarchy(this.root)
        
        this.updateTreeNodePositions()

        simulation.force("x", d3.forceX().x(function (d) {
            if (d.locked_to_tree) {
                if (d.tree_x){
                    return d.tree_x
                }
                var tree_node = d.locked_to_tree.d3tree.descendants().filter(n => n.data === d)[0]

                if (tree_node) return tree_node.x;
            }
            return d.cx;
        }).strength(0.15));

        simulation.force("y", d3.forceY().y(function (d) {
            if (d.locked_to_tree) {
                if (d.tree_y){
                    return d.tree_y
                }
                var tree_node = d.locked_to_tree.d3tree.descendants().filter(n => n.data === d)[0]
                if (tree_node) return tree_node.y;
            }
            return d.cy;
        }).strength(0.15));
    }

    isValid() {
        this.updateLinks();
        var valid = true;
        var temp = this;
        if (this.RedBlackBST) {
            var real_nodes = this.d3tree.descendants().filter(d => !d.data.isPlaceholder)
            
            // 1. Every node is either red or black.
            var all_nodes_red_or_black = real_nodes.every(d => d.data.color == "red" || d.data.color == "black")
            
            // 2. The root is black.
            var root_black = temp.root.color == "black"
            
            // 4. If a node is red, then both its children are black.
            var if_node_red_then_children_black = real_nodes.every(d => {
                if (d.data.color == "red") {
                    if (d.data.children.every(d => d.color == "black" || d.isPlaceholder)) {
                        d.validInBST = true
                        return true;
                    } else {
                        d.validInBST = false
                        return false 
                    }
                } else {
                    return true
                }
            })

            // 5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes.
            var recursive_black_descendants = function (n, count) {
                if (n == null) return count;
                if (n.color == "black") { count += 1 }

                var left_count = recursive_black_descendants(n.left, count)
                var right_count = recursive_black_descendants(n.right, count)


                if (right_count !== left_count) {
                    n.validInBST = false
                    return false
                } 
                else 
                { 
                    n.validInBST = true
                    return true
                }
            }

            var all_descendants_black_count = this.d3tree.descendants().map(d => d.data).filter(d => d.isPlaceholder).every(d => {
                return recursive_black_descendants(d, 0)
            }) 

            
            
            /* console.log(all_nodes_red_or_black)
            console.log(root_black)
            console.log(if_node_red_then_children_black)
            console.log(all_descendants_black_count) */
            return all_nodes_red_or_black && root_black && if_node_red_then_children_black && all_descendants_black_count
        }
        else {
            this.d3tree.descendants().map(d => d.data).filter(d => !d.isPlaceholder).forEach(d => {
                
                var b = temp.checkValidity(d, d)
                d.validInBST = b
                if (!b) valid = false
            })

            //console.log(this.d3tree.descendants().reduce((list, element) => list.concat(element), []));
            return valid;
        }
    }


    checkValidity(nav, checked_node) {

        if (nav === this.root) {
            return true;
        }

        var i = nav.parent.children.indexOf(nav)

        if (i === 0) { // left child
            if (checked_node.value < nav.parent.value) {
                return this.checkValidity(nav.parent, checked_node)
            } else {
                return false;
            }
        } else { // right child
            if (checked_node.value > nav.parent.value) {
                return this.checkValidity(nav.parent, checked_node)
            } else {
                return false;
            }
        }






    }

    getRandomNode() {
        var nodes = this.d3tree.descendants().filter(d => !d.data.isPlaceholder)
        return nodes[Math.floor(Math.random() * nodes.length)].data
    }
    checkValidityAndBalance() {

    }

    setTransform(x, y) {
        this.x = x
        this.y = y
        var temp = this;

    }

    draw() {
        var temp = this
        //this.updateLinks();
        this.links = this.d3tree.links();
        this.element = g.append("g")



        this.element.attr("class", "BST")

        
        if (this.link_elements) this.link_elements.remove()

        this.link_elements = this.element
        .selectAll("line")
        .data(this.links)
        .join("line")
        .attr("class", "BST_line")
        .attr("stroke", d => {
            if (!temp.RedBlackBST) return "#999"
            if (d.target.data.color == "red") {
                return "red"
            } else if (d.target.data.color == "black")
            {
                return "black"
            } 
        })
        .attr("stroke-width", 10)
    
        .attr("stroke-opacity", 0.6)
        .on("mouseover", function (d) {
            if (!temp.linksCutable || d.target.data.isPlaceholder) return;
            const l = d3.select(this);
            l.attr("stroke-width", 10 * 2)
        })
        .on("mouseout", function (d) {
            if (!temp.linksCutable || d.target.data.isPlaceholder) return;
            const l = d3.select(this);
            l.attr("stroke-width", 10)
        })
        .on("click", function (d) {
            
            this.cutLink(d)
        })
    }
    cutLink(d) {
        var temp = this

        if (!temp.linksCutable || d.target.data.isPlaceholder) return;
        // remove from list of elements drawn
        var rand_nr = Math.floor(Math.random() * 3 + 1)
        audioHandler.play("scissor_cut" + rand_nr);
        dataHandler.removeFigure(d)
        // remove from parent trees list of link
        temp.removeLink(d)
    
    
    
        repaint();
    }
}


