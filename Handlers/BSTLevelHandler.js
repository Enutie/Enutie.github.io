import { Level } from '../Components/Level.js'
import { timeout, createRandomPointOnCircumference, asyncForEach } from '../Utilities/helper_functions.js'
import { repaint, simulation } from './SimulationHandler.js'
import { cText } from '../Components/cText.js'
import { cButton } from '../Components/cButton.js'
import { CircleQueue } from '../Components/CircleQueue.js'
import { TextArea } from '../Components/TextArea.js'
import { bgColors } from '../Utilities/Colors.js'

export class BSTLevelHandler {
  constructor(circleManager, albot) {
    const temp = this
    this.skip_introduction = false
    this.albot = albot
    this.readyForNextLevel = false

    let dataHandler = window.dataHandler
    let camera = window.camera

    let svg = d3.select("svg")
    this.svg = svg;
    this.levels = [
      // Level 0 (start screen) // move this out into sceneloader or index.htmml
      new Level(
        "Circles",
        "Start Screen",
        async function () {
          const w = window.windowSize.width
          const h = window.windowSize.height
          const m = 50 // diameter of circle

          temp.readyForNextLevel = true
          var colorArray = [d3.schemeCategory10, d3.schemeAccent]
          var colorScheme = d3.scaleOrdinal(colorArray[0])
          temp.main_menu_circle = svg.selectAll('circle')
            .data(d3.range(10).map(function (i) {
              return {
                x: w * Math.random(),
                y: h * Math.random(),
                dx: Math.random() - 0.5,
                dy: Math.random() - 0.5,
                i: i
              }
            }))
            .enter().append('circle')
            .attr('r', 50)
            .style('text-anchor', 'middle')
            .style('fill', d => colorScheme(d.i))
            .style('opacity', 0.8)
            .attr('pointer-events', 'none')
            .attr('font-size', 40 / 1.3) // font size
            .attr('font-family', 'monaco') // font size
          d3.timer(function () {
            // Update the circle positions.
            temp.main_menu_circle
              .attr('cx', function (d) { d.x += d.dx; if (d.x > w + m) d.x -= w + m * 2; else if (d.x < 0 - m) d.x += w - m * 2; return d.x })
              .attr('cy', function (d) { d.y += d.dy; if (d.y > h + m) d.y -= h + m * 2; else if (d.y < 0 - m) d.y += h - m * 2; return d.y })
          })
          var logo = svg.append('svg:image')

          logo.attr('xlink:href', 'res/images/logo.svg')

            .attr('x', '0%')
            .attr('height', '100%')
            .attr('width', '100%')
            .style('opacity', 0)

          logo.transition().duration(5000).style('opacity', 0.99)
          dataHandler.logo = logo

          const clearMainMenu = () => {temp.main_menu_circle.transition().duration(1000).style('opacity', 0); dataHandler.logo.transition().duration(1000).style('opacity', 0); setTimeout(() => { logo.remove(); temp.main_menu_circle.remove() }, 1000);}
          const storyModeButton = new cButton('Storymode', w / 3, h * 0.66, svg, () => { clearMainMenu(); temp.nextLevel() })
          dataHandler.addFigure(storyModeButton)
          const SandboxButton = new cButton('Sandbox', w *2 / 3, h * 0.66, svg, () => { clearMainMenu(); temp.goToLevel(temp.levels[temp.levels.length - 1]) })
          dataHandler.addFigure(SandboxButton)
          repaint()
        },
        // Success criteria
        n => true,
        // on Success
        async function () {
          await albot.say('A circle reveals its value when you click on it.', 0, 0)
        }
      ),
      // Level 1
        new Level(
          "Circles",
          "Intro",
          async function () {
            let albot_speed = (temp.skip_introduction ? 0 : undefined)
            circleManager.generateNodes(5, true, false, temp.isLevelComplete.bind(temp))
            repaint()
            await albot.say(
              [
                'Hi! My name is Albot. Let us explore some data structures together!',
                'The circles you see are nodes.',
                'Each node contains a value.'
              ], 40, 40, albot_speed)
            if (!temp.skip_introduction) await timeout(1000)
            albot.say('Try and click on a circle!', 0, 0)
            await timeout(500)
            
          },
          // Success criteria
          n => true,
          // on Success
          async function () {
            await albot.say('A circle reveals its value when you click on it.', 0, 0)
          }
        ),
      //Level 2
      new Level(
        "Circles",
        "Find",
        async function () {
          await albot.say(
            ['Each node has a key and a value. You can look up the value by clicking on the node.'], 40, 40)
          circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          temp.successCircle = circleManager.getRandomCircle()
          repaint()
          if (!temp.skip_introduction) await timeout(1000)
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)
          
        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say('Let us try again with another value.', 0, 0)
        }
      ),
      //Level 3
      new Level(
        "Circles",
        "Find",
        async function () {
          circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          temp.successCircle = circleManager.getRandomCircle()
          console.log(temp.successCircle)
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)
          repaint()
          await timeout(500)
          
        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say('There must be a way to organize the nodes that allows us to find values faster.', 0, 0)
        }
      ),
      //Level 4
      new Level(
        "array",
        "Find",
        async function () {
          await albot.say(
            ['Let us arrange the nodes in an array!'], 40, 40)

          if (!temp.skip_introduction) await timeout(1000)
          var circles = circleManager.generateNodes(5, true, false, temp.isLevelComplete.bind(temp))
          temp.successCircle = circleManager.getRandomCircle()
          var array = dataHandler.makeArray(circles.length, "Unsorted array")
          array.static = true

          dataHandler.addFigure(array)
          
          array.addDataToArray(circles)
          
          repaint()
          await timeout(500)
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)
          

        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say('Let us try again with another node.', 0, 0)
        }
      ),
      //Level 5
      new Level(
        "array",
        "Find",
        async function () {
          var circles = circleManager.generateNodes(8, true, false, temp.isLevelComplete.bind(temp))
          temp.successCircle = circleManager.getRandomCircle()
          var array = dataHandler.makeArray(circles.length, "Unsorted array")
          array.static = true
          
          dataHandler.addFigure(array)
          
          array.addDataToArray(circles)
          
          repaint()
          await timeout(500)
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)
          
        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say(['This is similar to before, when the circles were not organized at all...','I think we should organize the nodes INSIDE the array.'], 0, 0)
        }
      ),
      // Level 6 sorted arrays
      new Level(
        "array",
        "Find",
        async function () {
          await albot.say(
            ['Now the array is sorted. Maybe this helps?'], 40, 40)
          if (!temp.skip_introduction) await timeout(1000)
          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circles.sort((a, b) => a.value - b.value)
          
          temp.successCircle = circleManager.getRandomCircle()
          var array = dataHandler.makeArray(circles.length, "Sorted array")
          array.static = true
          
          
          dataHandler.addFigure(array)
          
          array.addDataToArray(circles)
          
          repaint()
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)
          
        },
        // Success criteria
        (n) => {
          console.log(temp.successCircle.value)
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say('Let us try with more nodes', 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['The fastest reliable way to do this, is with binary search', 'To find X, do this:', 'First check the middle elements value', 'If X is smaller, then go to the middle of the LEFT SIDE', 'If X is larger, then go to the middle of the RIGHT SIDE', 'Do this, untill you hit the element. If you can\'t go further, then the element is not in the array'], 0, 0)
        }
      ),
      // Level 7
      new Level(
        "array",
        "Find",
        async function () {

          var circles = circleManager.generateNodes(15, true, false, temp.isLevelComplete.bind(temp))
          circles.sort((a, b) => a.value - b.value)

          temp.successCircle = circleManager.getRandomCircle()
          var array = dataHandler.makeArray(circles.length, "Sorted array")
          array.static = true
          var temp1 = temp

          dataHandler.addFigure(array)

          array.addDataToArray(circles)
          await timeout(500) 
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)

          repaint()
          
        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say('Let us try with a lot more nodes!', 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['The fastest reliable way to do this, is with binary search', 'To find X, do this:', 'First check the middle elements value', 'If X is smaller, then go to the middle of the LEFT SIDE', 'If X is larger, then go to the middle of the RIGHT SIDE', 'Do this, untill you hit the element. If you can\'t go further, then the element is not in the array'], 0, 0)
        }
      ),
      // Level 8
      new Level(
        "array",
        "Find",
        async function () {
          //await albot.say(['It seems like there is a trick to this, each node on the left side of a given node, has a smaller value', 'And all the nodes on the right side of it, has a larger value!'], 40, 40)

          //if (!temp.skip_introduction) await timeout(1000)

          var circles = circleManager.generateNodes(20, true, false, temp.isLevelComplete.bind(temp))
          circles.sort((a, b) => a.value - b.value)

          temp.successCircle = circleManager.getRandomCircle()
          var array = dataHandler.makeArray(circles.length, "Sorted array")
          array.static = true

          dataHandler.addFigure(array)

          array.addDataToArray(circles)

          repaint()

          await timeout(500) 
          
          albot.say('Try to find ' + temp.successCircle.value, 0, 0)

        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say(['Could this be the perfect way of storing nodes?','There must be some catch.'], 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['The fastest reliable way to do this, is with binary search', 'To find X, do this:', 'First check the middle elements value', 'If X is smaller, then go to the middle of the LEFT SIDE', 'If X is larger, then go to the middle of the RIGHT SIDE', 'Do this, untill you hit the element. If you can\'t go further, then the element is not in the array'], 0, 0)
        }
      ),
      // Level 9
      new Level(
        "array",
        "Demo",
        async function () {
          albot.currentMood = "default" //"nocomment"
          await albot.say(['Ah, yes...',
            'With the sorted array, I can find elements very fast. But INSERTING new elements can be very slow!', 'Look at this:'], 40, 40)
          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circles.sort((a, b) => a.value - b.value)
          
          var input_circles = circleManager.generateNodes(5, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()
          
          var queue = new CircleQueue(input_circles, circles[0])
          // var i = circles.indexOf(input_circle)
          // circles.splice(i, 1)

          var array = dataHandler.makeArray(circles.length + input_circles.length, "Sorted array")
          array.static = true
          array.addDataToArray(circles)
          dataHandler.addFigure(array)
          
          albot.setPosition(0, 0)

          var closure = async (arr) => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(input_circles, async function (d) {
              await arr.addCircleToSortedArray(d)
              queue.pop()
              repaint()
            })
            temp.isLevelComplete(circles[0])
          }
          await closure(array)

          temp.currentLevel.successCriteria = () => true
          temp.isLevelComplete()
        },
        // Success criteria
        (n) => {
          return false;
        },
        // on Success
        async function () {
          await albot.say('Let us try with a different data structure.', 0, 0)
        }
      ),
      // Level 10
      new Level(
        "bst",
        "Sandbox",
        async function () {
          await albot.say(['This is a binary tree.', 'It is similar to a sorted array: Going left means going to smaller values. Going right means going to larger values.', 'When accessing nodes, you have to start from the root. Nodes only know their children and their parent', 'Right-click the root to test the functionalities!'], 40, 40)
          var circles = circleManager.generateNodes(15, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()
          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          albot.setPosition(0, 0)

          dataHandler.addFigure(bst)

          bst.useOp = false
          bst.isInteractable = true
          bst.isLectureMode = true
          var queue = new CircleQueue(circles, bestRoot)

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
              
              bst.updateLinks()
              repaint()
            })
          }
          await closure()
          

          await albot.say(['Right-click on the root to experiment with inserting, deleting, and finding values.'], 0, 0)


          temp.currentLevel.successCriteria = () => true
          temp.isLevelComplete()
          //if (!temp.skip_introduction) await timeout(1500)
        },
        // Success criteria
        (n) => {
          return false
        },
        // on Success
        async function () {
          await albot.say("If you right-click the root of the tree, you can experiment with inserting, deleting, and finding values.", 0, 0)
        }
      ),
      // Level 11
      new Level(
        "bst",
        "Find",
        async function () {
          await albot.say(['When searching for values, you always start at the root.', 'Then you compare the value of the current node with value you search for.', 'If the value at the current node is larger, then go left, else go right!'], 40, 40)

          var circles = circleManager.generateNodes(15, true, false, temp.isLevelComplete.bind(temp))

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.linksCutable = false
          bst.isInteractable = false
          bst.isLectureMode = true
          bst.allowAddingChildToPlaceholder = false

          var queue = new CircleQueue(circles, bestRoot)
          temp.successCircle = circleManager.getRandomCircle(bst)

          this._timeoutTime = timeoutTime
          timeoutTime = 0

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
              bst.updateLinks()
              repaint()
              
            })
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClick(d.data)
            })
            bst.updateOnClick(bst.root)
            bst.root.nodeClicked(bst.root)

            if (!temp.skip_introduction) await timeout(1500)
            albot.say(['If you are unsure how to do this, press ESC and try the BST sandbox.', 'Try to find ' + temp.successCircle.value], 0, 0)
            


          }
          closure()

        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say(['Nice job, my humanoid friend!', 'Let us try with a larger tree'], 0, 0)
        }
      ),
      // Level 12
      new Level(
        "bst",
        "Find",
        async function () {
          var circles = circleManager.generateNodes(25, true, false, temp.isLevelComplete.bind(temp))

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.linksCutable = false
          bst.isInteractable = false
          bst.isLectureMode = true
          bst.allowAddingChildToPlaceholder = false

          var queue = new CircleQueue(circles, bestRoot)
          temp.successCircle = circleManager.getRandomCircle(bst)

          this._timeoutTime = timeoutTime
          timeoutTime = 0

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClick(d.data)
            })
            bst.updateOnClick(bst.root)
            bst.root.nodeClicked(bst.root)
            await timeout(500)
            


          }
          closure()
          if (!temp.skip_introduction) await timeout(1500)
          albot.say(['Try to find ' + temp.successCircle.value], 0, 0)

        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say(["Wow, you are getting good at this!, 'Some day you humans are going to catch up to us computers!"], 0, 0)
        }
      ),
      // Level 13
      new Level(
        "bst",
        "Find",
        async function () {
          var circles = circleManager.generateNodes(35, true, false, temp.isLevelComplete.bind(temp))

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.linksCutable = false
          bst.isInteractable = false
          bst.isLectureMode = true
          bst.allowAddingChildToPlaceholder = false

          var queue = new CircleQueue(circles, bestRoot)
          temp.successCircle = circleManager.getRandomCircle(bst)

          this._timeoutTime = timeoutTime
          timeoutTime = 0

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClick(d.data)
            })
            bst.updateOnClick(bst.root)
            bst.root.nodeClicked(bst.root)
            await timeout(500)
            


          }
          closure()
          if (!temp.skip_introduction) await timeout(1500)
          albot.say(['Try to find ' + temp.successCircle.value], 0, 0)

        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say('Let us find out how to insert nodes in a Binary Search Tree.', 0, 0)
        }
      ),
      // Level 14
      new Level(
        "bst",
        "Insert",
        async function () {
          await albot.say(['We have to figure out the correct location for the new node.'], 40, 40)

          var circles = circleManager.generateNodes(20, true, false, temp.isLevelComplete.bind(temp))


          var input_circle = circleManager.getRandomCircle()
          var i = circles.indexOf(input_circle)
          circles.splice(i, 1)



          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.linksCutable = true
          bst.isInteractable = false
          bst.isLectureMode = true
          bst.nodeToInsert = input_circle
          bst.nodeToInsert.isRevealed = true
          bst.nodeToInsert.isNumberVisible = true
          temp.bst = bst

          var queue = new CircleQueue(circles, bestRoot)
          temp.successCircle = input_circle

          this._timeoutTime = timeoutTime
          timeoutTime = 0

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClickForInsertion(d.data)
            })
            bst.updateOnClickForInsertion(bst.root)
            bst.root.nodeClicked(bst.root)
            await timeout(500)
            


          }
          closure()
          if (!temp.skip_introduction) await timeout(1500)
          albot.say(['If you are unsure how to do this, press ESC and try the BST sandbox.', 'Try to insert ' + temp.successCircle.value], 0, 0)

        },
        // Success criteria
        (n) => {
          return temp.bst.nodeToInsert.locked_to_tree && temp.bst.isValid()
        },
        // on Success
        async function () {
          await albot.say('Let us try again with another node.', 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say('When inserting nodes, you have to find the correct place, and when you hit a NULL pointer, then insert the node there.', 0, 0)
        }
      ),
      // Level 15
      new Level(
        "bst",
        "Insert",
        async function () {
         
          //await albot.say(['When inserting into a BST, you search for the right place for the new node.', 'That is done in the same way as when you try to find a value.', 'But instead if you need go to a node that is null, then you place the new node there.'], 40, 40, albot_speed)

          var circles = circleManager.generateNodes(25, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()

          var input_circle = circleManager.getRandomCircle()
          var i = circles.indexOf(input_circle)
          circles.splice(i, 1) 


          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.linksCutable = true
          bst.isInteractable = false
          bst.isLectureMode = true
          bst.nodeToInsert = input_circle
          bst.nodeToInsert.isRevealed = true
          bst.nodeToInsert.isNumberVisible = true
          temp.bst = bst

          var queue = new CircleQueue(circles, bestRoot)
          temp.successCircle = input_circle

          this._timeoutTime = timeoutTime
          timeoutTime = 0

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClickForInsertion(d.data)
            })
            bst.updateOnClickForInsertion(bst.root)
            bst.root.nodeClicked(bst.root)
            await timeout(500)
            


          }
          closure()
          if (!temp.skip_introduction) await timeout(1500)
          albot.say(['Try to insert ' + temp.successCircle.value], 0, 0)

        },
        // Success criteria
        (n) => {
          return temp.bst.nodeToInsert.locked_to_tree && temp.bst.isValid()
        },
        // on Success
        async function () {
          await albot.say('Let us try again with another node.', 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say('When inserting nodes, you have to find the correct place, and when you hit a NULL pointer, then insert the node there.', 0, 0)
        }
      ),
      // Level 16
      new Level(
        "bst",
        "Delete",
        async function () {
          let albot_speed = (temp.skip_introduction ? 0 : undefined)
          await albot.say(['You can use the scissor tool by holding SHIFT and moving your mouse around', 'This will cut any links it comes into contact with!', 'Press hint if you want an explanation on how to delete elements.'], 40, 40, albot_speed)

          var circles = circleManager.generateNodes(20, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()

          var delete_circle = circleManager.getRandomCircle()

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.allowAddingChildToPlaceholder = true
          bst.linksCutable = true
          bst.isLectureMode = true
          bst.nodeToInsert = delete_circle
          bst.nodeToInsert.isRevealed = true
          bst.nodeToInsert.isNumberVisible = true
          temp.bst = bst
          temp.successCircle = delete_circle

          var queue = new CircleQueue(circles, bestRoot)
          this._timeoutTime = timeoutTime
          timeoutTime = 0

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClick(d.data)
            })
            bst.updateOnClick(bst.root)
            bst.root.nodeClicked(bst.root)
            await timeout(500)
            


          }
          closure()
          if (!temp.skip_introduction) await timeout(1500)
          albot.say(['Try to delete ' + temp.successCircle.value], 0, 0)

        },
        // Success criteria
        (n) => {
          console.log(temp.bst.nodeToInsert)
          return temp.bst.nodeToInsert.locked_to_tree !== temp.bst &&
            !d3
              .selectAll('.circle')
              .data()
              .filter(d => {
                return !d.isPlaceholder && d !== temp.bst.nodeToInsert
              })
              .some(c => c.locked_to_tree !== temp.bst) &&
            temp.bst.isValid()
        },
        // on Success
        async function () {
          albot.say(['Nice! Now we have all the functions needed for a BST!', "This is awesome!"], 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['When deleting, navigate to the node you want to delete (X).',  'Find X\'s smallest value in it\'s RIGHT subtree. If the right subtree is null, then use the left child instead', 'That will change places with X and get its left and right child', 'Then delete X from the tree.'], 0, 0)
        },
      ),
      // Level 17
      new Level(
        "bst",
        "Coding",
        async function () {
          let albot_speed = (temp.skip_introduction ? 0 : undefined)
          await albot.say(['I tried writing some code for inserting nodes into BSTs, but it seems I made a mistake!', 'The highlighted line seems fishy.', 'Could you fix my code?'], 40, 40, albot_speed)

          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()

          var delete_circle = circleManager.getRandomCircle()

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.allowAddingChildToPlaceholder = true
          bst.linksCutable = true
          bst.isLectureMode = true
          bst.nodeToInsert = delete_circle
          bst.nodeToInsert.isRevealed = true
          bst.nodeToInsert.isNumberVisible = true
          temp.bst = bst

          var queue = new CircleQueue(circles, bestRoot)

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.insertWithCustomCode(d, bst.root)
              d.cx = 0
              d.cy = 0
              queue.pop()
              circleManager.cleanupBSTNodes()
              bst.updateLinks()
              repaint()
              
            })

            bst.useOp = true
            await timeout(500)
            
            temp.isLevelComplete(bst.root)
            
          }
          closure()
          albot.say(['Good luck, friend!'], 0, 0)
          albot.removeSpeechBubble(1000)
          window.albot.ignoreSayCalls = false

        },
        // Success criteria
        (n) => {
          return temp.bst && temp.bst.isValid() && circleManager.circles.every(c => c.locked_to_tree === temp.bst)
        },
        // on Success
        async function () {
          await albot.say(['Yes, you did it!', 'Now it looks like a proper BST'], 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['Each node has two properties, left and right. They are pointers to other nodes or NULL', ' ', 'Left should point to a node with a smaller value, and right should point to a node with a larger value', ' ', 'In the code, the variable "node" is the new node, and "h" is the navigation node.',  'Check if the comparisons are correct'], 0, 0)
        },
        async function () {
          var code =
            [
              { text: 'insert (node, h) {', editable: false },
              { text: '    if (h === null) ', editable: false },
              { text: '    {', editable: false },
              { text: '        return node;', editable: false },
              { text: '    }', editable: false },
              { text: '', editable: false },
              { text: '    if      (node.value > h.value) {', editable: true },
              { text: '        h.left = insert(node, h.left);', editable: false },
              { text: '    }', editable: false },
              { text: '    else if (node.value < h.value) {', editable: true },
              { text: '        h.right = insert(node, h.right);', editable: false },
              { text: '    }', editable: false },
              { text: '    else {', editable: false },
              { text: '        h.value = node.value;', editable: false },
              { text: '    }', editable: false },
              { text: '', editable: false },
              { text: '    return h;', editable: false },
              { text: '}', editable: false }
            ]

          var textField = new TextArea(code)
          dataHandler.addFigure(textField)
          textField.draw()
        }
      ),
      // Level 18
      new Level(
        "bst",
        "Coding",
        async function () {
          let albot_speed = (temp.skip_introduction ? 0 : undefined)
          await albot.say(['Looks like I made an error at a different place now!', 'Edit the highlighted lines and press the button to rebuild the tree.'], 40, 40, albot_speed)

          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()

          var delete_circle = circleManager.getRandomCircle()

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.allowAddingChildToPlaceholder = true
          bst.linksCutable = true
          bst.isLectureMode = true
          bst.nodeToInsert = delete_circle
          bst.nodeToInsert.isRevealed = true
          bst.nodeToInsert.isNumberVisible = true
          temp.bst = bst


          var queue = new CircleQueue(circles, bestRoot)

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.insertWithCustomCode(d, bst.root)
              d.cx = 0
              d.cy = 0
              queue.pop()
              circleManager.cleanupBSTNodes()
              bst.updateLinks()
              repaint()
              
            })

            bst.useOp = true
            await timeout(500)
            
            temp.isLevelComplete(bst.root)


          }
          closure()

          albot.say(['Good luck, friend!'], 0, 0)
          albot.removeSpeechBubble(1000)
          window.albot.ignoreSayCalls = false
        },
        // Success criteria
        (n) => {
          return temp.bst && temp.bst.isValid() && circleManager.circles.every(c => c.locked_to_tree === temp.bst)
        },
        // on Success
        async function () {
          await albot.say(['Uuh! You are on a roll!', 'The world will bow down to human and computer, best friends forever!'], 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['Each node has two properties, left and right. They are pointers to other nodes or NULL', ' ', 'Left should point to a node with a smaller value, and right should point to a node with a larger value', ' ', 'In the code, the variable "node" is the new node, and "h" is the navigation node.', 'Check if the proper children are used for navigating the tree'], 0, 0)
        },
        async function () {
          var code =
            [
              { text: 'insert (node, h) {', editable: false },
              { text: '    if (h === null) ', editable: false },
              { text: '    {', editable: false },
              { text: '        return node;', editable: false },
              { text: '    }', editable: false },
              { text: '', editable: false },
              { text: '    if      (node.value < h.value) {', editable: false },
              { text: '        h.right = insert(node, h.right);', editable: true },
              { text: '    }', editable: false },
              { text: '    else if (node.value > h.value) {', editable: false },
              { text: '        h.left = insert(node, h.left);', editable: true },
              { text: '    }', editable: false },
              { text: '    else {', editable: false },
              { text: '        h.value = node.value;', editable: false },
              { text: '    }', editable: false },
              { text: '', editable: false },
              { text: '    return h;', editable: false },
              { text: '}', editable: false }
            ]

          var textField = new TextArea(code)
          dataHandler.addFigure(textField)
          textField.draw()
        }
      ),
      // Level 19
      new Level(
        "bst",
        "Coding",
        async function () {
          let albot_speed = (temp.skip_introduction ? 0 : undefined)
          await albot.say(['...', 'Okay, wow. I accidentally deleted all my insert code...', 'Can you help me and write new code?'], 40, 40, albot_speed)

          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()

          var delete_circle = circleManager.getRandomCircle()

          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.allowAddingChildToPlaceholder = true
          bst.linksCutable = true
          bst.isLectureMode = true
          bst.nodeToInsert = delete_circle
          bst.nodeToInsert.isRevealed = true
          bst.nodeToInsert.isNumberVisible = true
          temp.bst = bst


          var queue = new CircleQueue(circles, bestRoot)

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.insertWithCustomCode(d, bst.root)
              d.cx = 0
              d.cy = 0
              queue.pop()
              circleManager.cleanupBSTNodes()
              bst.updateLinks()
              repaint()
              
            })

            bst.useOp = true
            await timeout(500)
            
            temp.isLevelComplete(bst.root)


          }
          closure()

          albot.say(['This is a difficult assignment.', 'If you need inspiration, you can revisit the two previous levels.', 'Try to write code for inserting nodes into a BST.'], 0, 0)
          window.albot.ignoreSayCalls = false
        },
        // Success criteria
        (n) => {
          return temp.bst && temp.bst.isValid() && circleManager.circles.every(c => c.locked_to_tree === temp.bst)
        },
        // on Success
        async function () {
          await albot.say(['Wow, thanks...', 'Good job!'], 0, 0)
        },
        // on Hint
        async function () { 
          await albot.say(['When inserting, you either:', 'go left', 'go right', 'hit the existing value', 'hit a NULL pointer and place the node there.', 'Make sure the code handles all those scenarios' ,' ', 'All the code for this is in the two previous levels.'], 0, 0)
        },
        async function () {
          var code =
            [
              { text: 'insert (node, h) {', editable: false },
              { text: '    return h', editable: true },
              { text: '}', editable: false }
            ]

          var textField = new TextArea(code)
          dataHandler.addFigure(textField)
          textField.draw()
        }
      ),
      // BST Demo showing sorted list of inputs
      new Level(
        "bst",
        "Demo",
        async function () {
          await albot.say(['Oh my processor...', "Looks like even BSTs can't solve all our problems", 'Check out what happens for sorted inputs.', 'This BST is unbalanced, so it performs badly.'], 40, 40)

          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circles.sort((a, b) => a.value - b.value)
          circleManager.showAll()


          var bst = dataHandler.makeBST(circles[0])
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.linksCutable = false
          bst.isInteractable = false
          bst.isLectureMode = true
          temp.bst = bst

          var queue = new CircleQueue(circles, bst.root)

          await timeout(500)

          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
              bst.updateLinks()
              repaint()
              
            })
            bst.useOp = true
            temp.currentLevel.successCriteria = () => true
            temp.isLevelComplete()
          }
          closure()
          albot.say(['Look! The tree is very tall.', 'Finding 10 will go through ALL the other nodes'], 0, 0)
          
        },
        // Success criteria
        (n) => {
          return false
        },
        // on Success
        async function () {
          await albot.say('Can we make sure that the BST has good performance, even for sorted inputs?', 0, 0)
        }
      ),
      // RB BST Demo showing sorted list of inputs
      new Level(
        "rb_bst",
        "Demo",
        async function () {
          await albot.say(['This is how we solve the problem:', 'We use a Red Black Binary Search Tree. This will balance the tree!'], 40, 40)

          var circles = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circles.sort((a, b) => a.value - b.value)
          circleManager.showAll()


          var bst = dataHandler.makeBST(circles[0])
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.RedBlackBST = true
          bst.linksCutable = false
          bst.isInteractable = false
          bst.isLectureMode = true
          bst.x = 0
          bst.y = 0
          
               
          var circles2 = circleManager.generateNodes(10, true, false, temp.isLevelComplete.bind(temp))
          circles2.sort((a, b) => a.value - b.value)
          circleManager.showAll()

          var bst2 = dataHandler.makeBST(circles2[0])
          dataHandler.addFigure(bst2)
          bst2.useOp = false
          bst2.linksCutable = false
          bst2.isInteractable = false
          bst2.isLectureMode = true

          bst2.x = 1000
          bst2.y = 0
          //dataHandler.addFigure(new cText("Binary Search Tree", 1000, -150, 40, 1, true, bst2))
          var queue = new CircleQueue(circles, bst.root)
          var queue2 = new CircleQueue(circles2, bst2.root)
          repaint()

          await albot.say(['Look how a big a difference it makes on the same input.'], 0, 0)
         
          asyncForEach(circles, async function (d, i) {
            await bst.publicBalancedInsert(d, bst.root, 0)
            queue.parent = bst.root
            queue.pop()

            bst.updateLinks()
            repaint()
    
          })
          await asyncForEach(circles, async function (d, i) {
            await bst2.publicInsert(circles2[i], bst2.root, 0)
            queue2.parent = bst2.root
            queue2.pop()
            bst2.updateLinks()
            repaint()
            
          })
          temp.currentLevel.successCriteria = () => true
          temp.isLevelComplete()
          
        },
        // Success criteria
        (n) => {
          return false
        },
        // on Success
        async function () {
          await albot.say(['Let me show you how it works.'], 0, 0)
        }
      ),
      // RB_BST presentation
      new Level(
        "rb_bst",
        "Demo",
        async function () {
          // await albot.say(["In a Red Black Binary Search Tree, each node is either red or black", "This is represented by the color of the link pointing to the node.", "..."], 40, 40)

          // var circles = circleManager.generateNodes(5, true, false, temp.isLevelComplete.bind(temp))
          // circleManager.showAll()

          // var bestRoot = circleManager.getMedian()
          // var bst = dataHandler.makeBST(bestRoot)
          // dataHandler.addFigure(bst)
          // bst.RedBlackBST = true
          // temp.bst = bst

          // simulation.alphaTarget(0.15)
          // var queue = new CircleQueue(circles, bestRoot)
          // temp.successCircle = circleManager.circles

          // //await timeout(1500)
          // await asyncForEach(circles, async function (d) {
          //   await bst.publicBalancedInsert(d, bst.root, 0)
          //   queue.pop()
          //   
          //   bst.updateLinks()
          //   repaint()
          // })
          // await albot.say(['When a node is inserted, its color is red.', 'The tree maintains balance by applying rules depending on the colors of adjacent nodes.'], 0, 0)

          // await timeout(1000)

          // 

          // dataHandler.removeFigure(bst)
          // window.linkHandler.clear()
          // circleManager.clear()
          // repaint()

          var circles = circleManager.generateNodes(3, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()
          circles.sort((a, b) => a.value - b.value)
          var bst = dataHandler.makeBST(circles[1])
          bst.x = 0
          bst.y = 0
          bst.text.opacity = 0
          await bst.publicBalancedInsert(circles[0], bst.root, 0)
          bst.updateLinks()
          repaint()
          var queue = new CircleQueue(circles, bst.root)
          dataHandler.addFigure(bst)
          bst.RedBlackBST = true
          bst.hack_for_demonstration = true
          await albot.say(['There are 3 different scenarios for balance rules:', 'Scenario 1: Inserting a larger value in a subtree:', 'If a node got two red children, then change their color to black'], 0, 0)
          var text = new cText("1st scenario: Inserting a larger value in a subtree", 0, -150, 40, 1, true)
          dataHandler.addFigure(text)     
          this._timeoutTime = timeoutTime
          timeoutTime = 2000
          //bst.duplicateEachStep = true;
          await asyncForEach(circles, async function (d, i) {
            await bst.publicBalancedInsert(d, bst.root, 0)
            queue.pop()
            bst.updateLinks()
            repaint()
            
          })
          // var text = new cText("Insert", 250, 0, 40, 1, true)
          // dataHandler.addFigure(text)
          // var text = new cText("FlipColors", 750, 0, 40, 1, true)
          // dataHandler.addFigure(text)          
          repaint()
          timeoutTime = this._timeoutTime

          var circles = circleManager.generateNodes(3, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()
          circles.sort((a, b) => a.value - b.value)
          circles = circles.reverse()
          var bst = dataHandler.makeBST(circles[0])
          bst.text.opacity = 0
          bst.RedBlackBST = true
          dataHandler.addFigure(bst)
          bst.x = 0
          bst.y = 500
          await bst.publicBalancedInsert(circles[1], bst.root, 0)
          var queue = new CircleQueue([circles[2]], bst.root)
          bst.hack_for_demonstration = true
          bst.updateLinks()
          repaint()
          var text = new cText("2nd scenario: Inserting a smaller value in a subtree", 0, 400, 40, 1, true)
          dataHandler.addFigure(text)          
          this._timeoutTime = timeoutTime
          timeoutTime = 2000
          await albot.say(['Scenario 2: Inserting a smaller value in a subtree:', 'If a node has two red lines going left, then rotate right, and balance afterwards'], 0, 0)
          //bst.duplicateEachStep = true;
          await asyncForEach(circles, async function (d) {
            await bst.publicBalancedInsert(d, bst.root, 0)
            queue.pop()
            bst.updateLinks()
            repaint()
            
          })
          // dataHandler.addFigure(new cText("Insert", 250, 550, 40, 1, true))
          // dataHandler.addFigure(new cText("RotateRight", 750, 550, 40, 1, true))
          // dataHandler.addFigure(new cText("FlipColors", 1250, 550, 40, 1, true))
          repaint()
          timeoutTime = this._timeoutTime

          var circles = circleManager.generateNodes(3, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()
          circles.sort((a, b) => a.value - b.value)
          var bst = dataHandler.makeBST(circles[2])
          bst.RedBlackBST = true
          dataHandler.addFigure(bst)
          bst.text.opacity = 0
          bst.x = 0
          bst.y = 1000
          await bst.publicBalancedInsert(circles[0], bst.root, 0)
          var queue = new CircleQueue([circles[1]], bst.root)
          bst.hack_for_demonstration = true
          bst.updateLinks()
          var text = new cText("3rd scenario: Inserting a value in betweeen a subtree", 0, 900, 40, 1, true)
          text.absolutePosition = false
          dataHandler.addFigure(text)     
          repaint()
          await albot.say(['Scenario 3: Inserting a value in between a subtree:', 'If a node has two red lines going left, then rotate right, and balance afterwards'], 0, 0)
          this._timeoutTime = timeoutTime
          timeoutTime = 2000
          //bst.duplicateEachStep = true;
          await asyncForEach(circles, async function (d) {
            await bst.publicBalancedInsert(d, bst.root, 0)
            queue.pop()
            bst.updateLinks()
            repaint()
            
          })

          // dataHandler.addFigure(new cText("Insert", 250, 1050, 40, 1, true))
          // dataHandler.addFigure(new cText("RotateLeft", 750, 1050, 40, 1, true))
          // dataHandler.addFigure(new cText("RotateRight", 1250, 1050, 40, 1, true))
          // dataHandler.addFigure(new cText("FlipColors", 1750, 1050, 40, 1, true))
          repaint()

          timeoutTime = this._timeoutTime

          await albot.say(['Now you see that all the BSTs are identical, even though the input order was different each time!', 'When it works with the smaller ones, it also works with the larger ones!'], 0, 0)
          
          await timeout(500)
          temp.currentLevel.successCriteria = () => true
          temp.isLevelComplete()
        },
        // Success criteria
        (n) => {
          return false;
        },
        // on Success
        async function () {
         // await albot.say('Let us try again with another node.', 0, 0)
        }
      ),
      // Level 20
      new Level(
        "rb_bst",
        "Find",
        async function () {
          await albot.say(['Finding nodes in a RB-BST works just like in a regular BST!", "Left means smaller values, right means bigger values'], 40, 40)

          var circles = circleManager.generateNodes(15, true, false, temp.isLevelComplete.bind(temp))

          var find_circle = circleManager.getRandomCircle()

          temp.successCircle = find_circle
          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.RedBlackBST = true
          bst.allowAddingChildToPlaceholder = true
          bst.linksCutable = true
          bst.isLectureMode = true
          temp.bst = bst

          var queue = new CircleQueue(circles, bestRoot)

        
          temp.successCircle = circleManager.getRandomCircle()

          this._timeoutTime = timeoutTime
          timeoutTime = 0
          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicBalancedInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.parent = bst.root
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClick(d.data)
            })
            bst.updateOnClick(bst.root)
            bst.root.nodeClicked(bst.root)
            timeoutTime = this._timeoutTime

          }
          closure()

          albot.say(['Try to find ' + temp.successCircle.value], 0, 0)
        },
        // Success criteria
        (n) => {
          return n.value === this.successCircle.value;
        },
        // on Success
        async function () {
          await albot.say('Let us try again with another node.', 0, 0)
        }
      ),
      // Level 21
      new Level(
        "rb_bst",
        "Find",
        async function () {
         //await albot.say(['Using find in a RB-BST is identical to doing it in a regular BST!", "Left is smaller values, right is bigger values'], 40, 40, albot_speed)

          var circles = circleManager.generateNodes(25, true, false, temp.isLevelComplete.bind(temp))
          circleManager.showAll()

          temp.successCircle = circleManager.getRandomCircle()


          var bestRoot = circleManager.getMedian()
          var bst = dataHandler.makeBST(bestRoot)
          dataHandler.addFigure(bst)
          bst.useOp = false
          bst.RedBlackBST = true
          bst.allowAddingChildToPlaceholder = true
          bst.linksCutable = true
          bst.isLectureMode = true
          temp.bst = bst

          var queue = new CircleQueue(circles, bestRoot)
          this._timeoutTime = timeoutTime
          timeoutTime = 0
          var closure = async () => {
            // creating closure so i can do stuff after elements has been inserted.
            await asyncForEach(circles, async function (d) {
              await bst.publicBalancedInsert(d, bst.root, 0)
              d.cx = 0
              d.cy = 0
              queue.pop()
            })
            bst.updateLinks()
            repaint()
            bst.useOp = true
            timeoutTime = this._timeoutTime
            bst.d3tree.descendants().forEach(d => {
              bst.updateOnClick(d.data)
            })
            bst.updateOnClick(bst.root)
            bst.root.nodeClicked(bst.root)

            albot.say('Try to find ' + temp.successCircle.value, 0, 0)

          }
          closure()

          
        },
        // Success criteria
        (n) => {
          return n.value === temp.successCircle.value
        },
        // on Success
        async function () {
          await albot.say(['Congratulations! You have cleared the story mode!', 'I hope you learned something useful!', 'You can revisit all levels by clicking ESC, or try out the sandbox mode!'], 0, 0)
        }
      ),
      // SANDBOX (should be last level for main menu button to work)
      new Level(
        "Sandbox",
        "Sandbox",
        async function () {
          var w = window.windowSize.width
          var h = window.windowSize.height
          const circleButton = new cButton('Circle', w * 0.4, h * 0.9, svg, () => {  var circles = circleManager.generateNodes(1, true, false, temp.isLevelComplete.bind(temp), true); circles.forEach(d => {d.value = Math.floor(Math.random()*100); d.isNumberVisible = true; d.isRevealed = true}); repaint() })
          dataHandler.addFigure(circleButton)
          
          const arrayButton = new cButton('Array', w * 0.6, h * 0.9, svg, () => { var arr = dataHandler.makeArray(10, "Array"); dataHandler.addFigure(arr); repaint();  })
          dataHandler.addFigure(arrayButton)

          const BSTButton = new cButton('BST', w * 0.8, h * 0.9, svg, () => { var bst = dataHandler.makeBST(null); dataHandler.addFigure(bst); repaint() })
          dataHandler.addFigure(BSTButton)

          const RBBSTButton = new cButton('RB-BST', 80, 85, svg, () => { var bst = dataHandler.makeRedBlackBST(null); dataHandler.addFigure(bst); repaint() })
          dataHandler.addFigure(RBBSTButton)

          const ClearButton = new cButton('Clear screen', 80, 85, svg, () => { dataHandler.clearScene(); this.createLevel(); })
          dataHandler.addFigure(ClearButton)

          repaint()

          await timeout(500)
          
          await albot.say(["This is the sandbox level. Here you can do whatever you want and explore the functionality of the program.", "Can't wait to see what you create!"], 0, 0)
        
          albot.removeSpeechBubble(1000)
        },
        // Success criteria
        (n) => {
          return false
        },
        // on Success
        async function () {
          await albot.say('Let us try again with another node.', 0, 0)
        }
      ),
    ]

    this.currentLevel = this.levels[0]
  }

  async createLevel() {
    // check if scissortool should be enabled
    window.dataHandler.clearScene()
    if (this.levels.indexOf(this.currentLevel) > 9) window.scissor.enabled = true
    window.albot.ignoreSayCalls = false
    this.svg.transition().duration(500).style('background', bgColors[Math.floor(Math.random() * bgColors.length)])
    this.readyForNextLevel = false
    simulation.alphaTarget(0.5)
    this.transitioning = false
    await this.currentLevel.create()
    window.camera.reFocus()
  }

  isLevelComplete(n) {
    console.log(this.transitioning)
    if (this.transitioning) return;
    if (n) n.onNodeClicked(n)
    if (n && !n.locked_grid) {n.fx = undefined; n.fy = undefined;}
    const complete = this.currentLevel.isComplete(n)
    if (complete) {
      this.currentLevel.complete = true
      this.getReadyForNextLevel(n)
    }
  }

  async getReadyForNextLevel(n) {
    var temp = this
    this.transitioning = true
    this.createSuccessAnimation(n)
    if (n) await this.albot.response(this.currentLevel)
    await timeout(1000)
    this.readyForNextLevel = true
    var text = new cText('Press space to continue...', window.windowSize.width / 2, window.windowSize.height * 0.95, 30, 0.5)
    window.dataHandler.addFigure(text)
    text.draw()
    text.text_ele.on('click', () => temp.nextLevel())
    await this.currentLevel.onSuccess()


  }

  nextLevel() {
    if (this.readyForNextLevel) {

      this.readyForNextLevel = false; this.skip_introduction = false;

      this.currentLevel = this.levels[this.levels.indexOf(this.currentLevel) + 1]
      this.createLevel()
      
    }
  }

  goToLevel(level) {
    this.readyForNextLevel = false;
    this.currentLevel = level;

    this.createLevel()
  }

  restartLevel() {
    if (this.skip_introduction) return
    this.skip_introduction = true

    this.createLevel()
  }

  createSuccessAnimation(n) {
    
    const temp = this
    var dataHandler = window.dataHandler
    //if (n) 
    audioHandler.play('levelComplete')

    d3.selectAll('circle').filter(function (c) {
      return c === n
    })
    circleManager.circles
      .filter(d => !d.isPlaceholder)
      .forEach(d => {
        d.isRevealed = true
        d.isNumberVisible = true
      })

    if (n) n.highlighted = true
    repaint()
    const array = dataHandler.getAllFiguresOfClass('cArray')

    if (array && array.length > 0) {
      array.forEach(d => d.array_data.forEach(c => c.removeCircle()))
      repaint()
    }

    if (n) n.highlighted = false

    
    // do not skip to new Level automatically, instead offer user to click enter to go to next level, or click restart

    var width = window.windowSize.width
    var height = window.windowSize.height
    // makes circle bounce around for certain time, or untill next level has been loaded
    var recBounce = (timeout, count, n) => {
      if (n && count < 5) {

        var point = createRandomPointOnCircumference([0, 0], 500 - count * (400 / 10))
        n.cx = point[0]
        n.cy = point[1]
        simulation.alphaTarget(0.2)
        simulation.nodes(circleManager.circles)
        setTimeout(() => {
          count += 1
          recBounce(timeout + timeout / 5, count, n)
        }, timeout)
      }
    }
    recBounce(200, 1, n)
  }
}
