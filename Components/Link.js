
export class Link {
  constructor (source, target) {
    this.source = source
    this.target = target
    this.stroke_width = 10
    this.tree = null // used to delete link within tree when
    this.visible = true
    this.isCutable = true
    this.z = -1
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
    }
  }

  draw () {
    if (this.ele) { this.ele.remove() }
    if (!this.visible) return

    this.ele = g.append('g')
    var temp = this // have to do this to access "this" in mouseover

    this.ele
      .append('line')
      .datum(this)
      .attr('stroke', '#999')
      .attr('class', 'default_link')
      .attr('stroke-width', temp.stroke_width)
      .attr('stroke-opacity', 0.6)
      .on('mouseover', function (d) {
        const l = d3.select(this)
        l.attr('stroke-width', temp.stroke_width * 2)
      })
      .on('mouseout', function (d) {
        const l = d3.select(this)
        l.attr('stroke-width', temp.stroke_width)
      })
      .on('click', function (d) {
        if (!this.isCutable) return
        // remove from list of elements drawn
        dataHandler.removeFigure(d)
        // remove from parent trees list of link
        if (temp.tree) temp.tree.removeLink(d)

        temp.delete()

        repaint()
      })
  }
}
