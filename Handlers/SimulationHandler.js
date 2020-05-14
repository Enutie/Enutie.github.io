

var node
var texts
var links
var bstLinks
var arrays
var arrows

export const simulation = d3
  .forceSimulation([])
  .force(
    'charge',
    d3
      .forceManyBody()
      .strength(function (d) {
        // if (d.locked_to_tree) return 0;
       // if (d.isPlaceholder) return 0
        return 40 * -8
      })
      .distanceMin(10)
  )
  .force('x', d3.forceX().x(function (d) {
    if (d.locked_to_tree) {
      if (d.tree_x) {
        return d.tree_x
      }
      if (!d.locked_to_tree.d3tree) return d.cx
      var treeNode = d.locked_to_tree.d3tree.descendants().filter(n => n.data === d)[0]

      if (treeNode) return treeNode.x
    }
    return d.cx
  }).strength(0.15))
  .force("link", d3.forceLink([])
  .id(d => d.id)
  .distance(100)
  .strength(.2))
simulation.force('y', d3.forceY().y(function (d) {
  if (d.locked_to_tree) {
    if (d.tree_y) {
      return d.tree_y
    }
    if (!d.locked_to_tree.d3tree) return d.cy
    var treeNode = d.locked_to_tree.d3tree.descendants().filter(n => n.data === d)[0]
    if (treeNode) return treeNode.y
  }
  return d.cy
}).strength(0.15))
  //.force("link", d3.forceLink([]).distance(200))
  .force(
    'collision',
    d3.forceCollide().radius(function (d) {
      // if (d.isPlaceholder) return 0
      // if (d.noCollision) return 0
      // else 
      return 40
    })
  )
  .alphaTarget(0.5)
  .on('tick', () => CappedFPSTicked(60))

var then = Date.now()

export function CappedFPSTicked (interval) {
  var now = Date.now()
  var elapsed = now - then

  var fpsInterval = 1000 / interval
  if (elapsed > fpsInterval) {
    then = now - (elapsed / fpsInterval)
    ticked()
  }
}

var count = 0
function ticked (e) {
  if (node) {
    node.attr('cx', d => d.x).attr('cy', d => d.y)
  }
  if (texts) {
    texts.attr('x', d => d.x).attr('y', d => d.y)
  }
  if (links) {
    links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
  }
  if (bstLinks) {
    bstLinks
      .attr('x1', d => d.source.data.x)
      .attr('y1', d => d.source.data.y)
      .attr('x2', d => d.target.data.x)
      .attr('y2', d => d.target.data.y)
  }
  if (arrows) {
    arrows
      .attr('x1', d => d.x)
      .attr('y1', d => d.y - 150)
      .attr('x2', d => d.x)
      .attr('y2', d => d.y - 100)
  }
  if (arrays) {
    arrays.attr('x', d => d.x).attr('y', d => d.y)
  }
  // if (count % 90 === 0) {
  //   if (window.camera) {
  //     window.camera.reFocus()
  //   }
  // }
  // count++;
}
export function repaint (forced) {

  window.dataHandler.drawFigures()
  window.buttonHandler.draw()
  window.linkHandler.draw() // must be after dataHandler has drawn
  window.circleManager.draw()

  var svg = d3.select('svg')
  

  svg.lower()

  //if (window.camera) setTimeout(() => window.camera.reFocus(), 50)

  node = svg.selectAll('.circle, .button')
  texts = svg.selectAll('.circlenames, .circlevalues, .rootnames, .textnode, .buttontext, .textarea')
  links = svg.selectAll('.default_link')
  bstLinks = svg.selectAll('.BST_line')
  arrows = svg.selectAll('.circlearrow')
  arrays = svg.selectAll('.array')
}
