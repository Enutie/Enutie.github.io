import { repaint } from './SimulationHandler.js'

export function setupKeyEvents () {
  var previous_mouse_pos = []
  d3.select('body').on('mousemove', () => {
    previous_mouse_pos = [d3.event.x, d3.event.y]
    if (window.scissor.drawing) {
      window.scissor.addPoint(previous_mouse_pos[0], previous_mouse_pos[1]);
    }
  })
  d3.select('body').on('keyup', () => {
    if (event.key === "Shift") {
      window.scissor.disable()
    }
  })
  d3.select('body').on('keydown', function () {
    var svg = d3.select('svg')
    if (event.shiftKey) {
      window.scissor.enable(previous_mouse_pos[0], previous_mouse_pos[1])
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      if (document.activeElement.nodeName === 'BODY') {
        console.log('copy')
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      if (document.activeElement.nodeName === 'CODE') {
        d3.event.preventDefault()
        navigator.clipboard.readText().then(text =>{
          console.log(text)

          d3.select(document.activeElement).datum().text = text
          console.log(d3.select(document.activeElement).datum())
          
          dataHandler.getAllFiguresOfClass("TextArea").forEach(d => d.draw())
      })
      }
    } else if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key === 'z'
    ) {
      console.log('redo')
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      console.log('undo')
    } else if (event.key === 'x') {
      if (draggedNode) {
        if (draggedNode.locked_to_tree) {
          dataHandler.removeFigure(draggedNode.locked_to_tree)
          draggedNode.locked_to_tree.delete()
        }
        dataHandler.removeFigure(draggedNode)
        draggedNode.delete()

        repaint()
      }
    } else if (event.key === ' ') {
      if (document.activeElement.nodeName === 'BODY') {
        if (window.levelHandler.readyForNextLevel) { window.levelHandler.nextLevel(); return } // easter egg
        if (window.levelHandler.albot.speaking) {
          window.albot.typeit.instances[0].opts.speed = 10
        }
      }
    } else if (event.key === 'r') {
      if (document.activeElement.nodeName === 'BODY') {
        window.camera.reFocus()
      }
    } else if (event.key === 'Escape') {
      if (document.activeElement.nodeName === 'BODY') {
        window.map.switch() // turn off or on
      }
    } else if (event.key === 'm') {
      if (document.activeElement.nodeName === 'BODY') {
        this.background_music_playing =
        audioHandler.play('Idyllic') // turn off or on
      }
    } else if (event.key === 'ArrowLeft') {
      if (document.activeElement.nodeName === 'BODY') {
        // try to move to the left node
        var list = circleManager.circles.filter(d => d.drawArrowToCircle)
        var d = list[0]
        if (!d || !d.left) return
        d.left.nodeClicked(d.left) 
      }
    } else if (event.key === 'ArrowRight') {
      if (document.activeElement.nodeName === 'BODY') {
        var list = circleManager.circles.filter(d => d.drawArrowToCircle)
        var d = list[0]
        if (!d || !d.right) return
        d.right.nodeClicked(d.right) // d.children[1].nodeClicked(d.children[1]) 
        
      }
    } else if (event.key === 'ArrowUp') {
      if (document.activeElement.nodeName === 'BODY') {
        var list = circleManager.circles.filter(d => d.drawArrowToCircle)
        var d = list[0]
        if (!d || !d.parent) return
        d.parent.nodeClicked(d.parent) 
      }
    }
    // easter egg : difficulty increase
    if (event.key === "+") {
      if (window.levelHandler.currentLevel.subtype === "Start Screen" && circleManager.decimalsAllowed < 1) {
        circleManager.decimalsAllowed++
        circleManager.circleCountFactor++
        console.log("Hard mode enabled. Nice find!")
      }
    }
  })
}

var dragPos

export var draggedNode

export function dragstarted (d) {
  if (d.isPlaceholder && d.locked_to_tree.root !== d) return
  d.startX = d.x
  d.startY = d.y
  d3.selectAll('line').attr('pointer-events', 'none') // remove hovering from all lines
  d.fx = d3.event.x
  d.fy = d3.event.y
  d3.select(this).attr('pointer-events', 'none')
  d3.selectAll('.circle')
    .filter(c => c !== d)
    .attr('pointer-events', 'none') // remove hovering from all nodes except d

}

var previouslyHoveredPlaceholders = []

export function dragged (d) {
  d3.select(this).style('cursor', 'grabbing')
  if (d.isPlaceholder && d.locked_to_tree.root !== d) return
  if (!dragPos) dragPos = [d3.event.x, d3.event.y]
  if (this.className.baseVal === 'array') {
    // check if dragging array
    d3.select(this)
      .data()[0]
      .setTransform(d3.event.x, d3.event.y) // then call array method for updating postion
    return
  }
  previouslyHoveredPlaceholders.forEach(c => c.attr("fill", "white"))
  previouslyHoveredPlaceholders = []

  if (draggedNode) {
    if (!draggedNode.isPlaceholder) {
      // d3.selectAll('circle')
      //   .filter(d => d.isPlaceholder)
      //   .attr('fill', 'white')
      circleManager.circles.filter(c => c.isPlaceholder).some(function (n, i) {
        // check if there is a nearby node where aciton can be performed.
        if (d === n) return false
        var dst = Math.sqrt(
          (d.x - n.x) * (d.x - n.x) + (d.y - n.y) * (d.y - n.y)
          )
          if (d !== n && dst < d.radius + n.radius) {
          if (
            d.locked_to_tree !== n.locked_to_tree &&
              n.locked_to_tree.allowAddingChildToPlaceholder
          ) {
            const circle = d3.selectAll('circle').filter(function (c) {
              return c === n
            })
            previouslyHoveredPlaceholders.push(circle)
            circle.attr('fill', '#228B22')
            // do something
            return true
          }

          // repaint();
          return true
          // do something
        }
      })
    }
    if (draggedNode.hovering_grid) return // if node locked to grid
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  
  draggedNode = d
}

export function dragended (d) {
  if (!d) {
    d3.selectAll('line').attr('pointer-events', 'auto')
    d3.selectAll('.circle').attr('pointer-events', 'auto')
    draggedNode = null
    return
  }
  if (d.isPlaceholder && d.locked_to_tree.root !== d) return
  d3.select(this).style('cursor', 'pointer')
  var distanceDragged = Math.sqrt(
    Math.pow(d3.event.x - d.startX, 2) + Math.pow(d3.event.y - d.startY, 2)
  )
  d3.selectAll('circle')
      .filter(d => d.isPlaceholder)
      .attr('fill', 'white')
    d3.selectAll('line').attr('pointer-events', 'auto')
    d3.selectAll('.circle').attr('pointer-events', 'auto')

  if (distanceDragged < 20) {
    // short drag, do nothing
    if (draggedNode && !draggedNode.locked_grid) {
      d.fx = undefined
      d.fy = undefined
    }
    
    draggedNode = null
    d.click(d)
    return
  }

  d3.select(this).attr('pointer-events', 'auto')

  if (draggedNode) {
    // are we dragging a node
    if (draggedNode.locked_to_tree) {
      var tree = draggedNode.locked_to_tree
      var treeNode = tree.d3tree.descendants().filter(n => n.data === d)[0]

      if (treeNode) {
        treeNode
          .descendants()
          .filter(d => d.data !== draggedNode)
          .forEach(d => {
            // d.data.tree_x = d3.event.x + d.data.tree_x - draggedNode.tree_x
            d.data.tree_y = d3.event.y + d.data.tree_y - draggedNode.tree_y
          })
        // draggedNode.tree_x  = d3.event.x
        draggedNode.tree_y = d3.event.y
        if (tree.root === draggedNode) {
          tree.setTransform(d3.event.x, d3.event.y)
        }
      }
    }
    var cell = d3
      .selectAll('.arraycell')
      .data()
      .filter(d => d.mouseOver)[0] // select array cell where mouse is hovering over

    if (cell) {
      // is mouse hovering over an arraycell
      if (!cell.locked_node) {
        if (d.locked_grid) d.locked_grid.removeCircle()
        cell.addCircle(d, true)
      } else if (cell.locked_node === d) {
        // do nothing
      } else if (cell.locked_node !== d) {
        if (d.locked_grid) d.locked_grid.removeCircle()
        cell.removeCircle()
        cell.addCircle(d, true)
      }
    } else {
      if (d.locked_grid) {
        d.locked_grid.removeCircle()
      }
      d.fx = undefined
      d.fy = undefined
    }
    if (!draggedNode.isPlaceholder) {
      dataHandler
        .getAllFiguresOfClass('Circle')
        .filter(d => d.isPlaceholder)
        .some(function (n, i) {
          // check if there is a nearby node where aciton can be performed.

          if (d === n) return false
          var dst = Math.sqrt(
            (d.x - n.x) * (d.x - n.x) + (d.y - n.y) * (d.y - n.y)
          )
          if (d !== n && dst < d.radius + n.radius) {
            if (
              d.locked_to_tree !== n.locked_to_tree &&
                n.locked_to_tree.allowAddingChildToPlaceholder
            ) {
              d3.selectAll('circle').filter(function (c) {
                return c === n
              })
              var bst = n.locked_to_tree
              // should handle this with in bst instead
              if (bst.root.isPlaceholder) {
                //bst.addChild(d, n)
                
                var ph = bst.root
                if (d.locked_to_tree) {
                  d.locked_to_tree.setTransform(bst.x, bst.y)
                  window.dataHandler.removeFigure(bst)
                  d.locked_to_tree.RedBlackBST = bst.RedBlackBST
                } else {
              
                
                bst.root = d;
                d.locked_to_tree = d;
              }
              circleManager.remove(ph)
                bst.updateLinks()
                repaint()
              } else {
                var index = n.parent.children.indexOf(n)
                bst.addChild(d, n.parent, index)
              }

              if (bst.nodeToInsert) { window.levelHandler.isLevelComplete(bst.nodeToInsert, bst) } else window.levelHandler.isLevelComplete(d, bst)
              repaint()
              return true
              // do something
            }
          }
        })
    }
  }
  if (d) {
    d.setTransform(d3.event.x, d3.event.y)
  }
  d3.selectAll('line').attr('pointer-events', 'auto')
  d3.selectAll('.circle').attr('pointer-events', 'auto')
  if (draggedNode && !draggedNode.locked_grid) {
    d.fx = undefined
    d.fy = undefined
  }
  draggedNode = null
}
