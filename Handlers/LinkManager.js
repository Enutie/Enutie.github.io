import { simulation } from "../Handlers/SimulationHandler.js"
export class LinkManager {
  constructor() {
    this.link_id_max = 0
    this.g = window.g
    this.previous_links = []
  }

  clear() {
    if (this.element) this.element.remove()
    this.element = undefined
  }

  draw() {
    var temp = this
    var bsts = window.dataHandler.getAllFiguresOfClass("BST")
    var links = bsts.reduce((acc, bst) => acc.concat(bst.links), [])
    
    if (!this.element) {
      this.element = this.g.append('g')
    }

    

    links.forEach(d => {
      d.from = d.source.data.id
      d.to = d.target.data.id
      var match = temp.previous_links.filter(prev => prev.from === d.from && prev.to === d.to)[0]
      if (match) {
        d.id = match.id
      }
      else {
        d.id = temp.link_id_max++;
      }
    })
    this.previous_links = links;


    // links where fields are fitted tow what the d3.forceLink wants.
    var temp_links = []
    links.forEach((d, i) => 
      temp_links.push({source: d.from, target: d.to, target_data: d.target.data, source_data: d.source.data , id: d.id})
    )

    simulation.force("link").links(temp_links);
    

    
    this.link_elements = 
      this.element
      .selectAll('.BST_line')
      .data(links, l => (l.from, l.to))
      .join(enter =>
        enter
          .append('line')
          .attr('class', 'BST_line')
          .attr('stroke', d => {
            if (!d.target.data.locked_to_tree || !d.target.data.locked_to_tree.RedBlackBST) return '#999'
            else if (!d.target.data.color) return 'black';
            else return d.target.data.color
          })
          .attr('stroke-width', 10)

          .attr('stroke-opacity', 0.6)
          .on('mouseover', function (d) {
            if (!temp.linksCutable || d.target.data.isPlaceholder) return
            d3.select(this)
          })
          .on('mouseout', function (d) {
            if (!temp.linksCutable || d.target.data.isPlaceholder) return
            d3.select(this)
          })
          .on('click', function (d) {
            temp.cutLink(d)
          })
      , update =>
        update.attr('stroke', d => {
          if (!d.target.data.locked_to_tree) return '#999'
          if (!d.target.data.locked_to_tree.RedBlackBST) return '#999'
          if (!d.target.data.color) return 'black'
          else return d.target.data.color;
        })
      , exit =>
        exit.remove()
      )
  }
}