export class Roadmap {
  constructor (windowSize) {
    this.visible = false
    this.levelHandler = window.levelHandler

    this.image_width = 100
    this.image_height = 100
    this.margin = 25
    this.columns = 5
    this.opacity = 0.7
    this.windowSize = windowSize
    this.svg = d3.select('svg')

    this.x = windowSize.width / 2 - (this.columns * (this.image_width + this.margin)) / 2
    this.y = windowSize.height / 2 - (this.columns * (this.image_height)) / 2
  }

  delete () {
    if (this.ele) {
      this.ele.remove()
      if (this.range) this.range.remove()
      if (this.achievement_div) this.achievement_div.remove()
      if (this.showing_achievements_button) this.showing_achievements_button.remove()
    }
  }

  switch () {
    if (dataHandler.logo) dataHandler.logo.remove()
    this.visible = !this.visible
    this.draw()
  }

  draw () {
    var width = this.windowSize.width
    var height = this.windowSize.height
    var data = this.levelHandler.levels.concat()
    this.x = width / 2 - (this.columns * (this.image_width + this.margin)) / 2
    this.delete()
    var temp = this
    this.ele = this.svg.append('g')
    data.splice(0, 1)
    data.forEach((d, i) => {
      d.id = i
    })
    
    if (this.visible) {
        this.ele.append('rect')
          .attr('x', this.x - 50)
          .attr('y', this.y - 50)
          .style('fill', 'white')
          .style('stroke-width', 3)
          .style('stroke', 'black')

          .attr('width', (temp.columns - 1) * (temp.image_width + temp.margin) + 200)
          .attr('height', (temp.columns) * (temp.image_width + temp.margin) + 50)

        this.ele.append('text')
          .style('opacity', this.opacity)
          .text('Menu')
          .attr('x', this.x + (temp.columns - 1) * (temp.image_width + temp.margin) / 2)
          .attr('y', this.y - 10)
          .attr('font-size', 30)

        this.squares = this.ele.selectAll('.level_image')
          .data(data, d => d.id)
          .join(
            enter => enter.append('rect')
              .attr('class', 'level_image')

              .attr('x', function (d) { return (d.id % temp.columns) * (temp.image_width + temp.margin) + temp.x })
              .attr('y', function (d) { return parseInt(d.id / temp.columns) * (temp.image_width + temp.margin) + temp.y })
              .attr('width', function (d) { return temp.image_width })
              .attr('height', function (d) { return temp.image_height })
              .style('stroke-width', (d) => {
                if (d === temp.levelHandler.currentLevel) {
                  return 5
                } else {
                  return 0
                }
              })
              .style('stroke', 'gold')
              .style('fill', function (d) {
                if (d.completed) {
                  return 'lightgreen'
                } else {
                  return 'lightgrey'
                }
              })
            // .style("opacity", 0.4)
              .on('click', (d, i) => {
                this.svg.selectAll('circle').remove()
                temp.levelHandler.goToLevel(d)
                temp.visible = false
                temp.draw()
              })

          )
        this.ele.selectAll('.type')
          .data(data, d => d.id)
          .join(
            enter => enter.append('text')
              .attr('class', 'type')
              .style('fill', 'white')
              .attr('pointer-events', 'none')
              .attr('x', function (d) { return (d.id % temp.columns) * (temp.image_width + temp.margin) + temp.x + temp.image_width / 24 })
              .attr('y', function (d) { return parseInt(d.id / temp.columns) * (temp.image_width + temp.margin) + temp.y + temp.image_height / 4 })
              .text((d) => d.type.toUpperCase())
              .attr('font-size', 20)
          )

        this.ele.selectAll('.level_type')
          .data(data, d => d.id)
          .join(
            enter => enter.append('text')
              .attr('class', 'level_type')
              .attr('pointer-events', 'none')
              .attr('x', function (d) { return (d.id % temp.columns) * (temp.image_width + temp.margin) + temp.x + temp.image_width / 16 })
              .attr('y', function (d) { return parseInt(d.id / temp.columns) * (temp.image_width + temp.margin) + temp.y + temp.image_height / 2 })
              .text((d) => d.subtype)
              .attr('font-size', 18)
          )

        // range animation time
        this.range = d3.select('div').append('div')
          .style('position', 'absolute')
          .style('width', '20%')
          .style('left', '40%')
          .style('top', '5%')

        var rangeText = this.range
          .append('text')
          .text('Animation speed: ' + window.timeoutTime + ' ms')
          .style('text-align', 'justify')

        this.range
          .append('input')
          .attr('type', 'range')
          .attr('min', 60)
          .attr('max', 3000)
          .attr('value', window.timeoutTime)

          .attr('step', '10')
          .attr('id', 'hey')
          .on('input', function input () {
            window.timeoutTime = this.value
            rangeText.text('Animation speed: ' + window.timeoutTime + ' ms')
          })

       
    }
  }

  mouseover (d, i) {
    const achievement = d3.select(this)
    var i = map.new_achievements.indexOf(d)
    if (i !== -1) map.new_achievements.splice(i, 1)
    achievement
      .style('background-color', 'black')
      .text(d => d.pre_text + d.description)
  }

  mouseout (d, i) {
    var rand = Math.floor(Math.random() * 13 + 1)
    audioHandler.play('key' + rand)
    const achievement = d3.select(this)
    achievement
      .style('background-color', 'grey')
      .text(d => d.pre_text)
  }

  mouseclick (d, i) {
  }
}
