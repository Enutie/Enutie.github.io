class ScissorTool {

    constructor() {

        this.setupEventsOnDOMElement()
    }

    disable() {
        svg.call(
            d3
                .drag()
                .on("drag", () => {})
                .on("end", () => {})
                .on("start", () => {})
        )
    }
    enable() {
        this.setupEventsOnDOMElement()
    }

    setupEventsOnDOMElement() {
      
        var temp = this
        var path = d3.path();

        var line_positions = [];

        var piyg = d3.scaleOrdinal(d3.schemePastel2);
        var line_opacity = 1

        var path_points = 0;
        var sum_velocity = 0;
        var cut_velocity_req = 2
        

        svg.call(
            d3
              .drag()
              .on("drag", d => {
                var x = d3.event.x
                var y = d3.event.y
                
                
                
                line.lower() 
    
    
                var coords = fromScreenPointToWorldPoint(x, y)
                
                
                path_points++
                line.attr("d", path)
                
    
                var x1 = previous_line_position[0]
                var y1 = previous_line_position[1]
    
                var x2 = coords.x
                var y2 = coords.y
                
                path.lineTo(x2, y2);

                sum_velocity = Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));

                previous_line_position = [x2, y2]
    
                //circle_manager.quadtree.find(x, y)

                //console.log(sum_velocity/path_points)
                // check if the line drawn intersects with existing links.
                d3.selectAll(".BST_line").data().forEach(d => {
                  var x3 = d.source.data.x
                  var y3 = d.source.data.y
    
                  var x4 = d.target.data.x
                  var y4 = d.target.data.y
                 
                  //console.log(d.source.data)
                  if (lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4))
                  {
                    if (sum_velocity < cut_velocity_req) return;
                    var bst = d.source.data.locked_to_tree;
                    bst.cutLink(d)
                  }
                }) 
              })
              .on("end", d => {
                line.attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 0)
                .transition()
                    .duration(500)
                    .attr("opacity", 0)
               // console.log(d3.selectAll(".BST_line").data())
                //lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4)
    
              })
              .on("start", function (d) {
                path = d3.path()
                var x = d3.event.x
                var y = d3.event.y
                
                var coords = fromScreenPointToWorldPoint(x, y)
                previous_line_position = [coords.x, coords.y]
                x = coords.x
                y = coords.y
                path_points++
                path.moveTo(x, y)
                sum_velocity = 0
                line_positions.push({x: x, y: y})
    
                line.attr("d", path)
                    .attr("stroke", piyg(Math.random()))
                    .transition()
                    .duration(10)
                    .attr("opacity", line_opacity)
              })
          );
    }

    
}