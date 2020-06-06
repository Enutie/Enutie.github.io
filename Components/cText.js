export class cText {
  constructor (text, x, y, fontSize, opacity, relativePosition, parent) {
    this.text = text
    this.x = x
    this.y = y
    this.z = 1
    this.fontsize = 18
    this.parent = parent
    if (fontSize) {
      this.fontsize = fontSize
    }
    if (opacity) {
      this.opacity = opacity
    }
    this.relativePosition = relativePosition
    this.svg = d3.select('svg')
    this.g = d3.select('.everything')
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
    }
  }

  draw () {
    if (this.ele) this.ele.remove()

    if (this.parent) {
      this.x = this.parent.x 
      this.y = this.parent.y - 150
    }
    if (this.relativePosition) this.ele = this.g.append('g')
    else this.ele = this.svg.append('g')
    this.text_ele = this.ele
      .append('text')
      .datum(this)
      .attr('class', 'textnode')
      .style('opacity', this.opacity)
      .attr('x', this.x)
      .attr('y', this.y)
      .text(this.text)
    this.text_ele
      .attr('font-size', this.fontsize)// font size
      .attr('dx', -5)// positions text towards the left of the center of the circle
      .attr('dy', 4)
      .style('text-anchor', 'middle')
    this.ele.lower()
  }
  setText (text) {
    this.text_ele.text(text)
  }
}
