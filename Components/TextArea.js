import { Logger } from './Logger.js'
import { Albot } from './Albot.js'

export class TextArea { // should be called codearea instead probably
  constructor (code) {
    code.forEach((d, i) => { d.id = i })
    this.text_areas = code
    this.placeHolderText = 'Enter code here...'
    this.z = 500
    
  }

  delete () {
    if (this.ele) {
      this.text = this.getText()
      this.ele.remove()
    }
  }

  getText () {
    d3.selectAll('.editable').nodes().forEach(d => { d3.select(d).datum().text = d.innerText })
    var text = this.text_areas.reduce((str, element) => { return str + element.text + '\n' }, '')
    return text
  }

  getCode () {
    return this.convertInputToCode(this.getText())
  }

  convertInputToCode (str) {
    str = str.replace(/insert/g, 'await insert_custom')

    var lines = str.split('\n')
    lines.splice(0, 1)
    str = lines.join('\n')
    var all =
          'var temp = this\n' +
          'var insert_custom = async function(node, h, callback) {\n' +
          'if (temp.deleted) return \n' +
          'if (temp.useOp && h !==null) dataHandler.addOp({ str: "insert("+ h.name + ", " + node.value + ")" }) \n' +
          'await temp.animate(true, h, timeoutTime);\n' +
          str +
          '\n' +
          'var foo = async () => { temp.root =  await insert_custom(node, root) \n return temp.root }\n' +
          'foo()'
    return all
  };

  clickedExecuteCode () {
    var userCode = this.getText()
    this.convertInputToCode(userCode)
    //dataHandler.clearScene()
    //const level = dataHandler.level_data.data[dataHandler.level_state]

    var bsts = dataHandler.getAllFiguresOfClass("BST")
    bsts.forEach(d => { dataHandler.removeFigure(d); d.delete() })
    window.circleManager.clear()
    window.linkHandler.clear()
    window.albot.ignoreSayCalls = true
    window.levelHandler.currentLevel.create(false)
    //window.albot.ignoreSayCalls = false
  };

  draw () {
    if (!this.ele) {
      this.ele = d3.select('div')
        .append('pre')
        .attr('class', 'textarea')
        .datum(this)
        .style('position', 'absolute')
        .style('left', '80%')
        .style('top', '18%')
    }
    var temp = this

    if (this.textarea) this.textarea.remove()

    this.textarea = this.ele
      .selectAll('.textarea')
      .data(this.text_areas, d => d.id)
      .join(
        enter => enter.append('code')
          .style('background-color', d => {
            if (d.editable) { return 'pink' } else { return 'rgba(250, 250, 250, 0.5)' }
          })
          .attr('contenteditable', d => d.editable)
          .attr('innerText', function (d) {
            this.innerText = d.text
          }))
          // .on("input", () => {
          //   // d3.selectAll('pre code').nodes().forEach(element => {
          //   //   hljs.highlightBlock(element)
          //   // })

          // })
      .attr('class', d => {
        if (d.editable) {
          return 'editable'
        } else {
          return 'uneditable'
        }
      })

   
    if (this.button) this.button.remove()
    this.button = this.ele.append('button')
    .style('text-align', 'center')
    
      .attr('class', 'button btn btn-2 btn-2b')
      .style("font-size", "16px")
      .text('Run code')
      .attr('content', 'Execute')
      .on('click', () => temp.clickedExecuteCode())

    d3.selectAll('pre code').nodes().forEach(element => {
      hljs.highlightBlock(element)
    })
     if (this.tooltip) this.tooltip.remove()
    this.tooltip = this.ele
      .append("div")
      .text("Run code will call insert(x, root),\nwhere x is [1..10]")
  }
}
