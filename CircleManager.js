class CircleManager {
    constructor(){
        this.circles = [] // list of circle classes
        this.radius = 40
        this.max_id = 0
        this.quadtree = d3.quadtree();
    }

    delete() {
        if (this.ele)  
        {
          this.ele.remove();
          this.ele = null;
        }
    }

    add(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(d => this.circles.push(d))
            this.draw()
        }
        else {
            if (!obj) obj = new Circle(50, this.max_id++, width/2, width/2)
            this.circles.push(obj)
            this.draw()
        }
        this.quadtree = d3.quadtree().x(d => d.x).y(d => d.y).addAll(this.circles)
    }

    remove(obj) {
        var removeObject = (n) => {
            var index = this.circles.indexOf(n)
            if (index !== -1) {
                this.circles.splice(index, 1);
            }
        }
        if (Array.isArray(obj)) {
            obj.forEach(d => removeObject(d))
            this.quadtree.removeAll(obj)
            this.draw()
        } else {
            removeObject(obj)
            this.quadtree.remove(obj)
            this.draw()
        }
        this.quadtree = d3.quadtree().x(d => d.x).y(d => d.y).addAll(this.circles)
    }

    clear() {
       // this.max_id = 0
        this.quadtree.removeAll(this.quadtree.data())
        this.circles = []
        repaint()
    }

    draw(list) {
        

       /*  this.circles.forEach(d => {
            d.isInteractable = true; d.isRevealed = true; d.isNumberVisible = false; //d.isPlaceholder = true;
        }) */
        var transition_enter_time = 500
        var transition_exit_time = 200

        var temp = this;
        if (!list) list = this.circles
        
        simulation.nodes(
            circle_manager.circles
        );

        this.circle_eles = g
        .selectAll(".circle")
        .data(list, d => d.id)
        .join(
            enter => {
                var cir = enter 
                cir
                // all static stuff, not needed to be updated
                .append("circle")
                .attr("r", 0)
                .attr("x", d => d.cx)
                .attr("y", d => d.cy)
                .attr("class", "circle")
                .on("mouseover", this.mouseover)
                .on("mouseout",  this.mouseout)
                .on("click", d => {d.nodeClicked(d)})
                .on('contextmenu', d3.contextMenu(context_menu))
                .call(
                    d3
                      .drag()
                      .on("drag", dragged)
                      .on("end", dragended)
                      .on("start", function (d) {
                        d.startX = d.x;
                        d.startY = d.y;
                      })
                )
                
                // all dynamic stuff, this should be in update as well.
                .attr("fill", function (d) {
                    if (d.isPlaceholder) return "white";
                    else if (!d.isNumberVisible && !d.isRevealed) return "grey";
                    else return scheme(d.value);
                }) 
                .style("stroke-width", d => d.highlighted ? 5 : 0)
                .style("stroke-dasharray", "5,3") // make the stroke dashed
                .style("stroke", "pink")
                .style("stroke-opacity", d => d.isPlaceholder ? 0.4 : 0)
                .style("stroke-width", d => d.isPlaceholder ? 5 : 0)
                .style("stroke-dasharray", d => d.isPlaceholder ? "10,3" : "0,0") // make the stroke dashed
                .style("stroke", "black")
                .style("opacity", d => d.isPlaceholder ? 0.8 : 1)
                //enter animation
                .transition()
                .duration(transition_enter_time)
                .attr("r", temp.radius)
                
                

            }
                
            ,update => {
                update
                .attr("fill", function (d) {
                    if (d.isPlaceholder) return "white";
                    else if (!d.isNumberVisible && !d.isRevealed) return "grey";
                    else return scheme(d.value);
                }) 
                // if highlighted
                .style("stroke-width", d => {
                    if (d.highlighted) return 10
                    if (d.isPlaceholder) return 5
                    else return 0
                })
                // if placeholder
                .style("stroke-opacity", d => d.isPlaceholder || d.highlighted ? 0.4 : 0)
                .style("stroke-dasharray", d => {
                    //if (d.isPlaceholder) return "10,3" 
                    if (d.highlighted) return "5,3" 
                    else return "0,0"
                }) 
                .style("stroke", d => {
                    if (d.isPlaceholder) return "black"
                    if (d.highlighted) return "green"
                })

                .raise()
                //animation
                .attr("r", this.radius)
                .transition()
                .duration(transition_exit_time)
                .attr("r", d => d.highlighted ? this.radius * 1.5 : this.radius)
                .transition()
                .duration(transition_enter_time)
                .attr("r", this.radius)
            }
                
            ,exit => exit.transition()
            .duration(d => d.isPlaceholder ? transition_exit_time : transition_enter_time)
            .attr("r", 0)
            .remove()
                
        )  

        var value_eles = g
        .selectAll(".circlevalues")
        .data(list, d => d.name)
        .join(
            enter => {
                var cir = enter
                cir
                .append("text")
                .attr("class", "circlevalues")
                .attr("dy", d => temp.radius / 4)
                .text(d => d.isNumberVisible ? d.value : "")
                .style("text-anchor", "middle")
                .attr("dx", d => temp.radius / 2.3)
                .style("fill", "white")
                .attr("pointer-events", "none")
                //check if number is visible. else hide the number
                .attr("font-size", d => temp.radius / temp.getLength(d.value)) 
                .attr("font-family", "monaco")
                // enter animation
                .style("opacity", 0)
                .transition()
                .duration(transition_enter_time)
                .style("opacity", 1)

                },
                update => {
                    update
                    .text(d => d.isNumberVisible ? d.value : "")
                    .attr("font-size", d => temp.radius / temp.getLength(d.value))
                    .raise()
                }
                    
                ,exit => exit.remove()
            )  

            var name_eles = g
            .selectAll(".circlenames")
            .data(list, d => d.name)
            .join(
                enter => {
                    var cir = enter
                    cir
                        .append("text")
                        .attr("class", "circlenames")
                        .attr("dx", function (d) {
                            if (d.isPlaceholder) return 0;
                            else return -defaultRadius / 2;
                        })
                        .attr("dy", function (d) {
                            if (d.isPlaceholder) return defaultRadius / 8;
                            else return defaultRadius / 4;
                        })
                        .style("text-anchor", "middle")
                        .attr("pointer-events", "none")
                        .attr("font-size", 0) 
                        .attr("font-family", "Josefin Sans")
                        .text(d => !d.isPlaceholder ? d.name : "null")
                        // enter animation
                        .transition()
                        .duration(transition_enter_time)
                        .attr("font-size", 16)
                    },
                    update => {
                        update
                        .text(d => !d.isPlaceholder ? d.name : "null")
                        .raise()
                    }
                        
                    ,exit => exit.remove()
                )  
    
            var arrow_eles =  g
            .selectAll(".circlearrow")
            .data(list, d => d.name)
            .join(
                enter => {
                    var cir = enter
                    cir
                        .append("line")
                        .attr("class", "circlearrow")
                        .attr("x1",this.x)  
                        .attr("y1",this.y - 150)  
                        .attr("x2",this.x)  
                        .attr("y2",this.y - 100)  
                        .attr("stroke","black")  
                        .attr("stroke-width",5)  
                        .attr("opacity", d => d.drawArrowToCircle ? 0.5 : 0)
                        .attr("marker-end","url(#Triangle)")
                
                    }
                , update => {
                    var cir = update
                    update
                    .attr("opacity", d => d.drawArrowToCircle ? 0.5 : 0)
                    .raise()
                }
        )

        var rootname_eles = g
            .selectAll(".rootnames")
            .data(list, d => d.id)
            .join(
                enter => 
                    enter.append("text")
                    .attr("class", "rootnames")
                    .attr("dx", d => 0)
                    .attr("dy", d => -defaultRadius * 1.1)
                    .style("text-anchor", "middle")
                    .attr("pointer-events", "none")
                    .attr("font-size", 32) 
                    .attr("font-family", "Josefin Sans")
                    .text(d => d.locked_to_tree !== undefined && d.locked_to_tree.root === d ? "root" : "") 
                    // enter animation
                    /* .transition()
                    .duration(timeout)
                    .attr("font-size", 16) */
                    /* .transition()
                    .duration(timeout)
                    .attr("font-size", defaultRadius / 1.5) */

                , update => 
                    update
                    .text(d => d.locked_to_tree !== undefined && d.locked_to_tree !== null && d.locked_to_tree.root === d ? "root" : "") 
                    .raise()
            )

      
     /*  if (this.locked_to_tree.functionsCanBeCalled) this.ele.on('contextmenu', d3.contextMenu(context_menu, () => {
        // here set the title to be Find (x), Insert (x), Delete(x)
      })); */
    }

    getLength(number) {
        if (!number) return 0;
        return number.toString().length;
    }

    mouseover(d, i) {
        if (!circle_manager.circles.includes(d3.select(this).datum())) return;
        if (!d.isInteractable) {
          const circle = d3.select(this);
          circle.style("cursor", "not-allowed");
          return;
        }
        if (dragged_node) {
          d3.select(this).raise();
          const circle = d3.select(this);
          circle.attr("r", defaultRadius);
          return;
        }
        const circle = d3.select(this);
        circle.style("cursor", "pointer");
        circle
          .transition()
          .duration(1000)
          .ease(d3.easeElastic)
          .attr("r", defaultRadius + 10);
      }
    
      mouseout(d, i) {
        if (!circle_manager.circles.includes(d3.select(this).datum())) return;
        if (!d.isInteractable) return;
        if (dragged_node) {
          //d3.select(this).lower();
          const circle = d3.select(this);
          circle.attr("r", defaultRadius);
          return;
        }
        const circle = d3.select(this);
        circle
          .transition()
          .duration(1000)
          .ease(d3.easeElastic)
          .attr("r", defaultRadius);
    }
    
}