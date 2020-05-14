export class Logger {
  constructor (x, y, svg) {
    this.op_list = [{ str: 'No action performed yet...', isPlaceholder: true }]
    this.x = x
    this.y = y
    this.text_height = 20
    this.font_size = 20
    this.row_count = 9
    this.extended_row_count = 20
    this.extended_rows = false
    this.timeWhenLastOp = Date.now()
    this.currentCombo = []
    this.COMBO_TIMEOUT = 3000
    this.svg = d3.select('svg')
    this.draw()
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
    }
  }

  addOp (op) {
    if (this.op_list.filter(d => d.isPlaceholder).length > 0) this.op_list = []
    op.id = Date.now()
    this.op_list.push(op)

    // add to combo
    var timeNow = Date.now()
    var deltaTime = timeNow - this.timeWhenLastOp

    if (deltaTime < this.COMBO_TIMEOUT) {
      this.currentCombo.push(op)
    } else {
      this.currentCombo = [op]
    }
    this.timeWhenLastOp = timeNow

    // Play dramatic sound
    this.draw()
  }

  clear () {
    this.op_list = []
    this.draw()
  }

  draw () {
    var temp = this
    var shorterList = this.op_list
    var count = this.extended_rows ? this.extended_row_count : this.row_count
    if (this.op_list.length > count) shorterList = this.op_list.slice(this.op_list.length - count, this.op_list.length)
    shorterList.forEach((d, i) => {
      d.x = temp.x * 2.1
      d.y = temp.text_height * i + temp.y + 20
    })

    var t = 500

    if (!this.ele) { this.ele = this.svg.append('g') }

    this.ele
      .selectAll('.textline')
      .data(shorterList, d => d.id)
      .join(
        enter => enter.append('text')
          .attr('fill', 'green')
          .attr('class', 'textline')
          .attr('font-size', temp.font_size)// font size
          .attr('font-style', function (d) {
            if (d.isPlaceholder) return 'italic'
            else return 'default'
          })
          .attr('x', (d, i) => -100)
          .attr('y', d => d.y)
          .text(d => d.str)
          .call(enter => enter.transition(t)
            .attr('x', (d, i) => d.x)),
        update => update
          .attr('fill', 'black')
          .call(update => update.transition(t)
            .attr('x', (d, i) => temp.x)
            .attr('y', d => d.y)),
        exit => exit
          .attr('fill', 'brown')
          .call(exit => exit.transition(t)
            .attr('y', -50)
            .remove())
      )
    this.ele.on('click', () => {
      temp.extended_rows = !temp.extended_rows
      //temp.draw()
    })
  }

  comboTextSize (d, enlarged) {
    var extra = 0
    if (enlarged) extra = 1

    if (d.count > 256) return this.font_size * 8.00 + extra
    if (d.count > 128) return this.font_size * 7.25 + extra
    if (d.count > 64) return this.font_size * 6.50 + extra
    if (d.count > 32) return this.font_size * 5.75 + extra
    if (d.count > 16) return this.font_size * 5.00 + extra
    if (d.count > 8) return this.font_size * 4.25 + extra
    if (d.count > 4) return this.font_size * 3.50 + extra
    if (d.count > 2) return this.font_size * 2.75 + extra
    else return this.font_size * 2.00 + extra
  }
}
