import { Circle } from '../Components/Circle.js'
import { circleContextMenu } from '../Components/ContextMenu.js'
import { scheme, setScheme } from '../Utilities/Colors.js'
import { getLength, createRandomPointOnCircumference } from '../Utilities/helper_functions.js'
import { dragged, dragended, dragstarted, draggedNode } from './EventHandler.js'
import { repaint, simulation } from './SimulationHandler.js'

export class CircleManager {
  constructor (g, windowSize) {
    this.circles = [] // list of circle classes
    this.invisible_circles = []
    this.radius = 40
    this.max_id = 0
    this.quadtree = d3.quadtree()
    this.g = g
    this.windowSize = windowSize
    this.decimalsAllowed = 0
    this.circleCountFactor = 1
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
      this.ele = null
    }
  }

  add (obj) {
    
    if (Array.isArray(obj)) {
      obj.forEach(d => this.circles.push(d))
    } else {
      if (!obj) obj = new Circle(50, this.max_id++, width / 2, width / 2)
      this.circles.push(obj)
    }
    this.quadtree = d3.quadtree().x(d => d.x).y(d => d.y).addAll(this.circles)
    //update color scheme range
    
    var values = this.circles.filter(c => !c.isPlaceholder).map(c => c.value)
    setScheme(Math.min(...values), Math.max(...values))
    this.draw()
  }

  remove (obj) {
    var removeObject = (n) => {
      var index = this.circles.indexOf(n)
      if (index !== -1) {
        this.circles.splice(index, 1)
      }
    }
    if (Array.isArray(obj)) {
      obj.forEach(d => removeObject(d))
      this.quadtree.removeAll(obj)
      this.draw()
    } else {
      removeObject(obj)
      this.quadtree.remove(obj)
      this.draw()
    }
    this.quadtree = d3.quadtree().x(d => d.x).y(d => d.y).addAll(this.circles)
  }

  clear () {
    this.quadtree.removeAll(this.quadtree.data())
    this.circles = []
    this.invisible_circles = []
    repaint()
  }

  generateNodes (n, random, range, onClicked, ignoreCircleCountFactor) {
    var factor = ignoreCircleCountFactor ? 1 : this.circleCountFactor
    if (!range) range = n * factor
    var nodes = []
    while(nodes.length < n * factor){
      var r = parseFloat((Math.random() * n - n/2).toFixed(this.decimalsAllowed));
      if (nodes.some(d => d.value === r) && random) continue
      var pos = createRandomPointOnCircumference([0, 0], 1)
      nodes.push(
        new Circle(
          random ? r : i,
          circleManager.max_id++,
          pos[0] + 0,
          pos[1] + 0
        )
      )
    }
    nodes.forEach(c => {
      c.nodeClicked = (n) =>  onClicked(n)
    })
    this.add(nodes)
    return nodes
  }

  
  getRandomCircle() {
    return this.circles[Math.floor(Math.random() * this.circles.length)]
  }

  showAll() {
    this.circles.forEach(d => 
      {
        d.isNumberVisible = true; d.isRevealed = true;
      })
  }

  getMedian () {
    var bestRoot = this.circles.concat().sort((a, b) => a.value - b.value)[
      Math.floor(this.circles.length / 2)
    ]
    return bestRoot
  }

  createPlaceholder (bst) {
    var circle = new Circle(null, this.max_id++, this.windowSize.width / 2, this.windowSize.height * 1.2)
    circle.isPlaceholder = true
    circle.locked_to_tree = bst
    circle.isInteractable = false
    if (bst.RedBlackBST) circle.color = 'black'
    circleManager.add(circle)
    return circle
  }

  cleanupBSTNodes() {
    var temp = this;
    this.circles.forEach(c => {
      if(c.locked_to_tree) {
        if (!c.locked_to_tree.d3tree.descendants().some(d => d.data === c)) {
          c.locked_to_tree = undefined;
          if (c.children) {
            c.children.forEach(d => temp.remove(d))
          }
        }
      }
    })
  } 

  calculateFontSize(value) {
    var len = getLength(value)
    if (len === 1) return this.radius
    else return this.radius / len * 1.5
  }

  draw (list) {
    var transitionEnterTime = 500
    var transitionExitTime = 200

    var temp = this
    if (!list) list = this.circles

    simulation.nodes(
      this.circles.concat(this.invisible_circles)
    )

    this.circle_eles = this.g
      .selectAll('.circle')
      .data(list, d => d.id)
      .join(
        enter => {
          var cir = enter
          cir
          // all static stuff, not needed to be updated
            .append('circle')
            .attr('r', 0)
            .attr('x', d => d.cx)
            .attr('y', d => d.cy)
            .attr('class', 'circle')
            .on('mouseover', this.mouseover)
            .on('mouseout', this.mouseout)
            .on('click', d => { d.nodeClicked(d) })
            .on('contextmenu', d3.contextMenu(circleContextMenu))
            .call(
              d3
                .drag()
                .on('drag', dragged)
                .on('end', dragended)
                .on('start', dragstarted) 

            )

          // all dynamic stuff, this should be in update as well.
            .attr('fill', function (d) {
              return d.getColor()
            })
            .style('stroke-width', d => d.highlighted ? 5 : 0)
            .style('stroke-dasharray', '5,3') // make the stroke dashed
            .style('stroke', 'pink')
            .style('stroke-opacity', d => d.isPlaceholder ? 0.4 : 0)
            .style('stroke-width', d => d.isPlaceholder ? 5 : 0)
            .style('stroke-dasharray', d => d.isPlaceholder ? '10,3' : '0,0') // make the stroke dashed
            .style('stroke', 'black')
            .style('opacity', d => d.isPlaceholder ? 0.8 : 1)
          // enter animation
            .transition()
            .duration(transitionEnterTime)
            .attr('r', temp.radius)
        }

        , update => {
          update
            .attr('fill', function (d) {
              return d.getColor()
            })
          // if highlighted
            .style('stroke-width', d => {
              if (!d.validInBST) return 5
              if (d.highlighted) return 10
              if (d.isPlaceholder) return 5
              else return 0
            })
          // if placeholder
            .style('stroke-opacity', d => d.isPlaceholder || d.highlighted ? 0.4 : 0)
            .style('stroke-dasharray', d => {
              // if (d.isPlaceholder) return "10,3"
              if (!d.validInBST) return '5,3'
              if (d.highlighted) return '5,3'
              else return '0,0'
            })
            .style('stroke', d => {
              if (!d.validInBST)  return 'red'
              if (d.isPlaceholder) return 'black'
              if (d.highlighted) return 'green'
            })

            .raise()
          // animation
            .attr('r', this.radius)
            .transition()
            .duration(transitionExitTime)
            .attr('r', d => d.highlighted ? this.radius * 1.5 : this.radius)
            .transition()
            .duration(transitionEnterTime)
            .attr('r', this.radius)
        }

        , exit => exit
          .remove()

      )

    this.g
      .selectAll('.circlevalues')
      .data(list, d => d.id)
      .join(
        enter => {
          var cir = enter
          cir
            .append('text')
            .attr('class', 'circlevalues')
            .attr('dy', d => temp.radius / 4)
            .text(d => d.isNumberVisible ? d.value : '')
            .style('text-anchor', 'middle')
            .attr('dx', d => temp.radius / 2.3)
            .style('fill', 'white')
            .attr('pointer-events', 'none')
          // check if number is visible. else hide the number
            .attr('font-size', d => temp.calculateFontSize(d.value))
          // enter animation
            .style('opacity', 0)
            .transition()
            .duration(transitionEnterTime)
            .style('opacity', 1)
        },
        update => {
          update
            .text(d => d.isNumberVisible ? d.value : '')
            .attr('font-size', d => temp.calculateFontSize(d.value))
            .raise()
        }

        , exit => exit.remove()
      )

    this.g
      .selectAll('.circlenames')
      .data(list, d => d.id)
      .join(
        enter => {
          var cir = enter
          cir
            .append('text')
            .attr('class', 'circlenames')
            .attr('dx', function (d) {
              if (d.isPlaceholder) return 0
              else return -40 / 2
            })
            .attr('dy', function (d) {
              if (d.isPlaceholder) return 40 / 8
              else return 40 / 4
            })
            .style('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .attr('font-size', 0)
            .text(d => !d.isPlaceholder ? d.name : 'null')
          // enter animation
            .transition()
            .duration(transitionEnterTime)
            .attr('font-size', 16)
        },
        update => {
          update
            .text(d => !d.isPlaceholder ? d.name : 'null')
            .raise()
        }

        , exit => exit.remove()
      )

    this.g
      .selectAll('.circlearrow')
      .data(list, d => d.id)
      .join(
        enter => {
          var cir = enter
          cir
            .append('line')
            .attr('class', 'circlearrow')
            .attr('x1', this.x)
            .attr('y1', this.y - 150)
            .attr('x2', this.x)
            .attr('y2', this.y - 100)
            .attr('stroke', 'black')
            .attr('stroke-width', 5)
            .attr('opacity', d => d.drawArrowToCircle ? 0.5 : 0)
            .attr('marker-end', 'url(#Triangle)')
        }
        , update => {
          update
            .attr('opacity', d => d.drawArrowToCircle ? 0.5 : 0)
            .raise()
        }
        , exit => exit.remove()
      )

    this.g
      .selectAll('.rootnames')
      .data(list, d => d.id)
      .join(
        enter =>
          enter.append('text')
            .attr('class', 'rootnames')
            .attr('dx', d => 0)
            .attr('dy', d => -40 * 1.1)
            .style('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .attr('font-size', 32)
            .text(d => d.locked_to_tree !== undefined && d.locked_to_tree.root === d ? 'root' : '')
        // enter animation

        , update =>
          update
            .text(d => d.locked_to_tree !== undefined && d.locked_to_tree !== null && d.locked_to_tree.root === d ? 'root' : '')
            .raise()
        , exit => exit.remove()
      )
  }

  mouseover (d, i) {
    if (!circleManager.circles.includes(d3.select(this).datum())) return
    if (!d.isInteractable) {
      const circle = d3.select(this)
      circle.style('cursor', 'not-allowed')
      return
    }
    if (draggedNode) {
      d3.select(this).raise()
      const circle = d3.select(this)
      circle.attr('r', 40)
      return
    }
    const circle = d3.select(this)
    circle.style('cursor', 'pointer')
    circle
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr('r', 40 + 10)
  }

  mouseout (d, i) {
    if (!circleManager.circles.includes(d3.select(this).datum())) return
    if (!d.isInteractable) return
    if (draggedNode) {
      const circle = d3.select(this)
      circle.attr('r', 40)
      return
    }
    const circle = d3.select(this)
    circle
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr('r', 40)
  }
}
