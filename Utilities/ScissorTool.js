import { lineIntersect } from './helper_functions.js'
import { piyg } from './Colors.js'
export class ScissorTool {
  constructor(svg, camera) {
    this.svg = svg
    this.previous_nodes = []
    // used for creating the path when the user is dragging on the screen
    this.g = svg.select('g')
    this.line = this.g.append('path')
      .attr('d', [])
      // .attr("stroke", piyg(Math.random()))
      .attr('stroke-width', 15)
      // .attr("opacity", lineOpacity)
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
    this.camera = camera
    this.drawing = false
    this.enabled = false
    this.lineOpacity = 0.6
  }

  disable() {
    if (!this.enabled) return
    this.svg.style("cursor", "default")
    this.drawing = false
    var temp = this
    this.path = d3.path()
          temp.line.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0).attr('d', this.path)
            .transition()
            .duration(500)
            .attr('opacity', 0)
  }

  addPoint(x, y) {
    if (!this.enabled) return
    var temp = this;
    temp.line.lower()
    var coords = temp.camera.fromScreenPointToWorldPoint(x, y)

    var x1 = temp.previousLInePos[0]
    var y1 = temp.previousLInePos[1]
    var x2 = coords.x
    var y2 = coords.y

    if (!y2) return

    this.path.lineTo(x2, y2)
    temp.line.attr('d', this.path)
    temp.previousLInePos = [x2, y2]
    // check if the line drawn intersects with existing links.
    d3.selectAll('.BST_line').data().forEach(d => {
      var x3 = d.source.data.x
      var y3 = d.source.data.y

      var x4 = d.target.data.x
      var y4 = d.target.data.y
      if (lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
        var bst = d.source.data.locked_to_tree
        bst.cutLink(d)
      } 
    })
  }

  enable(x, y) {
    if (this.drawing || !this.enabled) return
    this.svg.style("cursor", "cell")
    var temp = this
    this.drawing = true
    this.path = d3.path()
    var coords = temp.camera.fromScreenPointToWorldPoint(x, y)
    temp.previousLInePos = [coords.x, coords.y]
    x = coords.x
    y = coords.y
    if (!y) return
    this.path.moveTo(x, y)

    temp.line.attr('d', this.path)
      .attr('stroke', piyg(Math.random()))
      .transition()
      .duration(10)
      .attr('opacity', this.lineOpacity)
  }

  setupEventsOnDOMElement() {
    if (this.drawing) return
    this.drawing = true
    var temp = this
    var path = d3.path()

    var linePositions = []

  
    var lineOpacity = 1

    var pathPoints = 0
    var sumVelocity = 0 // used to calculate the average velocity of the drag
    var cutVelocityReq = 0 // increase this number to prevent drag that are too slow cutting

    this.svg.call(
      d3
        .drag()
        .on('drag', d => {
          var x = d3.event.x
          var y = d3.event.y
          temp.line.lower()
          var coords = temp.camera.fromScreenPointToWorldPoint(x, y)
          pathPoints++
          var x1 = temp.previousLInePos[0]
          var y1 = temp.previousLInePos[1]
          var x2 = coords.x
          var y2 = coords.y

          if (!y2) return

          path.lineTo(x2, y2)
          temp.line.attr('d', path)
          sumVelocity = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))

          temp.previousLInePos = [x2, y2]
          // check if the line drawn intersects with existing links.
          d3.selectAll('.BST_line').data().forEach(d => {
            var x3 = d.source.data.x
            var y3 = d.source.data.y

            var x4 = d.target.data.x
            var y4 = d.target.data.y
            if (lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
              if (sumVelocity < cutVelocityReq) return
              var bst = d.source.data.locked_to_tree
              bst.cutLink(d)
            }
          })
        })
        .on('end', d => {
          path = d3.path()
          temp.line.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0).attr('d', path)
            .transition()
            .duration(500)
            .attr('opacity', 0)
        })
        .on('start', function (d) {
          path = d3.path()
          var x = d3.event.x
          var y = d3.event.y
          var coords = temp.camera.fromScreenPointToWorldPoint(x, y)
          temp.previousLInePos = [coords.x, coords.y]
          x = coords.x
          y = coords.y
          if (!y) return
          pathPoints++
          path.moveTo(x, y)
          sumVelocity = 0
          linePositions.push({ x: x, y: y })

          temp.line.attr('d', path)
            .attr('stroke', piyg(Math.random()))
            .transition()
            .duration(10)
            .attr('opacity', lineOpacity)
        })
    )
  }
}
