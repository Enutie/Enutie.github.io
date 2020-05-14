
const BLANK = -1;
const EMPTY = 0;
const SORTED = 1;
const NOT_SORTED = 2;

class cArray {
    constructor(size, descriptor, x, y){
      this.size = size
      this.cell_width = 100;
      this.cell_height = 100;
      this.array_data = []
      this.x = x - (size * this.cell_width) / 2
      this.y = y - (this.cell_height / 2)
      this.z = -2
      this.color = "gainsboro"
      this.static = false;
      this.makeGrid()
      this.descriptor = descriptor
      this.name = "a"
    }
  
    delete() {
      if (this.ele)  
      {
        this.transform.transition().duration(500).style("opacity", 0).remove();
        this.ele.transition().duration(500).style("opacity", 0).remove();
        
      }
    }

    addDataToArray(circles) {
      circles.forEach((c,i) => this.array_data[i].addCircle(c));
    }

    async addCircleToSortedArray(circle, index) {
      var i = !index ? 0 : index
      var data = this.array_data


      while (i < data.length) {
        // drawing
        circle.cx = data[i].x + this.x + this.cell_width/2
        circle.cy = data[i].y + this.y - 0
        this.checkValidity()
        repaint()
        await new Promise(resolve => setTimeout(resolve, timeout_time))

        // here chceking if it should be added, or added and move the current one
        if (data[i].locked_node == undefined) {
          data[i].addCircle(circle, true)
          break;
        }
        if (circle.value < data[i].locked_node.value) {
          var res = data[i].removeCircle(false)
          data[i].addCircle(circle, true)
          await this.addCircleToSortedArray(res, i)
          break;
        }


        /* if (i == 0 || data[i-1].locked_node == undefined || data[i-1].locked_node.value < circle.value) {
          console.log("truth")
          if (i == data.length - 1 || data[i+1].locked_node == undefined || data[i+1].locked_node.value > circle.value) {
            // now add circle to this cell
            var prev = data[i].removeCircle()
            data[i].addCircle(circle)
            if (prev) this.addCircleToSortedArray(prev)
            break;
          } 

        } */
        i++;
      }
      return;
    } 
  
    makeGrid() {
      var temp = this;
      var xpos = 0
      for (var column = 0; column < this.size; column++) {
          this.array_data.push({
              x: xpos,
              y: 0,
              width: this.cell_width,
              height: this.cell_height,
              index: column,
              color: "gainsboro",
              mouseOver: false,
              static: temp.static,
              addCircle(circle, use_op) {
                this.locked_node = circle
                this.hovering_node = circle
                circle.locked_grid = this
                circle.fx = temp.x + this.x + this.width/2;
                circle.fy = this.height/2 + temp.y;
                if (use_op) dataHandler.addOp({str: temp.name + "[" + this.index + "] = " + circle.name})
              },
              removeCircle(use_op) {
                if (!this.locked_node) return;
                var c = this.locked_node;
                //c.static = true
                c.locked_grid = undefined;
                c.hovering_grid = undefined;
                c.fx = undefined;
                c.fy = undefined;
                this.locked_node = undefined;
                this.hovering_node = undefined;
                if (use_op) dataHandler.addOp({str: temp.name + "[" + this.index + "] = " + "null"})
                return c
              },
              toString() {
                return temp.name + "[" + this.index + "]" 
              }
          
          })
          // increment the x position. I.e. move it over by 50 (width variable)
          xpos += this.cell_width + this.cell_width/20; // and a little bit of margin
      }
  
    }

    setColor(color, index) {
        
        if (this.ele){ 
            //this.ele.selectAll(".arraycell").style("fill", "gainsboro")
            //console.log(this.ele.selectAll(".arraycell").filter(d => d.index === index))
            this.transform.selectAll(".arraycell").filter(d => d.index === index).style("fill", color)
          
            
            this.array_data[index].color = color
        }
    }

    checkValidity() {
        var obj = { valid: true, cells: [] }
        //get all cells holding data and order by index
        var temp = this.array_data.filter(d => d.hovering_node).sort((a, b) => a.index - b.index) 
        var data = this.array_data;

        
        
        var res = [];
        var prev = this.array_data.find(d => d.hovering_node) //data[0].hovering_node.value == undefined ? -999999 : data[0].hovering_node.value
        
        if (prev == undefined) 
        { 
            data.forEach(function(d) { res.push(BLANK) }); 
        }
        else {  
          for (var i = 0; i < prev.index; i++) 
          {
              res.push(NOT_SORTED);
          }
          var sorted = true;
          for(var i = prev.index; i < data.length; i++) {
              var curr = data[i];
              if(curr.hovering_node == undefined){
                  res.push(EMPTY);
                  continue;
              }
              
              if(curr.hovering_node.value < prev.hovering_node.value){ 
                  res.push(NOT_SORTED);
                  sorted = false
                  prev = curr;
              }
              else if (sorted) {
                  res.push(SORTED);
                  prev = curr;
              } 
              else 
              {
                  res.push(NOT_SORTED);
                  prev = curr;
              }
              
          }

          for (var i = prev.index + 1; i < data.length; i++) 
          {
              res[i] = BLANK;
          }
        }
        let squares = this;
        res.forEach(function(d, i) {
          if (d === BLANK) squares.setColor("gainsboro", i)
          if (d === EMPTY) squares.setColor("#e9b000", i)
          if (d === SORTED) squares.setColor("green", i)
          if (d === NOT_SORTED) squares.setColor("#E24e42", i)
      })
    }

    setTransform(x, y) {
      this.x = x
      this.y = y 
      this.transform.attr("transform", "translate(" + (this.x) + "," + this.y + ")") //set start position
      var temp = this;
      this.array_data.filter(d => d.locked_node).forEach(function(d) {
        
          d.locked_node.fx = temp.x + d.x + d.width/2 ;
          d.locked_node.fy = d.height/2 + temp.y;
      })
    }
    draw() {
      this.delete();
      this.ele = g.append("g")
      this.ele.datum(this)
      this.transform = g.append("g")
      var temp = this; //need to do this to use "this" in mouseout
      this.array_data.forEach(d => d.static = temp.static)
      this.transform.datum(this).attr("class", "array").attr("transform", "translate(" + (this.x) + "," + this.y + ")") //set start position
      
      this.transform.call(d3.drag()
      .on("drag", dragged)
      .on("end", dragended))

      this.transform
        .append("text")
        .attr("class", "arraytext")
        .attr("dx", (this.size * this.cell_width) / 2)
        .attr("dy", -25)
        .text(this.descriptor) 
        .attr('font-size',18)//font size
        .attr('font-family',"monaco")//font size
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")

      var cells = this.transform
        .selectAll(".arraycell")
        .data(this.array_data)
        .join("g")

        cells.append("text")
        .attr("class", "arraytext")
        .attr("dx", function(d) {return d.x + temp.cell_width/2} )
        .attr("dy", 125)
        .text(function(d, i) {return d.toString()}) 
        .attr('font-size',14)//font size
        .attr('font-family',"monaco")//font size
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")

        cells.append("rect")
          .attr("class","arraycell")
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("rx", 25)
          .attr("ry", 25)
          .attr("width", function(d) { return d.width; })
          .attr("height", function(d) { return d.height; })
          .style("fill", function(d) {return d.color })
          .style("opacity", 0)
          .style("stroke-width", 5)
          .on("mouseover", function(d) {
            d.mouseOver = true;

            // if dragging node and cell not holding node, then attach it to array cell
            if (!dragged_node) return;

            dragged_node.hovering_grid = d;
            
            d.hovering_node = dragged_node;
            dragged_node.fx = temp.x + d.x + d.width/2;
            dragged_node.fy = d.height/2 + temp.y;
            // now check if array is valid and color it accordingly
            temp.checkValidity()
            //this.ele.selectAll(".arraycell").style("fill", "gainsboro")
            
          
          })
          .on("mouseout", function(d) {
            d.mouseOver = false;

            if (!dragged_node) return;
            if (d.hovering_node !== d.locked_node) d.hovering_node = d.locked_node
            else d.hovering_node = undefined;
            
            
            // check if array is valid
            temp.checkValidity()
            
          
            dragged_node.hovering_grid = null;
          
          
          })
          .transition().duration(500).style("opacity", 0.5)
          cells.lower()
    }
  }
