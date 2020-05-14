export class Camera {
  constructor (width, height, svg, g) {
    this.cameraTransitioning = false
    this.transitionDurationDefault = 2000
    this.transitionDuration = this.transitionDurationDefault
    this.autoUpdate = true
    this.autoCameraTarget = null
    this.directed_camera = false
    this.width = width
    this.height = height
    this.svg = d3.select("svg")
    this.g = g
    this.zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [this.width, this.height]
      ])
      .scaleExtent([0.3, 3])
      .on('zoom', () => {
       // if (d3.event.sourceEvent) return
        if (event && event.shiftKey) return;
      
        g.attr('transform', d3.event.transform)

        this.previousTransform = d3.event.transform
      })

     this.reset()
  }

  panToDOMElement (ele, margin) {
    this.transitionDuration = this.transitionDurationDefault
    this.cameraTransitioning = true
    var bbox = ele.getBBox()
    var o = this.getCenterAndScaleOfBoundingBox(bbox, margin)
    this.panTo(o.center, o.scale)
  }

  panToD3Node (ele, margin) {
    var DOMElement = d3.selectAll('.circle').nodes().filter(c => d3.select(c).data()[0] === ele)[0]
    this.panToDOMElement(DOMElement, margin)
  }

  panTo (p, scale) {
    if (scale > 3) {
      return // selection of dom elements sometiems returning nothing and therefore its very zoomed into the center. this prevents that
    }
    this.svg
      .transition()
      .duration(this.transitionDuration)
      .call(
        this.zoom.transform,
        d3.zoomIdentity.translate(p[0], p[1]).scale(scale)
      )
  }

  getCenterAndScaleOfBoundingBox (bbox, margin) {
    if (!margin) margin = 100
    margin = 100
    var bounds = [
      [bbox.x - margin, bbox.y - margin],
      [bbox.x + bbox.width + margin, bbox.y + bbox.height + margin]
    ]
    var dx = bounds[1][0] - bounds[0][0]
    var dy = bounds[1][1] - bounds[0][1]
    var x = (bounds[0][0] + bounds[1][0]) / 2
    var y = (bounds[0][1] + bounds[1][1]) / 2
    var scale = 0.9 / Math.max(dx / this.width, dy / this.height)
    return { center: [this.width / 2 - scale * x, this.height / 2 - scale * y], scale: scale }
  }

  SetFocus (list) {
    this.autoCameraTarget = list
    //this.reFocus()
  }

  getBBoxFromList (list) {
    var x1 = list[0].x
    var y1 = list[0].y
    var x2 = list[0].x
    var y2 = list[0].y

      .list.forEach(element => {
        if (element.x < x1) {
          x1 = element.x
        }
        if (element.y < y1) {
          y1 = element.y
        }
        if (element.x > x2) {
          x2 = element.x
        }
        if (element.y > y2) {
          y2 = element.y
        }
      })

    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
  }

  reset () {
    this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(this.width/2, this.height/2).scale(1))
  }

  reFocus () {
    this.panToDOMElement(d3.selectAll('.everything').node())
    return
    if (this.autoCameraTarget) {
      var o = this.getCenterAndScaleOfBoundingBox(this.getBBoxFromList(this.autoCameraTarget), 50)
      this.panTo(o.center, o.scale)
    } else {
      this.panToDOMElement(d3.selectAll('.everything').node())
    }
  }

  redraw () {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.svg.attr('width', this.width).attr('height', this.height - 4)

    if (this.redrawTimeout) {
      window.clearTimeout(this.redrawTimeout)
    }
    this.redrawTimeout = setTimeout(() => {
      repaint()
    }, 1000)
  }

  fromScreenPointToWorldPoint (x, y) {
    function getScreenCoords (x, y, translate, scale) {
      var xn = -translate[0] / scale + x / scale
      var yn = -translate[1] / scale + y / scale
      return { x: xn, y: yn }
    }
    if (this.previousTransform) {
      var coords = getScreenCoords(x, y, [this.previousTransform.x, this.previousTransform.y], this.previousTransform.k)

      return coords
    }
    return { x: x, y: y }
  }

  
}
