export class cButton {
  constructor (text, x, y, svg, event) {
    this.x = x
    this.y = y
    this.svg = svg
    this.event = event
    this.text = text
    this.visible = true
    this.ele = null
    this.z = 0
    this.playBackgroundMusic = false
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
    }
  }

  draw () {
    return;
    if (this.ele) {
      this.ele.remove()
    }
    if (!this.visible) return
    this.ele = this.svg.append('g').datum(this)
    var temp = this
    this.ele
      .append('circle')
      .attr('r', 60)
      .attr('class', 'button')
      .attr('fill', '	#D3D3D3')
      .on('mouseover', function (d) {
        d3.select(this).style('cursor', 'pointer').transition().attr('fill', '#90ee90')
      })
      .on('mouseout', function (d) {
        d3.select(this).transition().attr('fill', '#D3D3D3')
      })
      .on('click', function (d) {
        d3.select(this).attr("r", 100)
        temp.event()
      })

    this.ele
      .append('text')
      .attr('class', 'buttontext')
      .attr('dx', d => 0)
      .attr('dy', d => 40 / 6)
      .text(function (d) {
        return d.text
      })
      .style('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('font-size', 40 / 1.5) // font size
      .attr('font-family', 'monaco') // font size
  }

  mute () {
    if (this.playBackgroundMusic) {
      this.text = 'unmute'
      audioHandler.toggleBackGroundMusic()
      this.playBackgroundMusic = !this.playBackgroundMusic
      repaint()
    } else {
      this.text = 'mute'
      audioHandler.toggleBackGroundMusic()
      this.playBackgroundMusic = !this.playBackgroundMusic
      repaint()
    }
  }
}
