import { AudioHandler } from '../Handlers/AudioHandler.js'
import { Camera } from '../Handlers/Camera.js'
import { CircleManager } from '../Handlers/CircleManager.js'
import { DataHandler } from '../Handlers/DataHandler.js'
import { setupKeyEvents } from '../Handlers/EventHandler.js'
import { Menu } from '../Components/Menu.js'
import { Roadmap } from '../Components/Roadmap.js'
import { ScissorTool } from './ScissorTool.js'
import { BSTLevelHandler } from '../Handlers/BSTLevelHandler.js'
import { Albot } from '../Components/Albot.js'
import { LinkManager } from '../Handlers/LinkManager.js'
import { cButtonManager } from '../Handlers/cButtonManager.js'

window.timeoutTime = 300

d3.select('div').style('margin', '-8px -8px -8px -8px')
const svg = d3.select('svg').style('position', 'absolute')

svg
  .append('filter')
  .attr('id', 'blur')
  .append('feGaussianBlur')
  .attr('stdDeviation', 5)

svg.style('background', '#FFFFF0')

console.log(window)
var width = window.innerWidth
var height = window.innerHeight

var windowSize = { width: width, height: height }
window.windowSize = windowSize

svg.attr('width', width).attr('height', height)

setupKeyEvents()

var g = svg.append('g').attr('class', 'everything')
window.g = g

var camera = new Camera(width, height, svg, g)
window.camera = camera

svg.call(camera.zoom)
window.addEventListener('resize', camera.redraw)

const dataHandler = new DataHandler(svg, windowSize, camera)

window.dataHandler = dataHandler
dataHandler.level_state = 0

const audioHandler = new AudioHandler()
window.audioHandler = audioHandler

// setTimeout(() => {
//  dataHandler.createData()
// }, 0)
var circleManager = new CircleManager(g, windowSize)
window.circleManager = circleManager

const linkHandler = new LinkManager();
window.linkHandler = linkHandler

const buttonHandler = new cButtonManager();
window.buttonHandler = buttonHandler


var menu = new Menu(svg, windowSize)
dataHandler.addFigure(menu)

var scissor = new ScissorTool(svg, camera)
window.scissor = scissor
//scissor.disable()

const albot = new Albot(width * 0.0005, height * 0.75)
window.albot = albot


const levelHandler = new BSTLevelHandler(window.circleManager, albot)
window.levelHandler = levelHandler



var map = new Roadmap(windowSize)
window.map = map

levelHandler.createLevel()
