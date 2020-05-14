import { repaint, simulation } from '../Handlers/SimulationHandler.js'

import { scheme } from "../Utilities/Colors.js"
import { AudioHandler } from '../Handlers/AudioHandler.js'

export class Circle {
  constructor (value, id, x, y) {
    this.value = value
    this.radius = 40
    this.isNumberVisible = false
    this.isPlaceholder = false
    this.isSuccessCircle = false
    this.x = x
    this.y = y
    this.cx = x
    this.cy = y
    this.ele = null
    this.z = 0
    this.locked_to_tree = undefined
    this.nodeClicked = this.onNodeClicked
    this.isInteractable = true
    this.isRevealed = false
    this.highlighted = false
    this.id = id
    this.name = id !== undefined ? this.convert(id) : 'null'
    this.validInBST = true
    this.left = null
    this.right = null
    this.drawArrowToCircle = false
    this.current_mouseover = this.mouseover
    this.current_mouseout = this.mouseout
  }

  click (d) {
    window.audioHandler.play("key4")
    d.nodeClicked(d)
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
    } else {
      console.log("can't delete")
    }
  }

  onNodeClicked (d, i) {
    if (d.isPlaceholder || !d.isInteractable) return
    this.defaultClicked(d, i)
  };

  defaultClicked (d, i) {
    if (d.isNumberVisible) return
    if (d.locked_grid) { dataHandler.addOp({ str: d.locked_grid.toString() + ' = ' + d.value }) } else if (d.locked_to_tree) { dataHandler.addOp({ str: 'look_up(' + d.name + ') -> ' + d.value }) } else dataHandler.addOp({ str: 'look_up(' + d.name + ') -> ' + d.value })
    d.isNumberVisible = true
    repaint()
  };

  copySettings(other) {
    this.value = other.value
    this.isRevealed = other.isRevealed
    this.isPlaceholder = other.isPlaceholder
    this.isNumberVisible = other.isNumberVisible
    this.color = other.color
  }

  convert (num) {
    const result = num
      .toString()
      .split('')
      .map(Number)
      .map(n => (n || 10) + 64)
      .map(c => String.fromCharCode(c))
      .join('')
    return result
  }

  setTransform (x, y) {
    this.cx = x
    this.cy = y
    this.x = x
    this.y = y
    simulation.nodes(
      circleManager.circles
    )
  }

  getColor() {
    var d = this
    if (d.isPlaceholder) return 'white'
    // if (d.locked_grid) {
    //   console.log(d.locked_grid)
    //   return d.locked_grid.parent.colorScheme(d.value)
    // }
    else if (!d.isNumberVisible && !d.isRevealed) return 'grey'
    else return scheme(d.value)

  }

  mouseover (d, i) {
    if (!d.isInteractable) {
      const circle = d3.select(d)
      circle.style('cursor', 'not-allowed')
      return
    }
    if (draggedNode) {
      d3.select(d).raise()
      const circle = d3.select(d)
      circle.attr('r', 40)
      return
    }
    const circle = d3.select(d)
    circle.style('cursor', 'pointer')
    circle
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr('r', 40 + 10)
  }

  mouseout (d, i) {
    if (!d.isInteractable) return
    if (draggedNode) {
      const circle = d3.select(d)
      circle.attr('r', 40)
      return
    }
    const circle = d3.select(d)
    circle
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr('r', 40)
  }
}
