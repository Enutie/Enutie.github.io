import { timeout } from '../Utilities/helper_functions.js'
import { cButton } from './cButton.js'

export class Albot {
  constructor() {
    this.xPercentage = -20
    this.yPercentage = 40
    this.currentMood = ''
    this.speaking = false
    this.ignoreSayCalls = false
    this.speechWhenClicked =
      [
        'hihih',
        'hihihi',
        'heheh',
        'hahah',
        'hohoh',
        'hih',
        'haha',
        'heheh',
        'stop poking me human'
      ]
  }

  addAlbot(xPercentage, yPercentage) {
    var temp = this
    var d = d3.select('div').append('div')
    this.d = d

    var myimage = d.append('img')
      .attr('src', 'res/images/albot' + this.currentMood + '.svg')
      .attr('class', 'albot')

    var speechbubble = d.append('p')
      .attr('class', 'speech')

    this.speechbubble = speechbubble
    this.h1 = speechbubble.append('h1').attr('class', 'content')

    this.img = myimage

    if (window.levelHandler.currentLevel.onHint) {
      d.append('button')
        .style('position', 'absolute')
        .style('top', '-125px')
        .style('right', '-300px')
        .attr('class', 'button btn-4 btn-4b')
        .text('Hint')
        .style('font-family', 'Walter Turncoat')
        .style('color', 'black')
        .style('font-size', '30px')
        .on('click', function (d) {
          window.audioHandler.play('key7')
          temp.sayFunction(window.levelHandler.currentLevel.onHint)
        })
    }


    myimage.lower()

    this.setPosition(xPercentage, yPercentage)
  }

  setPosition(xPercentage, yPercentage) {
    this.d.style('position', 'absolute')
      .style('left', this.xPercentage + '%')
      .style('bottom', this.yPercentage + '%')

    this.d
      .style('opacity', 1)
      .style('position', 'absolute')
      .transition()
      .duration(1000)
      .style('left', xPercentage + '%')
      .style('bottom', yPercentage + '%')

    this.xPercentage = xPercentage
    this.yPercentage = yPercentage
  }

  delete() {
    this.d.remove()
    if (this.typeit) this.typeit.destroy()
  }

  mood(mood) {
    this.currentMood = mood
  }

  async sayFunction (f) {
    if (this.speaking) return
    var currentLevel = window.levelHandler.currentLevel
    if (currentLevel.onHint) {
      var prev = this.prevText
      await f()
      await this.removeSpeechBubble(3000)
      this.updateSpeechBubbleSize(prev)
      this.h1.text(prev)
      this.speechbubble.transition().duration(200).style('opacity', 0.8)
    }
  }

  async removeSpeechBubble(fadeTime) {
    if (!fadeTime) fadeTime = 0
    this.speechbubble
      .transition()
      .duration(fadeTime)
      .style('opacity', 0)

    await timeout(fadeTime)
  }

  async say(text, xPercentage, yPercentage, ignoreText) {
    if (this.ignoreSayCalls) return
    if (!ignoreText) this.prevText = text
    var speed
    if (this.d) this.d.remove()
    this.addAlbot(xPercentage, yPercentage)
    if (speed === undefined) speed = 40
    if (this.typeit) {
      this.typeit.destroy()
    }
    var temp = this
    var i = 0
    this.speaking = true
    this.updateSpeechBubbleSize(text)

    return new Promise((resolve) => {
      temp.typeit = new TypeIt('.content', {
        beforeStep: async (step, instance) => {
          // temp.typeit.instances[0].opts.style.color = "red"
          // console.log(temp.typeit.instances[0].opts)
          var charInfo = instance.executed[instance.executed.length - 1]
          if (!charInfo) return

          var c = instance.executed[instance.executed.length - 1][1]
          if (c.length !== 1 || !c.toLowerCase().match(/[a-z]/i)) return
          // just added this, to not spam sounds when the dialogue is instant
          c = c.toLowerCase()
          if (speed === 0) {
            if (c.toLowerCase().match(/[a-z]/i) && i % 25 === 0) window.audioHandler.play('alphabet/' + c)
          } else {
            if (c.toLowerCase().match(/[a-z]/i) && i % 4 === 0) {
              window.audioHandler.play('alphabet/' + c)
            }
          }
          i++
        },
        strings: text,
        speed: speed,
        loop: false
      }).exec(() => {
        temp.speaking = false
        setTimeout(resolve, 0)
      }).go()
    })
  }

  async response(level) {
    const positive = ['Awesome!', 'Nice!', 'Very good!']
    const negative = ['Nice try!', 'That was hard!', 'Taxing!']
    const first = ['Lucky!', 'Perfect!', 'Inconceivable!']
    const randomIndex = (Math.floor(Math.random() * 3))
    const optimalTries = this.optimalTriesCalculator(level)
    const operations = dataHandler.operations
    const didWell = operations <= optimalTries
    this.reaction(operations, optimalTries)
    const verb = operations === 1 ? first[randomIndex] : didWell ? positive[randomIndex] : negative[randomIndex]
    await this.say(verb, 0, 0)

    return new Promise((resolve) => setTimeout(resolve, 0))
  }

  optimalTriesCalculator(level) {
    var levelType = level.type.toLowerCase()
    var levelSubtype = level.subtype.toLowerCase()
    var circleCount = window.circleManager.circles.length

    if (levelType === 'circles' || levelType === 'array' || levelType === 'rb_bst') {
      let adder = 0
      if (levelType === 'rb_bst') {
        adder = 1
      }
      return Math.log2(circleCount) + adder
    } else if (levelType === 'bst') {
      if (levelSubtype === 'find') {
        return circleCount + 1
      } else {
        return Number.MAX_VALUE
      }
    }
  }

  reaction(numberOfTries, optimalTries) {
    if (numberOfTries === 1) { this.mood('surprised') } else if (numberOfTries <= optimalTries) { this.mood('happy') } else { this.mood('default') }
  }

  updateSpeechBubbleSize(text) {
    let textLength = 0
    if (Array.isArray(text)) {
      for (let i = 0; i < text.length; i++) {
        textLength += text[i].length
      }
    } else textLength += text.length
    const rows = Math.ceil(textLength / 30)
    let height = 50
    if (rows > 1) { height = rows * 35 }
    this.d.select('.speech')
      .style('width', '300px')
      .style('height', height + 'px')
    this.d.select('.speech:after')
      .style('top', height + 'px')
  }
}
