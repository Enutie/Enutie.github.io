import { repaint } from '../Handlers/SimulationHandler.js'
import { createRandomPointOnCircumference, arraysEqual } from '../Utilities/helper_functions.js'
import { cText } from '../Components/cText.js'
import { Circle } from './Circle.js'

export class BST {
  constructor (root, x, y) {
    if (!root) {
      this.setRootToPlaceholder()
    } else {
      this.root = root
    }
    this.root.isInteractable = true
    this.root.isRevealed = true
    this.root.locked_to_tree = this
    this.d3tree = d3.hierarchy(this.root)
    this.element = undefined
    this.links = []
    this.link_id_max = 0
    this.z = -3
    this.x = x
    this.y = y
    this.linksCutable = true
    this.width = 500
    this.height = 500
    this.current_node = null
    this.isLectureMode = false
    this.isAnimating = false
    this.name = 'bst'
    this.useOp = true
    this.allowAddingChildToPlaceholder = true
    this.functionsCanBeCalled = false
    this.RedBlackBST = false
    this.allowAddingChildToPlaceholder = true
    this.linksCutable = true
    this.isLectureMode = true
    this.g = d3.select('g')
    this.text = new cText(this.RedBlackBST ? "RB " : "" + "BST", 0, -150, 40, 0, true, this)
    dataHandler.addFigure(this.text)
    
    this.updateLinks()
    this.draw()
  }

  setRootToPlaceholder () {
    this.root = circleManager.createPlaceholder(this)
  }

  updateOnClick (c) {
    var temp = this
    if (this.visual_mode) { // can "illegal operations be made", e.g. accessing a node somewhere in tree without descending from the root.

    }
    c.nodeClicked = function (thisCircle, i) {
      if (!thisCircle.isInteractable) return

      c.onNodeClicked(thisCircle)
      if (!c.children) return

      if (!temp.isLectureMode) return

      temp.d3tree.descendants().forEach(d => { d.data.isNumberVisible = false; d.data.isInteractable = false; d.data.drawArrowToCircle = false; d.data.isRevealed = false })

      c.children.filter(d => !d.isPlaceholder).forEach(d => { d.isInteractable = true; d.isRevealed = true })
      if (c.parent) {
        c.parent.isInteractable = true
        c.parent.isRevealed = true
        c.parent.isNumberVisible = false
      }
      if (!temp.ghostNode) {
        temp.ghostNode = new Circle(-1, -1, temp.root.x, temp.root.y)
    window.circleManager.invisible_circles.push(temp.ghostNode)
      }
      if (temp.ghostNode) {
        temp.ghostNode.cx = thisCircle.x
        temp.ghostNode.cy = thisCircle.y + 75
      }

      // make camera focus on list of available nodes
      var list = [c, c.children[0], c.children[1]]
      if (c.parent) list.push(c.parent)
      camera.SetFocus(list)

      c.isNumberVisible = true
      c.isRevealed = true
      c.drawArrowToCircle = true

      temp.current_node = c

      // everytime a valid node is clicked, check if win condition is met
      repaint()
      window.levelHandler.isLevelComplete(c, temp)
    }
  }

  updateOnClickForInsertion (c) {
    var temp = this

    c.nodeClicked = function (thisCircle, i) {
      if (!thisCircle.isInteractable) return

      if (thisCircle.isPlaceholder) { // this is where the user puts the node
        var index = thisCircle.parent.children.indexOf(thisCircle)
        if (index === 0) thisCircle.parent.left = temp.nodeToInsert
        if (index === 1) thisCircle.parent.right = temp.nodeToInsert

        temp.updateLinks()
        temp.isValid()
        repaint()
        window.levelHandler.isLevelComplete(c, temp)

        return
      }

      // make camera focus on list of available nodes
      var list = [c, c.children[0], c.children[1]]
      if (c.parent) list.push(c.parent)
      camera.SetFocus(list)

      c.onNodeClicked(thisCircle)

      if (!temp.isLectureMode) return

      if (temp.nodeToInsert) {
        temp.nodeToInsert.cx = thisCircle.x
        temp.nodeToInsert.cy = thisCircle.y - 75
      }
      temp.d3tree.descendants().forEach(d => { d.data.isNumberVisible = false; d.data.isInteractable = false; d.data.drawArrowToCircle = false; d.data.isRevealed = false })

      c.children.forEach(d => { d.isInteractable = true; d.isRevealed = true })

      if (c.parent) {
        c.parent.isInteractable = true
        c.parent.isRevealed = true
        c.parent.isNumberVisible = false
      }
      c.isNumberVisible = true
      c.isRevealed = true
      c.drawArrowToCircle = true

      temp.current_node = c

      // everytime a valid node is clicked, check if win condition is met
      window.levelHandler.isLevelComplete(c, temp)

      repaint()
    }
  }

  contains (circle, h) {
    if (h === null) return false
    if (h === undefined) h = this.root

    if (circle.value < h.value) return this.contains(circle, h.children[0])
    if (circle.value > h.value) return this.contains(circle, h.children[1])
    else return true
  }

  delete () {
    this.deleted = true
    console.log(this.text)
    dataHandler.removeFigure(this.text)
    this.text.delete()
    //this.text.remove()
    if (this.element) {
      this.element.remove()
    }
  }

  createPlaceholderChildren (node, bst) {
    var _bst = bst ? bst : this 
    var placeholder = circleManager.createPlaceholder(_bst)
    placeholder.parent = node
    placeholder.x = node.x
    placeholder.y = node.y
    return placeholder
  }

  isRed (n) {
    if (!n) return false
    return n.color === 'red'
  }

  async rotateLeft (h) {
    var x = h.right
    h.right = x.left
    x.left = h
    x.color = x.left.color
    x.left.color = 'red'
    return x
  }

  async rotateRight (h) {
    var x = h.left
    h.left = x.right
    x.right = h
    x.color = x.right.color
    x.right.color = 'red'
    return x
  }

  async flipColors (h) {
    if (h.left === null || h.right === null) return
    await this.animate(true, h)
    if (this.useOp) dataHandler.addOp({ str: 'flipColors(' + h.name + ')' })
    
    var inverseColor = (color) => color === 'red' ? 'black' : 'red'
    h.color = inverseColor(h.color)
    h.left.color = inverseColor(h.left.color)
    h.right.color = inverseColor(h.right.color)
  }

  async publicFind (value, root) {
    this.ghostNode = new Circle(-1, -1, this.root.x, this.root.y)
    window.circleManager.invisible_circles.push(this.ghostNode)

    if (this.root.isPlaceholder) {
      dataHandler.removeFigure(this.root)
      return
    }
    var res =  await this.find(root, value)
    var i = window.circleManager.invisible_circles.indexOf(this.ghostNode)
    window.circleManager.invisible_circles.splice(i, 1)
    return res;
  }

  async find (h, value) {
    if (this.deleted) return
    await this.animate(true, h)
    if (h && this.useOp) dataHandler.addOp({ str: 'find(' + h.name + ', ' + value + ')' })
    // Return value associated with key in the subtree rooted at x;
    // return null if key not present in subtree rooted at x.
    if (h === null) return null

    if (value < h.value) return await this.find(h.left, value)
    else if (value > h.value) return await this.find(h.right, value)
    else return h
  }

  async publicInsert (node, root) {
    node.noCollision = true
    if (this.root.isPlaceholder) {
      circleManager.remove(this.root)
     
      this.root = node
      
      return
    }
    this.root = await this.insert(node, root)
    node.noCollision = false
  }

  async publicDelete (h, value) {
    this.ghostNode = new Circle(-1, -1, this.root.x, this.root.y)
    window.circleManager.invisible_circles.push(this.ghostNode)
    if (this.root.isPlaceholder) {
      return
    }

    this.root = await this.bstDelete(h, value)

    var i = window.circleManager.invisible_circles.indexOf(this.ghostNode)
    window.circleManager.invisible_circles.splice(i, 1)


  }

  async bstDelete (h, value) {
    if (this.deleted) retnod
    await this.animate(true, h)
    if (h === null) { return null }
    if (this.useOp) dataHandler.addOp({ str: 'delete(' + h.name + ', ' + value + ')' })

    if (value < h.value) { h.left = await this.bstDelete(h.left, value) } else if (value > h.value) { h.right = await this.bstDelete(h.right, value) } else {
      if (h.left === null) return h.right
      if (h.right === null) return h.left
      var tmp = h
      h = await this.min(tmp.right)
      h.right = await this.deleteMin(tmp.right)
      h.left = tmp.left
    }

    return h
  }

  async publicBalancedInsert (node, root) {
    if (this.root.isPlaceholder) {
      dataHandler.removeFigure(this.root)
      this.root = node
      return
    }
    if (node.locked_to_tree === this) return
    this.root = await this.balancedInsert(node, this.root)

    if (this.root) {
      this.root.color = 'black'
      this.root.parent = undefined
    }
    repaint()
  }

  async delay () {
    return new Promise(resolve => setTimeout(resolve, timeoutTime))
  }

  async insert (node, h) {
    if (this.deleted) return
    if (h !==null && timeoutTime > 25) {
      if (this.useOp) dataHandler.addOp({ str: 'insert(' + h.name + ', ' + node.value + ')' })
      if (node.value > h.value) node.cx = h.x + 100
      else node.cx = h.x - 100
      node.cy = h.y
      await this.animate(true, h)
    }

    if (h === null) {
      return node
    }

    if (node.value < h.value) {
      h.left = await this.insert(node, h.left)
    } else if (node.value > h.value) {
      h.right = await this.insert(node, h.right)
    } else {
      h.value = node.value
    }

    return h
  }

  async balancedInsert (node, h) {
    if (this.deleted) return
    if (h !==null && timeoutTime > 25) {
      if (this.useOp) dataHandler.addOp({ str: 'insert(' + h.name + ', ' + node.value + ')' })
      if (node.value > h.value) node.cx = h.x + 100
      else node.cx = h.x - 100
      node.cy = h.y
      await this.animate(true, h)
      
    }

    if (h === null) // Do standard insert, with red link to parent.
    {
      node.color = 'red'
      if (this.duplicateEachStep) this.duplicate(500)
      return node
    }

    if (node.value < h.value) {
      h.left = await this.balancedInsert(node, h.left)
    } else if (node.value > h.value) {
      h.right = await this.balancedInsert(node, h.right)
    } else {
      h.value = node.value
    }
    
   

    if (this.isRed(h.right) && !this.isRed(h.left)) { 
      if (this.duplicateEachStep) this.duplicate(500)
      await this.animate(true, h); 
      if (this.useOp) dataHandler.addOp({ str: 'rotateLeft(' + h.name + ')' }) 
      h = await this.rotateLeft(h);
      if (this.hack_for_demonstration && this.root === h.left.parent) { // hack for animation
        h.left.parent.left = h
      }
      if (this.root === h.left) { // hack for animation
        this.root = h
      }
    }
    if (this.isRed(h.left) && this.isRed(h.left.left)) { 
      if (this.duplicateEachStep) this.duplicate(500)
      await this.animate(true, h); 
      if (this.useOp) dataHandler.addOp({ str: 'rotateRight(' + h.name + ')' })
      h = await this.rotateRight(h); 
      if (this.root === h.right) { // hack for animation
        this.root = h
      }
    }
    if (this.isRed(h.left) && this.isRed(h.right)) {
      if (this.duplicateEachStep) this.duplicate(500)
      await this.flipColors(h);
    } 

    return h
  }

  async balance (h) {
    if (this.useOp) dataHandler.addOp({ str: 'balance(' + h.name + ')' })
    await this.animate(true, h)

    if (this.isRed(h.right)) h = this.rotateLeft(h)
    if (this.isRed(h.left) && this.isRed(h.left.left)) h = this.rotateRight(h)
    if (this.isRed(h.left) && this.isRed(h.right)) this.flipColors(h)

    return h
  }

  isEmpty () {
    return this.root === null
  }

  moveRedLeft (h) {
    if (this.useOp) dataHandler.addOp({ str: 'moveRedLeft(' + h.name + ')' })

    this.flipColors(h)
    if (this.isRed(h.right.left)) {
      h.right = this.rotateRight(h.right)
      h = this.rotateLeft(h)
      this.flipColors(h)
    }

    return h
  }

  moveRedRight (h) { // Assuming that h is red and both h.right and h.right.left
    // are black, make h.right or one of its children red.
    if (this.useOp) dataHandler.addOp({ str: 'moveRedRight(' + h.name + ')' })

    this.flipColors(h)
    if (!this.isRed(h.left.left)) {
      h = this.rotateRight(h)
      this.flipColors(h)
    }
    return h
  }

  async animate (updateLinks, h) {
    if (h !==null && timeoutTime > 25) {
      if (this.ghostNode) {
        this.ghostNode.cx = h.x
        this.ghostNode.cy = h.y + 75
      }
      h.drawArrowToCircle = true
      if (updateLinks) this.updateLinks()
      repaint()
      await this.delay(timeoutTime)
      h.drawArrowToCircle = false
    }
  }

  async min (h) {
    if (this.useOp) dataHandler.addOp({ str: 'min(' + h.name + ')' })
    await this.animate(true, h)
    if (h.left === null) return h
    return await this.min(h.left)
  }

  async deleteMin (h) {
    if (this.useOp) dataHandler.addOp({ str: 'deleteMin(' + h.name + ')' })
    await this.animate(false, h)

    if (h.left === null) return h.right
    h.left = await this.deleteMin(h.left)
    return h
  }

  async balancedDeleteMin (h) {
    if (this.useOp) dataHandler.addOp({ str: 'deleteMin(' + h.name + ')' })
    await this.animate(false, h)
    if (h.left === null) { return null }

    if (!this.isRed(h.left) && !this.isRed(h.left.left)) { h = this.moveRedLeft(h) }

    h.left = await this.balancedDeleteMin(h.left)
    return await this.balance(h)
  }

  async publicBalancedDelete (h, value) {
    if (this.d3tree.descendants().filter(d => d.value === value).length === 0) return null // assert the element is in the bst
    this.ghostNode = new Circle(-1, -1, this.root.x, this.root.y)
    window.circleManager.invisible_circles.push(this.ghostNode)
    if (!this.isRed(this.root.left) && !this.isRed(this.root.right)) {
      this.root.color = 'red'
    }
    this.root = await this.bstBalancedDelete(this.root, value)
    if (!this.isEmpty()) this.root.color = 'black'
    var i = window.circleManager.invisible_circles.indexOf(this.ghostNode)
    window.circleManager.invisible_circles.splice(i, 1)
    this.updateLinks()
    repaint()
  }

  async bstBalancedDelete (h, value) {
    if (this.useOp) dataHandler.addOp({ str: 'delete(' + h.name + ', ' + value + ')' })
    if (this.deleted) { return }
    await this.animate(false, h)

    if (value < h.value) {
      if (!this.isRed(h.left) && !this.isRed(h.left.left)) {
        h = this.moveRedLeft(h)
      }
      h.left = await this.bstBalancedDelete(h.left, value)
    } else {
      if (this.isRed(h.left)) {
        h = this.rotateRight(h)
      }

      if (value === h.value && (h.right === null)) { return null }

      if (!this.isRed(h.right) && !this.isRed(h.right.left)) {
        h = this.moveRedRight(h)
      }

      if (value === h.value) {
        var tmp = h
        h = await this.min(tmp.right)

        h.right = await this.balancedDeleteMin(tmp.right)
        h.left = tmp.left
      } else { h.right = await this.bstBalancedDelete(h.right, value) }
    }

    return await this.balance(h)
  }

  async insertWithCustomCode (node, root) {
    var textarea = d3.selectAll('.textarea').data()[0]

    var userCode = textarea.getCode()

    // eslint-disable-next-line no-eval
    try {
      var x = eval(userCode)
    }
    catch (err) {
      var error_message = err.message.split("\n")[0]
      window.albot.say(["aaah, found a syntax error in your code!!", error_message], 0, 0)
    }
    return await x
  }

  insertNoTimeout (node, root) {
    return this.insert(node, root, (n, r) => this.insertNoTimeout(n, r))
  }

  dir (index) { // gets index of element in list and returns str
    return index === 1 ? 'right' : 'left'
  }

  recLockToTree (c, tree) {
    c.locked_to_tree = tree
    if (c.children) c.children.forEach(d => this.recLockToTree(d, tree))
  }

  addChild (child, parent, index) {
    if (this.useOp) dataHandler.addOp({ str: parent.name + '.' + this.dir(index) + ' = ' + child.name })
    if (child.locked_to_tree) {
      if (child.locked_to_tree.root === child) {
        dataHandler.removeFigure(child.locked_to_tree)
        child.locked_to_tree.delete()
      } else {
        var i = child.parent.children.indexOf(child)
        if (i === 0) { child.parent.left = null }
        if (i === 1) { child.parent.right = null }
        child.locked_to_tree.updateLinks()
      }
    }

    this.recLockToTree(child, parent.locked_to_tree)
    if (index === 0) parent.left = child
    if (index === 1) parent.right = child
    this.updateLinks()
  }

  removeChild (child, parent) {
    this.recLockToTree(child, undefined)

    var index = parent.children.indexOf(child)
    if (index !== null) parent.children.splice(index, 1)

    if (index === 0) parent.left = null
    if (index === 1) parent.right = null

    if (child.children) {
      if (child.children.filter(d => !d.isPlaceholder).length > 0) {
        // then create with child as root
        var coord = createRandomPointOnCircumference([child.x, child.y], 500)
        var bst = new BST(child, coord[0], coord[1])
        bst.RedBlackBST = this.RedBlackBST
        this.recLockToTree(child, bst)
        dataHandler.drawableList.push(bst)
        bst.updateLinks()
        repaint()
      } else {
        child.children.forEach(d => { circleManager.remove(d) })
        child.children = undefined
        var coord = createRandomPointOnCircumference([child.x, child.y], 500)
        child.cx = coord[0]
        child.cy = coord[1]
      }
    }

    // this.createPlaceholderChildren(parent, index)
    this.updateLinks()
  }

  removeLink (link) {
    var parent = link.source.data
    var child = link.target.data
    var index = link.source.data.children.indexOf(link.target.data)
    this.removeChild(link.target.data, link.source.data)
    // this.createPlaceholderChildren(link.source.data, index)
    if (this.useOp) dataHandler.addOp({ str: parent.name + '.' + this.dir(index) + ' = ' + 'null' })

    window.levelHandler.isLevelComplete(child, this)
    // repaint();
  }


  updateLinks () {
    if (!this.root) {
      this.setRootToPlaceholder()
    }
    var temp = this

    var recSetChildren = function (n) {
      if (n === null) return
      if (n.children) {
        var childrenThisUpdate = n.children.reduce((list, element) => {
          if (element.isPlaceholder) {
            return list.concat(null)
          } else {
            return list.concat(element)
          }
        }, [])

        if (!arraysEqual(childrenThisUpdate, [n.left, n.right])) {
          n.children.filter(d => d.isPlaceholder).forEach(d2 => {
            circleManager.remove(d2)
          })
        } else {
          recSetChildren(n.left)
          recSetChildren(n.right)
          return
        }
      }
      n.children = []
      if (n.isPlaceholder) {
        n.children = null
        return
      }
      n.locked_to_tree = temp
      if (n.left === null) {
        n.children[0] = temp.createPlaceholderChildren(n, temp)
        n.children[0].parent = n
      } else {
        n.children[0] = n.left
        n.children[0].parent = n
        recSetChildren(n.left)
      }
      if (n.right === null) {
        n.children[1] = temp.createPlaceholderChildren(n, temp)
        n.children[1].parent = n
      } else {
        n.children[1] = n.right
        n.children[1].parent = n
        recSetChildren(n.right)
      } 
      d3.selectAll('.circle').data().filter(d => d.isPlaceholder && d.locked_to_tree === temp).forEach((d) => {
        if (!d.parent) return
        if (!d.parent.children) return
        if (!d.parent.children.includes(d)) {
          circleManager.remove(d)
        }
      })
    }

    recSetChildren(this.root)

    this.updateForces()
  }

  
  updateForces () {
    this.d3tree = d3.hierarchy(this.root)
    this.updatetreeNodePositions()
  }

  updatetreeNodePositions () {
    var temp = this
    var treemap = d3.tree()
      .nodeSize([90, 90])
      .separation(function (a, b) {
        return a.parent === b.parent ? 1 : 2
      })
    this.treeData = treemap(this.d3tree)
    var treeNodes = this.treeData.descendants()

    treeNodes.forEach(function (d) {

      d.y += temp.y
      d.x += temp.x
        
      d.data.tree_x = d.x
      d.data.tree_y = d.y
    })
  }

  isValid () {
    var valid = true
    var temp = this
    if (this.RedBlackBST) {
      var realNodes = this.d3tree.descendants().filter(d => !d.data.isPlaceholder)

      // 1. Every node is either red or black.
      var allNodesRedOrBlack = realNodes.every(d => d.data.color === 'red' || d.data.color === 'black')

      // 2. The root is black.
      var rootBlack = temp.root.color === 'black'

      // 4. If a node is red, then both its children are black.
      var isNodeRed = realNodes.every(d => {
        if (d.data.color === 'red') {
          if (d.data.children.every(d => d.color === 'black' || d.isPlaceholder)) {
            d.validInBST = true
            return true
          } else {
            d.validInBST = false
            return false
          }
        } else {
          return true
        }
      })

      // 5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes.
      var recursiveBlackDescendants = function (n, count) {
        if (n === null) return count
        if (n.color === 'black') { count += 1 }

        var left_count = recursiveBlackDescendants(n.left, count)
        var right_count = recursiveBlackDescendants(n.right, count)

        if (right_count !== left_count) {
          n.validInBST = false
          return false
        } else {
          n.validInBST = true
          return true
        }
      }

      var allDescendantsBlackCount = this.d3tree.descendants().map(d => d.data).filter(d => d.isPlaceholder).every(d => {
        return recursiveBlackDescendants(d, 0)
      })

      return allNodesRedOrBlack && rootBlack && isNodeRed && allDescendantsBlackCount
    } else {
      this.d3tree.descendants().map(d => d.data).filter(d => !d.isPlaceholder).forEach(d => {
        var b = temp.checkValidity(d, d)
        d.validInBST = b
        
        if (!b) valid = false
      })

      return valid
    }
  }

  checkValidity (nav, checkedNode) {
    if (nav === this.root) {
      return true
    }

    var i = nav.parent.children.indexOf(nav)

    if (i === 0) { // left child
      if (checkedNode.value < nav.parent.value) {
        return this.checkValidity(nav.parent, checkedNode)
      } else {
        return false
      }
    } else { // right child
      if (checkedNode.value > nav.parent.value) {
        return this.checkValidity(nav.parent, checkedNode)
      } else {
        return false
      }
    }
  }

  copySettings(other) {
    this.RedBlackBST = other.RedBlackBST
    this.linksCutable = other.linksCutable
    this.useOp = other.useOp
    this.allowAddingChildToPlaceholder = other.allowAddingChildToPlaceholder
    this.isLectureMode = other.isLectureMode
    this.text.opacity = other.text.opacity

  }
  getRandomNode () {
    var nodes = this.d3tree.descendants().filter(d => !d.data.isPlaceholder)
    return nodes[Math.floor(Math.random() * nodes.length)].data
  }

  setTransform (x, y) {
    this.x = x
    this.y = y
    this.text.draw()
    this.updateForces()
  }

  draw () {
    var temp = this
    this.links = this.d3tree.links()
    this.text.opacity = 0
    this.text.text = ((this.RedBlackBST ? "RB " : "") + "BST")

    if (!this.element) {
      this.element = this.g.append('g')
      this.element.attr('class', 'BST')
    }

    
  }

  cutLink (d) {
    var temp = this

    if (!temp.linksCutable || d.target.data.isPlaceholder) return
    // remove from list of elements drawn
    var rand = Math.floor(Math.random() * 3 + 1)
    audioHandler.play('scissor_cut' + rand)
    dataHandler.removeFigure(d)
    // remove from parent trees list of link
    temp.removeLink(d)

    repaint()
  }

  duplicate(x, y) {
    var old_bst = this
    console.log(new_bst)
    
    var element = old_bst.root
    var new_circle = circleManager.generateNodes(1, true, false, element.nodeClicked)[0]
    new_circle.copySettings(element)
    var new_bst = new BST(new_circle, old_bst.x, old_bst.y)
    new_bst.copySettings(old_bst)
    new_circle.locked_to_tree = new_bst;
    window.dataHandler.addFigure(new_bst)

    if (x) old_bst.x += x 
    if (y) old_bst.y += y

    var traverseTreeAndDuplicateNodes = (old_bst_here, new_bst_here) => {

      var element_left = old_bst_here.left
      if (element_left) {
        var new_circle_left = circleManager.generateNodes(1, true, false, element_left.nodeClicked)[0]
        new_circle_left.copySettings(element_left)
        new_circle_left.locked_to_tree = new_bst;
        new_bst_here.left = new_circle_left
        traverseTreeAndDuplicateNodes(element_left, new_bst_here.left)
      }
      
      var element_right = old_bst_here.right
      if (element_right) {
        var new_circle_right = circleManager.generateNodes(1, true, false, element_right.nodeClicked)[0]
        new_circle_right.copySettings(element_right)
        new_circle_right.locked_to_tree = new_bst;
        new_bst_here.right = new_circle_right
        traverseTreeAndDuplicateNodes(element_right, new_bst_here.right)
      }
    } 

    traverseTreeAndDuplicateNodes(old_bst.root, new_bst.root)
    old_bst.updateForces();
    new_bst.updateLinks()
    repaint()
    return new_bst
  }
}
