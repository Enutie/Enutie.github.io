import { repaint } from '../Handlers/SimulationHandler.js'
import { DataHandler } from '../Handlers/DataHandler.js'
import { getAllNumbersInString, asyncForEach} from '../Utilities/helper_functions.js'
import { CircleQueue } from '../Components/CircleQueue.js'
import { BSTLevelHandler } from '../Handlers/BSTLevelHandler.js'
export var circleContextMenu = function (d) {
  //if (window.levelHandler.noContextMenu) return
  if (d.locked_to_tree) {
    return [
      {
        title: "Set value",
        action: async function (elm, d, i) {
          var number = prompt('Set value to')
    
          var parsed = parseFloat(number)
    
          if (isNaN(parsed)) parsed = 42
          number = parsed
          // var node_to_find = dataHandler.getAllFiguresOfClass("Circle").filter(d => d.value === number)[0]
          elm.value = number;
          elm.highlighted = true
          repaint()
          elm.highlighted = false;
        }
      },
      {
        title: "BST functions",
        children: 
        [
          {
            title: 'Find',
            action: async function (elm, d, i) {
              var bst = elm.locked_to_tree
              var number = prompt('Find which values?')
              
              var numbers = getAllNumbersInString(number)
        
              await asyncForEach(numbers, async (d) => {
                var res = await bst.publicFind(d, bst.root, timeoutTime)
                if (res) res.highlighted = true
                bst.updateLinks()
                repaint()
                if (res)res.highlighted = false
              })        
        
              
            }
          },
          {
            title: 'Insert',
            action: async function (elm, d, i) {
              var bst = elm.locked_to_tree
              var number = prompt('Insert which values?')
              
              if (bst.root.isPlaceholder) var ph_root = bst.root
              if (ph_root) window.circleManager.remove(ph_root)
              var numbers = getAllNumbersInString(number)
              var circles = circleManager.generateNodes(numbers.length, true, true, () => {}, true)

              circles.forEach((d,i) => 
                {
                  d.value = numbers[i]
                  d.isNumberVisible = true; d.isRevealed = true; d.color = 'black'
                } )
              var queue = new CircleQueue(circles, bst)

              await asyncForEach(circles, async (d) => {
                //var nodeToInsert = circleManager.generateNodes(1, true, true, () => {})[0]
                //nodeToInsert.value = d
                var nodeToInsert = d
                if (bst.RedBlackBST) {
                  await bst.publicBalancedInsert(nodeToInsert, bst.root, timeoutTime)
                } else {
                  await bst.publicInsert(nodeToInsert, bst.root, timeoutTime)
                }
                
                nodeToInsert.locked_to_tree = bst
                nodeToInsert.cx = 0; nodeToInsert.cy = 0
                bst.updateLinks()
                repaint()
                queue.pop()
                if (!bst.d3tree.descendants().map(c => c.data).includes(nodeToInsert)) {
                  nodeToInsert.locked_to_tree = undefined;
                }
              })   
            }
          },
          {
            title: 'Delete',
            action: async function (elm, d, i) {
              var bst = elm.locked_to_tree
              var input = prompt('Delete which values?')
        
              var numbers = getAllNumbersInString(input)
              await asyncForEach(numbers, async (number) => {
                console.log(number)
                var res
                res = circleManager.circles.filter(d => d.value === number && d.locked_to_tree === bst)[0]
                
                if (bst.RedBlackBST) await bst.publicBalancedDelete(bst.root, number, timeoutTime)
                else await bst.publicDelete(bst.root, number, timeoutTime)
                if (!res) {
                  return
                }
                res.cx = 0
                res.cy = 0
                console.log(bst)
                console.log(res)
                if (res.locked_to_tree === bst) {
                  console.log("updating tree locked")
                  res.children.filter(d => d.isPlaceholder).forEach(d => { circleManager.remove(d) })
                  res.locked_to_tree = null
                  res.left = null; res.right = null;
                  res.children = undefined
                }
                bst.updateLinks()
                repaint()
              })   
            }
          },
          {
            // divider
            divider: true
          },
        
          {
            // header
            title: 'Reveal all',
            action: (elm, d, i) => {
              var bst = elm.locked_to_tree
              bst.d3tree.descendants().map(d => d.data).forEach(d => {
                d.isNumberVisible = true
                d.isRevealed = true
                d.isInteractable = true
              })
              repaint()
            }
          },
          {
            // normal
            title: 'Hide all',
            action: (elm, d, i) => {
              var bst = elm.locked_to_tree
              bst.d3tree.descendants().map(d => d.data).forEach(d => {
                d.isNumberVisible = false
                d.isRevealed = false
                d.isInteractable = false
              })
              repaint()
            }
          },
          // {
          //   // normal
          //   title: 'Check Validity',
          //   action: (elm, d, i) => {
          //     var bst = elm.locked_to_tree
          //     console.log(bst.isValid())
          //     repaint()
          //   }
          // },
          {
            // header
            title: 'Duplicate',
            action: (elm, d, i) => {
              var bst = elm.locked_to_tree
              bst.duplicate()
              repaint()
            }
          },
        ]
      }
    ]
  } else {
    return [
      {
        title: "Set value",
        action: async function (elm, d, i) {
          var number = prompt('Set value to')
    
          var parsed = parseFloat(number)
    
          if (isNaN(parsed)) parsed = 42
          number = parsed
          // var node_to_find = dataHandler.getAllFiguresOfClass("Circle").filter(d => d.value === number)[0]
          elm.value = number;
          elm.highlighted = true
          repaint()
          elm.highlighted = false;
        }
      },
      {
        title: "Delete",
        action: async function (elm, d, i) {
          circleManager.remove(elm)
          repaint()
        }
      }
    ]
  }
}

