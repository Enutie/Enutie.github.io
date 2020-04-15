var onNodeClicked = function (d, i) {
  if (d.isPlaceholder || !d.isInteractable) return;
  defaultClicked(d, i);
};

var defaultClicked = function (d, i) {
  if (d.isNumberVisible) return;
  if (d.locked_grid)
    dataHandler.addOp({ str: d.locked_grid.toString() + " = " + d.value });
  else if (d.locked_to_tree)
    dataHandler.addOp({ str: "look_up(" + d.name + ") -> " + d.value });
  else dataHandler.addOp({ str: "look_up(" + d.name + ") -> " + d.value });
  d.isNumberVisible = true;
  repaint();
};

class Circle {
  constructor(value, id, x, y) {
    this.value = value;
    this.radius = defaultRadius;
    this.isNumberVisible = false;
    this.isPlaceholder = false;
    this.isSuccessCircle = false;
    this.x = x;
    this.y = y;
    this.cx = x;
    this.cy = y;
    this.ele = null;
    this.z = 0;
    this.locked_to_tree = undefined;
    this.nodeClicked = onNodeClicked;
    this.isInteractable = true;
    this.isRevealed = false;
    this.highlighted = false;
    this.id = id;
    //this.name = id !== undefined ? "n_" + id : "null";
    this.name = id !== undefined ? this.convert(id) : "null";
    this.validInBST = true;
    this.left = null;
    this.right = null;
    this.drawArrowToCircle = false
    this.ele = g
      .append("g")
      .datum(this)
      .attr("class", "node");
    this.current_mouseover = this.mouseover
    this.current_mouseout = this.mouseout
  }
  click(d) {
    d.nodeClicked(d);
  }
  delete() {
    if (this.ele) {
      this.ele.remove();
    }
    else {
      console.log("can't delete")
    }
  }

  convert(num) {
    const result = num
      .toString()
      .split('')
      .map(Number)
      .map(n => (n || 10) + 64)
      .map(c => String.fromCharCode(c))
      .join('');
    return result;
  }

  setTransform(x, y) {
    this.cx = x;
    this.cy = y;
    this.x = x
    this.y = y
    simulation.nodes(
      circle_manager.circles
    );  
  }
  draw() {
    return;
    var temp = this;
    this.delete()
    this.ele = g
      .append("g")
      .datum(this)
      .attr("class", "node");

    if (this.invisible) {
      return;
    }

    if (!this.validInBST) {
      var shadow = this.ele
        .append("circle")
        .attr("class", "circle")
        .attr("r", this.radius * 1.25)
        .attr("x", d => d.cx)
        .attr("y", d => d.cy + 10)
        .attr("fill", function (d) {
          if (d.validInBST) return "green";
          else return "red";
        })
        .attr("filter", "url(#blur)")

      shadow.lower()
    }
    var cir = this.ele
      .append("circle")
      .attr("r", this.radius)
      .attr("x", d => d.cx)
      .attr("y", d => d.cy)
      .attr("class", "circle")
      .attr("fill", function (d) {
        if (temp.isPlaceholder) return "white";
        else if (!temp.isNumberVisible && !temp.isRevealed) return "grey";
        else return scheme(d.value);
      })

      .on("mouseover", this.mouseover)
      .on("mouseout", this.mouseout)
      .on("click", this.click);

    //cir.attr("filter", "url(#blur)")




    // cir.attr("filter", "url(#blur)")


    if (!this.locked_grid || (this.locked_grid && !this.locked_grid.static)) {
      cir.call(
        d3
          .drag()
          .on("drag", dragged)
          .on("end", dragended)
          .on("start", function (d) {
            d.startX = d.x;
            d.startY = d.y;
          })
      );
    }
    if (this.isPlaceholder) {
      cir
        .style("stroke-opacity", 0.4)
        .style("stroke-width", 5)
        .style("stroke-dasharray", "10,3") // make the stroke dashed
        .style("stroke", "black")
        .style("opacity", 0.7)
    }

    if (this.highlighted) {
      cir
        .style("stroke-width", 5)
        .style("stroke-dasharray", "5,3") // make the stroke dashed
        .style("stroke", "pink")
        .attr("fill", function (d) {
          return "orange";
        });
    }

    if (this.isNumberVisible) {
      this.ele
        .append("text")
        .attr("class", "circletext")
        .attr("dx", d => defaultRadius / 2.3)
        .attr("dy", d => defaultRadius / 4)
        .text(function (d) {
          return d.value;
        })
        .style("text-anchor", "middle")
        .style("fill", "white")
        .attr("pointer-events", "none")
        .attr("font-size", defaultRadius / 1.3) //font size
        .attr("font-family", "monaco"); //font size
    }
    this.ele
      .append("text")
      .attr("class", "circletext")
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
      .attr("font-size", function (d) {
        if (d.isPlaceholder) return defaultRadius / 3;
        else return defaultRadius / 1.5;
      }) //font size
      .attr("font-family", "Josefin Sans") //font size
      .append("tspan")
      .attr("dy", ".2cm")
      .text(function (d) {
        return d.name;
      })
      .attr("font-size", 16);

    if (this.locked_to_tree && this.locked_to_tree.root === this) {
      // if this is the root of a tree
      this.ele
        .append("text")
        .attr("class", "circletext")
        .attr("dx", d => 0)
        .attr("dy", d => -defaultRadius * 1.1)
        .text("root")
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("font-size", defaultRadius / 1.5) //font size
        .attr("font-family", "monaco"); //font size

      
      if (this.locked_to_tree.functionsCanBeCalled) this.ele.on('contextmenu', d3.contextMenu(context_menu, () => {
        // here set the title to be Find (x), Insert (x), Delete(x)
      }));
    }
    if (this.drawArrowToCircle) {
      
      var line = this.ele.append("line")
             .attr("class", "arrow")
             .attr("x1",this.x)  
             .attr("y1",this.y - 150)  
             .attr("x2",this.x)  
             .attr("y2",this.y - 100)  
             .attr("stroke","black")  
             .attr("stroke-width",5)  
             .attr("opacity", 0.5)
             .attr("marker-end","url(#Triangle)");  
    }
  }

  mouseover(d, i) {
    console.log(d3.select(this))
    if (!d.isInteractable) {
      const circle = d3.select(d);
      circle.style("cursor", "not-allowed");
      return;
    }
    if (dragged_node) {
      d3.select(d).raise();
      const circle = d3.select(d);
      circle.attr("r", defaultRadius);
      return;
    }
    const circle = d3.select(d);
    circle.style("cursor", "pointer");
    circle
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr("r", defaultRadius + 10);
  }

  mouseout(d, i) {
    if (!d.isInteractable) return;
    if (dragged_node) {
      //d3.select(this).lower();
      const circle = d3.select(d);
      circle.attr("r", defaultRadius);
      return;
    }
    const circle = d3.select(d);
    circle
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr("r", defaultRadius);
  }
}
