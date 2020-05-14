export class cButtonManager {
  constructor() {
    this.button_id_max = 0
    this.svg = d3.select("svg")
    this.r = 60;
    this.big_r = 80;
  }

  clear() {
    if (this.element) this.element.remove()
    this.element = undefined
  }

  draw() {
    var temp = this
    var buttons = window.dataHandler.getAllFiguresOfClass("cButton")

    if (!this.element) {
      this.element = d3.select("div").append("div")
      .style('position', 'absolute')
      .style('white-space', 'nowrap')
      .style('bottom', "10px")
      .style('left', "50%")
      .style('transform', "translate(-50%, 0)")
    }

    buttons.forEach(d => {
      if (!d.id) {
        d.id = temp.button_id_max++
      }
    })
    


    this.button_elements = 
      this.element
      .selectAll('.button')
      .data(buttons, b => b.id)
      .join(enter =>
        enter
          .append('button')
          .attr('class', 'button btn btn-2 btn-2b')
          .text(d => d.text)
          .on('mouseover', this.mouseover) 
          .on('mouseout', this.mouseout)
          .on('click', function (d) {
            window.audioHandler.play("key7")
            d3.select(this).transition().duration(200).attr("r", temp.big_r).transition().duration(200).attr("r", temp.r)
            d.event()
          })
      , update =>
        update
      , exit =>
        exit.remove()
      )
  }

  mouseover (d) {
    const button = d3.select(this)
    button.style('cursor', 'pointer').attr('fill', '#90ee90')
  }
  mouseout (d) {
    const button = d3.select(this)
    button.attr('fill', '#D3D3D3')
  }
}