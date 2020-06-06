import { dragged, dragended, draggedNode } from "../Handlers/EventHandler.js"
import { repaint } from "../Handlers/SimulationHandler.js"
import { arrayContextMenu } from '../Components/ContextMenu.js'
import { getRandomColorScheme } from "../Utilities/Colors.js"

export class cArray {
  constructor (size, descriptor, x, y, g) {
    this.size = size
    this.cell_width = 100
    this.cell_height = 100
    this.array_data = []
    this.x = x - (size * this.cell_width) / 2
    this.y = y - (this.cell_height / 2)
    this.z = -2
    this.color = 'gainsboro'
    this.static = false
    this.makeGrid(this.size)
    this.descriptor = descriptor
    this.name = 'a'
    this.g = d3.select('.everything')
    this.colorScheme = getRandomColorScheme()
  }

  delete () {
    if (this.transform) {
      this.transform.transition().duration(500).style('opacity', 0).remove()
    }
  }

  addDataToArray (circles) {
    circles.forEach((c, i) => this.array_data[i].addCircle(c))
  }

  async addCircleToSortedArray (circle, index) {
    var i = !index ? 0 : index
    var data = this.array_data

    while (i < data.length) {
      // drawing
      circle.cx = data[i].x + this.x + this.cell_width / 2
      circle.cy = data[i].y + this.y - 0
      repaint()
      await new Promise(resolve => setTimeout(resolve, timeoutTime))

      // here chceking if it should be added, or added and move the current one
      if (data[i].locked_node === undefined) {
        data[i].addCircle(circle, true)
        break
      }
      if (circle.value < data[i].locked_node.value) {
        var res = data[i].removeCircle(false)
        data[i].addCircle(circle, true)
        await this.addCircleToSortedArray(res, i)
        break
      }
      i++
    }
  }

  getNextCircleInArray(i) {
    if (i === this.array_data.length) return null;
    if (this.array_data[i].locked_node) return this.array_data[i].locked_node
    else this.getNextCircleInArray(i+1)
  }

  fillArray() {
   var previous; 
    this.array_data.forEach((d, i) => {
      if (!d.locked_node) return;

      var c = window.circleManager.add()
      var next =  this.getNextCircleInArray(i+1)
      if (previous) {
        if (!next) {
          c.value = Math.floor(Math.random()*20) + previous.value
        }else {
          c.value = Math.floor(Math.random(next.value - previous.value))
        }
      }
      d.addCircle(c, false)
      previous = c;
    })
    repaint()
  }

  async publicFindNumber(number) {
    await this.findNumber(number, 0, this.array_data.length)
  }

  async findNumber(number, lower, upper) {
    
    var middle = Math.floor((lower + upper)/2); 
    var c = this.array_data[middle].locked_node
    if (!c) return;
    c.drawArrowToCircle = true
    c.isRevealed = true; c.isNumberVisible = true;
    repaint()
    window.audioHandler.play("key7")
    await new Promise(resolve => setTimeout(resolve, timeoutTime))
    c.drawArrowToCircle = false;
    c.isRevealed = false; c.isNumberVisible = false;
    
    if (c.value === number) {
      c.highlighted = true; c.isRevealed = true; c.isNumberVisible = true;
      repaint()
      await new Promise(resolve => setTimeout(resolve, timeoutTime))
      c.highlighted = false; c.isRevealed = false; c.isNumberVisible = false;
      return true;
    }
    else if (c.value > number) {
      this.findNumber(number, lower, middle-1)
    }
    else if (c.value < number) {
      this.findNumber(number, middle+1, upper)
    }
  
  
  }

  makeGrid (count) {
    var temp = this
    var xpos = (this.cell_width + this.cell_width / 20) * this.array_data.length
    var new_size = this.array_data.length + count
    for (var column = this.array_data.length; column < new_size; column++) {
      this.array_data.push({
        x: xpos,
        y: 0,
        width: this.cell_width,
        height: this.cell_height,
        index: column,
        color: 'gainsboro',
        mouseOver: false,
        static: temp.static,
        parent: temp,
        addCircle (circle, useOp) {
          this.locked_node = circle
          this.hovering_node = circle
          circle.locked_grid = this
          circle.hovering_grid = this
          circle.fx = temp.x + this.x + this.width / 2
          circle.fy = this.height / 2 + temp.y
          if (useOp) dataHandler.addOp({ str: temp.name + '[' + this.index + '] = ' + circle.name })
          repaint()
        },
        removeCircle (useOp) {
          if (!this.locked_node) return
          var c = this.locked_node
          c.locked_grid = undefined
          c.hovering_grid = undefined
          c.fx = undefined
          c.fy = undefined
          this.locked_node = undefined
          this.hovering_node = undefined
          if (useOp) dataHandler.addOp({ str: temp.name + '[' + this.index + '] = ' + 'null' })
          repaint()
          return c
        },
        toString () {
          return temp.name + '[' + this.index + ']'
        }

      })
      // increment the x position. I.e. move it over by 50 (width variable)
      xpos += this.cell_width + this.cell_width / 20 // and a little bit of margin
    }
  }

  setColor (color, index) {
    if (this.ele) {
      this.transform.selectAll('.arraycell').filter(d => d.index === index).style('fill', color)
      this.array_data[index].color = color
    }
  }

  setLength(length) {
    this.size = length

    if (length < this.array_data.length) {
      for (var i = length ; i < this.array_data.length; i++)
      {
        if (!this.array_data[i].locked_node) continue;
        var c = this.array_data[i].locked_node
        c.fx = null; c.fy = null
      }
      this.array_data = this.array_data.splice(0, length)
    }
    else {
      this.makeGrid(length - this.array_data.length) 
    }
    console.log(this.array_data)

  }

  setTransform (x, y) {
    this.x = x
    this.y = y
    this.transform.attr('transform', 'translate(' + (this.x) + ',' + this.y + ')') // set start position
    var temp = this
    this.array_data.filter(d => d.locked_node).forEach(function (d) {
      d.locked_node.fx = temp.x + d.x + d.width / 2
      d.locked_node.fy = d.height / 2 + temp.y
    })
  }

  draw () {
    this.delete()
    this.transform = this.g.append('g')
    var temp = this // need to do this to use "this" in mouseout
    this.array_data.forEach(d => { d.static = temp.static })
    this.transform.datum(this).attr('class', 'array').attr('transform', 'translate(' + (this.x) + ',' + this.y + ')') // set start position

    this.transform.call(d3.drag()
      .on('drag', dragged)
      .on('end', dragended))

    this.transform
      .append('text')
      .attr('class', 'arraytext')
      .attr('dx', (this.size * this.cell_width) / 2)
      .attr('dy', -25)
      .text(this.descriptor)
      .attr('font-size', 30)// font size
      .style('text-anchor', 'middle')
      .attr('pointer-events', 'none')

    var cells = this.transform
      .selectAll('.arraycell')
      .data(this.array_data)
      .join('g')
      .on('contextmenu', d3.contextMenu(arrayContextMenu))

      cells.append('text')
      .attr('class', 'arraytext')
      .attr('dx', function (d) { return d.x + temp.cell_width / 2 })
      .attr('dy', 125)
      .text(function (d, i) { return d.toString() })
      .attr('font-size', 25)// font size
      .style('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      
      var rects = cells.append('rect')
      .attr('class', 'arraycell')
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
      .attr('rx', 25)
      .attr('ry', 25)
      .attr('width', function (d) { return d.width })
      .attr('height', function (d) { return d.height })
      .style('fill', function (d) { return d.color })
      .style('opacity', 0)
      .style('stroke-width', 5)
      .on('mouseover', function (d) {
        d.mouseOver = true
        
        // if dragging node and cell not holding node, then attach it to array cell
        if (!draggedNode) return
        
        draggedNode.hovering_grid = d
        
        d.hovering_node = draggedNode
        draggedNode.fx = temp.x + d.x + d.width / 2
        draggedNode.fy = d.height / 2 + temp.y
        // now check if array is valid and color it accordingly
      })
      .on('mouseout', function (d) {
        d.mouseOver = false
        
        if (!draggedNode) return
        if (d.hovering_node !== d.locked_node) d.hovering_node = d.locked_node
        else d.hovering_node = undefined
        
        draggedNode.hovering_grid = null
      })
      .transition().duration(500).style('opacity', 0.5)
      cells.lower()
    }
  }
