import { BST } from '../Components/BST.js'
import { cArray } from '../Components/cArray.js'
import { dragended } from '../Handlers/EventHandler.js'
import { Logger } from '../Components/Logger.js'
import { repaint} from './SimulationHandler.js'
import { getPositionOutsideAllElementsBBox } from '../Utilities/helper_functions.js'


export class DataHandler {
  constructor(svg, windowSize, camera) {
    this.level_state = 0
    this.success_node = 0
    this.drawableList = []
    this.operations = 0
    this.transitioning = false
    this.circle_count = 0
    this.readyForNextLevel = false
    this.svg = svg
    this.windowSize = windowSize
    this.camera = camera
    this.logger = new Logger(this.windowSize.width * 0.01, 20, this.svg)
  }

  clearScene() {
    // fix the level title
    circleManager.clear()
    window.buttonHandler.clear()
    this.logger.clear()
    if (this.level_state > 2) this.logo.remove()
    
    this.readyForNextLevel = false
    this.drawableList.forEach(d => d.delete())
    d3.selectAll(".textnode").remove()
    this.drawableList = []
    window.linkHandler.clear()
    this.circle_count = 0
    this.operations = 0
    dragended()
    
  }

  addOp(op) {
    var rand = Math.floor(Math.random() * 13 + 1)
    audioHandler.play('key' + rand)
    this.operations += 1
    this.logger.addOp(op)
  }


  clearObjects(shape) {
    if (!shape) {
      this.drawableList.forEach(d => {
        d.delete()
      })
    }
    this.drawableList
      .filter(function (d) {
        return d.constructor.name === shape
      })
      .forEach(d => d.delete())
  }

  getAllFiguresOfClass(className) {
    if (className === 'Circle') {
      return circleManager.circles
    }
    return dataHandler.drawableList.filter(function (d) {
      return d.constructor.name === className
    })
  }

  drawFigures() {
    this.drawableList
      .filter(d => d.constructor.name !== 'Logger')
      .filter(d => d.constructor.name !== 'TextArea')
      .sort((a, b) => a.z - b.z)
      .forEach(function (d) {
        d.draw()
      }) // sort all shapes by their z index.
  }

  makeArray(n, descriptor) {
    var position = getPositionOutsideAllElementsBBox()
    return new cArray(n, descriptor, position[0], position[1])
  };

  makeCircle(n) {
    return new Circle(
      Math.round(Math.random() * 20),
      circleManager.max_id++,
      this.windowSize.width / 2,
      this.windowSize.height / 2
    )
  };

  makeBST(root) {
    if (root) root.isInteractable = true
    var position = getPositionOutsideAllElementsBBox()
    return new BST(root, position[0], position[1])
  }

  makeRedBlackBST(root) {
    if (root) root.isInteractable = true
    var position = getPositionOutsideAllElementsBBox()
    var bst = new BST(root, position[0], position[1])
    bst.RedBlackBST = true
    return bst
  }

  removeFigure(fig) {
    var index = this.drawableList.indexOf(fig)
    if (index !== -1) this.drawableList.splice(index, 1)
  }

  addFigure(fig) {
    this.drawableList.push(fig)
    repaint()
  }

}
