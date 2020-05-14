class DataHandler {
  constructor() {
    this.level_state = 0;
    this.level_data = new LevelData();
    this.albot_data = new AlbotData();
    this.success_node = 0;
    this.drawableList = [];
    this.operations = 0;
    this.undo_states = [];
    this.redo_states = [];
    this.transitioning = false;
    this.circle_count = 0;
    this.logger;
    this.undo_states = []
    this.redo_states = []
    this.albot;
    this.readyForNextLevel = false;

  }

  pushState(list) {
    /* var temp = this
    var copy_list = temp.drawableList.reduce((list, element) => {
      if (element.isPlaceholder) return list
      return list.concat(Object.assign( Object.create( Object.getPrototypeOf(element)), element))
  }, [])
    copy_list.filter(d => d.constructor.name == "Circle").forEach(d => {
      d.children = undefined
      d.parent = undefined
      if (d.left) d.left_value = d.left.value
      if (d.right) d.right_value = d.right.value
      if (d.locked_to_tree) {
        d.locked_to_tree = copy_list.filter(d => d.constructor.name == "BST")[0]
      }
  })
    copy_list.filter(d => d.constructor.name == "Circle").forEach(d => {
      if (d.left) d.left = copy_list.filter(d => d.constructor.name == "Circle").filter(other => other.value == d.left_value)[0]
      if (d.right) d.right = copy_list.filter(d => d.constructor.name == "Circle").filter(other => other.value == d.right_value)[0]
  })
    copy_list.filter(d => d.constructor.name == "BST").forEach(d => {
      d.root = copy_list.filter(other => other.value == d.root.value)[0]
      console.log(d.root)
      //d.updateLinks()
      //d.draw()
    })
    list.push(copy_list)
    if (list.length > 5) {
      list.slice(1).slice(-5)
    }  */
  }

  



  clearScene() {
    // fix the level title 
    circle_manager.clear()
    let level = this.level_data.data[this.level_state];
    var lines = level.lines;

    if (this.level_state > 2) this.logo.remove()

    if (level.level_type == "Find" || level.level_type == "Delete" || level.level_type == "Insert")
      lines[lines.length - 1] = lines[lines.length - 1].replace(/[0-9]/g, '');

   // camera.autoCameraTarget = null;
    this.readyForNextLevel = false;
    this.drawableList.forEach(d => d.delete());
    this.drawableList = [];
    this.circle_count = 0;
    this.operations = 0;
    dragended();
  }

  createRandomPointOnCircumference(center, radius) {
    var angle = Math.random() * Math.PI * 2;
    var x = Math.cos(angle) * Math.random() * radius;
    var y = Math.sin(angle) * Math.random() * radius;
    return [center[0] + x, center[1] + y];
  }

  nextState() {
    this.clearScene();
    this.level_state++;
    this.createData();
  }

  isSuccess(n, bst) {
    console.log(this.readyForNextLevel)
    if (this.successCriteria(n, bst) && !this.readyForNextLevel) {
      this.level_data.data[this.level_state].level_finished = true;
      //this.albot.mood("happy")
      this.transition(n);
      this.albot.response();

      // check if achievement unlocked
      if (this.level_data.data[this.level_state].type === "array") map.achievements.find(d => d.title === "Array").completed = true

      if (this.level_data.data[this.level_state].type === "bst") map.achievements.find(d => d.title === "BST").completed = true

      if (this.level_data.data[this.level_state].type === "rb_bst") map.achievements.find(d => d.title === "RB BST").completed = true
    }
  }

  transition(n) {
    if (this.level_type) {
      this.level_type.text = "";
    };
    //camera.autoCameraTarget = null;
    let temp = this;
    audioHandler.play("levelComplete");
    /* let text = new cText(
      "Congratulations! \n" +
      temp.operations +
      " operation" +
      (temp.operations > 1 ? "s" : ""),
      width / 2,
      height / 4
    );
    text.fontsize = 50;
    text.opacity = 0.5;
    this.addFigure(text);
    repaint(); */

    var text = new cText("Press space to continue...", width / 2, height * 0.95);
    text.fontsize = 30;
    text.opacity = 0.5;
    
    this.addFigure(text);

    const circle = d3.selectAll("circle").filter(function (c) {
      return c === n;
    });
    this.getAllFiguresOfClass("Circle")
      .filter(d => !d.isPlaceholder)
      .forEach(d => {
        // d.isInteractable = false
        d.isRevealed = true;
        d.isNumberVisible = true;
      });
    
    if (n) n.highlighted = true
    repaint();
    text.text_ele.on("click", () => dataHandler.goToNextLevel())
    /* circle
      .transition()
      .duration(2000)
      .attr("r", defaultRadius * 2);
    circle.attr("cx", -500); */

    let array = temp.getAllFiguresOfClass("cArray");


    if (array && array.length > 0) {
      array.forEach(d => d.array_data.forEach(c => c.removeCircle()));
      //array.checkValidity()
      repaint();
    }
    simulation.force(
      "repel",
      d3
        .forceManyBody()
        .strength(function (d) {
          if (d !== n) return 0;
          return defaultRadius * -50;
        })
        .distanceMin(10)
    );


    setTimeout(function () {
      camera.panToDOMElement(d3.selectAll(".everything").node());
    }, 500);

    
    // do not skip to new state automatically, instead offer user to click enter to go to next level, or click restart
    this.readyForNextLevel = true;

    // makes circle bounce around for certain time, or untill next level has been loaded
    var rec_bounce = (timeout, count) => {
      if (temp.readyForNextLevel && count < 10) {
          temp.getAllFiguresOfClass("Circle").filter(d => d == n).forEach(d => {
            var point = temp.createRandomPointOnCircumference([width/2, height/2], 500 - count*(400/10))
            d.cx = point[0]
            d.cy = point[1]
          })
          simulation.alphaTarget(0.2)
          simulation.nodes(circle_manager.circles)
          setTimeout(() => {
            count += 1
            rec_bounce(timeout + timeout/5, count)
            
          }, timeout)
      }
    }
    rec_bounce(200, 1)

  }

  goToNextLevel() {
    if (this.readyForNextLevel) {
      //camera.reset();
      this.nextState();
      this.transitioning = false;
    }
  }
  addOp(op) {
    var rand_nr = Math.floor(Math.random() * 13 + 1)
    audioHandler.play("key" + rand_nr);
    this.operations += 1;
    this.logger.addOp(op);
    this.logger.draw();
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  restartLevel() {
    this.clearScene();
    this.createData();
  }

  async createData() {
    svg.transition().duration(500).style("background", bg_colors[Math.floor(Math.random() * bg_colors.length)])
    this.logger = new Logger(width * 0.01, 20);
    this.addFigure(this.logger);
    
    simulation.alphaTarget(0.5)
    let level = this.level_data.data[this.level_state];
    if (level.level_type == "Main") {
      this.createMainMenu();
    }
    else {
      if (this.albot) this.albot.delete()

      this.albot =  new Albot(width * 0.0005, height * 0.75);
      if (level.initial_mood) this.albot.mood(level.initial_mood)

      
      //this.albot.addAlbot();

      this.success_node = Math.round(
        Math.random() * (level.range ? level.range : level.node_count)
      );


      
      var lines = level.lines;

      if (level.level_type == "Find" || level.level_type == "Delete" || level.level_type == "Insert")
        lines[lines.length - 1] = lines[lines.length - 1] + " " + this.success_node
      
      this.albot_speaking = true
      if (!this.skip_dialogue) {
        await this.albot.say(lines)
        /* if (this.create_cancelled) { */
       /*    this.create_cancelled = false
          return
        } */
      }
      else this.albot.say(lines, 0)

      this.albot_speaking = false

      // fix a bug here, where if the levle is skipped before this sentence is done, it will fuck up
      this.albot.mood("")

      let figures = this.generateFiguresFromLevel(level);
      this.drawableList.push(...figures);


      //The interactable items for this level


      this.successCriteria = level.success_criteria;

      //repaint();
      setTimeout(function () {
        camera.panToDOMElement(d3.selectAll(level.pan_element).node());
      }, 500);
    }
  }

  createMainMenu() {
    let temp = this;
    //let title = new cText("Algorithms with Albot", width / 2, height / 4);
    //title.fontsize = 70;



    let w = width
    let h = height
    let m = 50 // diameter of circle

    var colorArray = [d3.schemeCategory10, d3.schemeAccent];
    var colorScheme = d3.scaleOrdinal(colorArray[0]);
    this.main_menu_circle = svg.selectAll("circle")
        .data(d3.range(30).map(function(i) {
          return {
            x: w * Math.random(),
            y: h * Math.random(),
            dx: Math.random() - 0.5,
            dy: Math.random() - 0.5,
            i: i
          };
        }))
      .enter().append("circle")
        .attr("r", 50)
        .style("text-anchor", "middle")
        .style("fill", d => colorScheme(d.i))
        .style("opacity", 0.8)
        .attr("pointer-events", "none")
        .attr("font-size", defaultRadius / 1.3) //font size
        .attr("font-family", "monaco"); //font size
    d3.timer(function() {

      // Update the circle positions.
      temp.main_menu_circle
          .attr("cx", function(d) { d.x += d.dx; if (d.x > w + m) d.x -= w + m*2; else if (d.x < 0 - m) d.x += w - m*2; return d.x; })
          .attr("cy", function(d) { d.y += d.dy; if (d.y > h + m) d.y -= h + m*2; else if (d.y < 0 - m) d.y += h - m*2; return d.y; });

    });
    var logo = d3.select("div").append('img')
    
    
    logo  .attr('src', 'res/images/logo.png')
      .style("position", "absolute")
      .style("height", "50%")
      .style("left", "30%")
      .style("width", "40%")
      //.style("display", "block")
      .style("margin-left", "auto")
      .style("margin-right", "auto")
      .style("opacity", 0)


    
  
    logo.transition().duration(5000).style("opacity", 0.99)
    this.logo = logo
    //svg.selectAll("circle").style("opacity", 0.1)

    let start = new cButton("Start", width / 2, height * 0.66, () => {console.log(temp.main_menu_circle); temp.main_menu_circle.transition().duration(2000).style("opacity", 0); temp.logo.transition().duration(2000).style("opacity", 0); setTimeout(() => {logo.remove(); temp.main_menu_circle.remove()}, 2000) ;this.nextState() })
    start.draw()
    //this.addFigure(title);
    this.addFigure(start);
    repaint();
    
  }

  clearObjects(shape) {
    if (!shape)
      this.drawableList.forEach(d => {
        d.delete();
      });
    this.drawableList
      .filter(function (d) {
        return d.constructor.name === shape;
      })
      .forEach(d => d.delete());
  }

  getAllFiguresOfClass(className) {
    if (className === "Circle") {
      return circle_manager.circles
    }
    return dataHandler.drawableList.filter(function (d) {
      return d.constructor.name === className;
    });
  }

  drawFigures() {
    this.drawableList
      .filter(d => d.constructor.name !== "Logger")
      .filter(d => d.constructor.name !== "TextArea")
      .sort((a, b) => a.z - b.z)
      .forEach(function (d) {
        d.draw();
      }); // sort all shapes by their z index.
  }

  makeArray = function (n, descriptor) {
    return new cArray(n, descriptor, width / 2, height / 2);
  };

  makeCircle = function (n) {
    return new Circle(
      Math.round(Math.random() * 20),
      circle_manager.max_id++,
      width / 2,
      height / 2
    );
  };

  makeBST(root) {
    root.isInteractable = true;
    return new BST(root, width / 2, height / 2);
  }
  makeRedBlackBST(root) {
    root.isInteractable = true;
    return new RedBlackBST(root, width / 2, height / 4);
  }

  removeFigure(fig) {
    var index = this.drawableList.indexOf(fig);
    if (index !== -1) this.drawableList.splice(index, 1);
    //if (!fig.ele) {console.log(fig)}
  }

  addFigure(fig) {
    this.drawableList.push(fig);
  }

  generateFiguresFromLevel(level) {
    let figures = [];
    let circles = generateNodes(
      level.node_count,
      level.random_nodes,
      level.range
    );
    circle_manager.add(circles)
    repaint()
    //figures.push(...circles);
    //circle_manager.add(circles)
    if (circles.filter(d => d.value === this.success_node).length == 0) {
      circles[Math.floor(circles.length / 2)].value = this.success_node;
    }
    circles.forEach(c => {
      c.isInteractable = true;
      c.nodeClicked = (n, i) => {
        onNodeClicked(n, i);
        dataHandler.isSuccess(n);
      };
    });
    if (level.type === "array") {
      var array = this.makeArray(
        level.subtype === "insert_demonstration" ? circles.length + 1 : circles.length,
        level.subtype.charAt(0).toUpperCase() +
        level.subtype.substring(1) +
        " array"
      );


      array.static = true;
      if (level.subtype === "sorted" || level.subtype === "insert_demonstration") {
        circles.sort((a, b) => a.value - b.value);
      }
      var temp = this
      figures.push(array);

      array.addDataToArray(circles)
      array.draw()
      repaint()

      if (level.subtype === "sorted") {
        console.log(array)
        array.checkValidity()
      }

      if (level.subtype === "insert_demonstration") {
        array.use_op = true

        var extra = generateNodes(1, true, level.range)
        extra[0].value = 5
        circle_manager.add(extra)
        circle_manager.circles.forEach(d => {
          d.isNumberVisible = true;
          d.isRevealed = true;
          d.isInteractable = true;
        })

        console.log(this.getAllFiguresOfClass("Circle").length)

        //array.checkValidity()

        var closure = async (arr) => {
          // creating closure so i can do stuff after elements has been inserted.
          await temp.asyncForEach(extra, async function (d) {
            await arr.addCircleToSortedArray(d);

            arr.checkValidity()
            repaint()

          })

        }
        closure(array)
      }


      //array.addDataToArray(circles);

      
    }


    if (level.type === "bst") {
      if (level.data_list) {
        //this.success_node = 7;
        circles.forEach(function (d, i) {
          //d.nodeClicked = d;
          d.value = level.data_list[i];
          d.isInteractable = false;
          d.isRevealed = false;
        });
      }

      var insert_node = circles.filter(d => d.value === this.success_node)[0];

      circles.splice(circles.indexOf(insert_node), 1);
      var best_root = circles.concat().sort((a, b) => a.value - b.value)[
        Math.floor(circles.length / 2)
      ];
      if (!level.random_nodes) {
        // this.success_node = level.data_list[level.data_list.length - 1]
        best_root = circles[0]
      }
      var bst = this.makeBST(best_root);

      bst.use_op = false;
      bst.linksCutable = false;
      bst.isInteractable = false;
      bst.isLectureMode = true;
      circles.splice(circles.indexOf(best_root), 1);

      circles.forEach(d => (d.isInteractable = false));
      var temp = this;

      if (level.subtype === "demonstration") {
        circles.unshift(insert_node);
        best_root.isNumberVisible = true;
        circles.forEach(d => {
          d.isNumberVisible = true; d.isRevealed = true; d.invisible = true
        })
        bst.allowAddingChildToPlaceholder = true;
        bst.linksCutable = true;
        bst.functionsCanBeCalled = true;
        bst.use_op = true;

        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            d.invisible = false;
            await bst.public_insert(d, bst.root, 0);
            d.cx = 0;
            d.cy = 0;
            camera.reFocus();
            bst.updateLinks()
            repaint()

            await new Promise(resolve => setTimeout(resolve, timeout_time))
            //bst.updateLinks();
            //temp.drawFigures();
          });
          //var extra_circles = [new Circle(this.success_node, dataHandler.circle_count++, 0, 0)]

          bst.updateLinks();
          //this.drawableList.push(...extra_circles)
          //bst.root.functionsCanBeCalled = true

          //bst.updateOnClickForInsertion(bst.root)
          bst.d3tree.descendants().forEach(d => {
            //d.data.isInteractable = true

            bst.updateOnClickForInsertion(d.data);
          });
          bst.updateOnClickForInsertion(bst.root);

          repaint();

          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);

          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      }
      else if (level.subtype === "insert_demonstration") {
        circles.unshift(insert_node);
        best_root.isNumberVisible = true;
        circles.forEach(d => {
          d.isNumberVisible = true; d.isRevealed = true; d.invisible = true
        })
        bst.allowAddingChildToPlaceholder = true;
        bst.linksCutable = true;
        bst.functionsCanBeCalled = true;
        bst.use_op = true;

        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            d.invisible = false;
            await bst.public_insert(d, bst.root, 0);
            d.cx = 0;
            d.cy = 0;
            camera.reFocus();
            bst.updateLinks()
            repaint()

            await new Promise(resolve => setTimeout(resolve, timeout_time))
            //bst.updateLinks();
            //temp.drawFigures();
          });
          //var extra_circles = [new Circle(this.success_node, dataHandler.circle_count++, 0, 0)]

          bst.updateLinks();
          //this.drawableList.push(...extra_circles)
          //bst.root.functionsCanBeCalled = true

          //bst.updateOnClickForInsertion(bst.root)
          bst.d3tree.descendants().forEach(d => {
            //d.data.isInteractable = true

            bst.updateOnClickForInsertion(d.data);
          });
          bst.updateOnClickForInsertion(bst.root);

          repaint();

          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);

          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      }
      else if (level.subtype === "insert") {
        bst.allowAddingChildToPlaceholder = true;
        bst.linksCutable = true;
        bst.use_op = true;
        this._timeout_time = timeout_time;
        timeout_time = 0;
        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            await bst.public_insert(d, bst.root, 0);
            d.cx = 0;
            d.cy = 0;
            camera.reFocus();
            //bst.updateLinks();
            //temp.drawFigures();
          });
          timeout_time = this._timeout_time;
          //var extra_circles = [new Circle(this.success_node, dataHandler.circle_count++, 0, 0)]
          bst.updateLinks();
          //this.drawableList.push(...extra_circles)
          bst.node_to_insert = insert_node;
          bst.node_to_insert.isRevealed = true;
          bst.node_to_insert.isNumberVisible = true;

          //bst.updateOnClickForInsertion(bst.root)
          bst.d3tree.descendants().forEach(d => {
            //d.data.isInteractable = true
            bst.updateOnClickForInsertion(d.data);
          });
          bst.updateOnClickForInsertion(bst.root);

          repaint();

          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);

          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      } else if (level.subtype === "delete") {
        circles.unshift(insert_node);
        level.success_criteria = () => {
          console.log(insert_node.locked_to_tree !== bst);
          console.log(
            !d3
              .selectAll(".circle")
              .data()
              .filter(d => {
                return !d.isPlaceholder && d !== insert_node;
              })
              .some(c => c.locked_to_tree !== bst)
          );
          console.log(bst.isValid());
          return (
            insert_node.locked_to_tree !== bst &&
            !d3
              .selectAll(".circle")
              .data()
              .filter(d => {
                return !d.isPlaceholder && d !== insert_node;
              })
              .some(c => c.locked_to_tree !== bst) &&
            bst.isValid()
          );
        };

        bst.isInteractable = true;
        bst.linksCutable = true;
        bst.isLectureMode = true;

        //bst.root.isInteractable = true; bst.root.isNumberVisible = true; bst.root.isRevealed = true;
        this._timeout_time = timeout_time;
        timeout_time = 0;
        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            await bst.public_insert(d, bst.root, 0);
            d.cx = 0;
            d.cy = 0;
            //bst.updateLinks();
            //temp.drawFigures();
          });
          //var extra_circles = [new Circle(this.success_node, dataHandler.circle_count++, 0, 0)]
          timeout_time = this._timeout_time
          bst.updateLinks();
          bst.d3tree.descendants().forEach(d => {
            bst.updateOnClick(d.data);
          });
          bst.updateOnClick(bst.root);

          repaint();
          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);

          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      } else if (level.subtype === "insert_user_code") {
        circles.push(insert_node);
        var textField = new TextArea(level.code);
        this.addFigure(textField);
        textField.draw();

        bst.isInteractable = true;
        bst.linksCutable = true;
        bst.isLectureMode = false;
        bst.root.isInteractable = true;
        bst.root.isNumberVisible = true;
        bst.root.isRevealed = true;

        circles.forEach(d => {
          d.isInteractable = true;
          d.isNumberVisible = true;
          d.isRevealed = true;
          d.invisible = true
        });
        bst.use_op = true;

        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            //await bst.insertNoTimeout(d, bst.root)
            d.invisible = false
            await bst.insertWithCustomCode(d, bst.root);

            // await new Promise(resolve => setTimeout(resolve, 1500))
            bst.updateLinks();
            repaint();
            d.cx = 0;
            d.cy = 0;
          });
          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          console.log(bst)
          temp.isSuccess(circles[circles.length - 1], bst)
          bst.use_op = true;
          bst.updateLinks();
          repaint();
          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);
        };
        closure();
      } else {
        bst.allowAddingChildToPlaceholder = false;
        circles.push(insert_node);
        this._timeout_time = timeout_time;
        timeout_time = 0;
        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            //await bst.insertNoTimeout(d, bst.root)
            await bst.public_insert(d, bst.root);
            d.cx = 0;
            d.cy = 0;
          });

          timeout_time = this._timeout_time
          bst.updateLinks();
          bst.d3tree.descendants().forEach(d => {
            bst.updateOnClick(d.data);
          });
          bst.updateOnClick(bst.root);
          repaint();
          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);
          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      }

      figures.push(bst);
    }
    if (level.type === "rb_bst") {
      if (level.data_list) {
        this.success_node = 7;
        circles.forEach(function (d, i) {
          //d.nodeClicked = d;
          d.value = level.data_list[i];
          d.isInteractable = false;
          d.isRevealed = false;
        });
      }

      var insert_node = circles.filter(d => d.value === this.success_node)[0];

      circles.splice(circles.indexOf(insert_node), 1);
      var best_root = circles.concat().sort((a, b) => a.value - b.value)[
        Math.floor(circles.length / 2)
      ];
      var bst = this.makeBST(best_root);

      bst.use_op = false;
      bst.RedBlackBST = true
      bst.linksCutable = false;
      bst.isInteractable = false;
      bst.isLectureMode = true;
      circles.splice(circles.indexOf(best_root), 1);

      circles.forEach(d => (d.isInteractable = false));
      var temp = this;

      if (level.subtype === "demonstration") {
        best_root.isRevealed = false; best_root.isInteractable = false;
        circles.unshift(insert_node);
        best_root.isNumberVisible = true
        circles.forEach((d, i) => {
          d.isNumberVisible = true; d.isRevealed = true; d.isInteractable = true; d.invisible = true;
        })
        bst.allowAddingChildToPlaceholder = true;
        bst.linksCutable = true;
        bst.functionsCanBeCalled = true;
        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            d.invisible = false;
            temp.pushState(this.undo_states)
            await bst.public_balanced_insert(d, bst.root, 0);
            d.cx = 0;
            d.cy = 0;
            camera.reFocus();
            bst.updateLinks()
            //repaint()
            //await new Promise(resolve => setTimeout(resolve, 500))
            //bst.updateLinks();
            //temp.drawFigures();
          });
          //var extra_circles = [new Circle(this.success_node, dataHandler.circle_count++, 0, 0)]

          bst.updateLinks();

          bst.root.isInteractable = true
          bst.root.isRevealed = true
          //this.drawableList.push(...extra_circles)
          //bst.root.functionsCanBeCalled = true

          //bst.updateOnClickForInsertion(bst.root)
          /*  bst.d3tree.descendants().forEach(d => {
             //d.data.isInteractable = true
             
             bst.updateOnClickForInsertion(d.data);
           });
           bst.updateOnClickForInsertion(bst.root);
    */


          //this.drawableList.push(...extra_circles)
          //bst.root.functionsCanBeCalled = true

          //bst.updateOnClickForInsertion(bst.root)
          /*  bst.d3tree.descendants().forEach(d => {
             //d.data.isInteractable = true
             
             bst.updateOnClickForInsertion(d.data);
           });
           bst.updateOnClickForInsertion(bst.root);
    */

          //        this.pushState(this.undo_states)



          //  console.log(temp.copy_list)
          repaint();

          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);

          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      }
      else if (level.subtype === "insert") {
        bst.allowAddingChildToPlaceholder = false;
        best_root.isRevealed = false; best_root.isInteractable = false;
        this._timeout_time = timeout_time;
        timeout_time = 0;
        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            await bst.public_balanced_insert(d, bst.root, 0);
            d.cx = 0;
            d.cy = 0;
            //bst.updateLinks();
            //temp.drawFigures();
          });
          //var extra_circles = [new Circle(this.success_node, dataHandler.circle_count++, 0, 0)]
          timeout_time = this._timeout_time
          bst.updateLinks();
          //this.drawableList.push(...extra_circles)
          insert_node.color = "black"
          bst.node_to_insert = insert_node;
          bst.node_to_insert.isRevealed = true;
          bst.node_to_insert.isNumberVisible = true;
          bst.root.isInteractable = true
          bst.root.isRevealed = true

          //bst.updateOnClickForInsertion(bst.root)
          bst.d3tree.descendants().forEach(d => {
            //d.data.isInteractable = true
            bst.updateOnClickForInsertion(d.data);
          });
          bst.updateOnClickForInsertion(bst.root);

          repaint();
          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);
          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      } else {
        bst.allowAddingChildToPlaceholder = false;
        circles.push(insert_node);
        best_root.isRevealed = false; best_root.isInteractable = false;
        this._timeout_time = timeout_time;
        timeout_time = 0;
        var closure = async () => {
          // creating closure so i can do stuff after elements has been inserted into tree.
          await temp.asyncForEach(circles, async d => {
            //await bst.insertNoTimeout(d, bst.root)

            await bst.public_balanced_insert(
              d,
              bst.root,
              1500 / temp.circle_count
            );
            d.cx = 0;
            d.cy = 0;
            bst.updateLinks();
            repaint();
          });
          timeout_time = this._timeout_time
          bst.updateLinks();
          bst.d3tree.descendants().forEach(d => {
            bst.updateOnClick(d.data);
          });
          bst.updateOnClick(bst.root);
          circles.forEach((d, i) => {
            d.isNumberVisible = false; d.isRevealed = false; d.isInteractable = false;
          })
          bst.root.isInteractable = true
          bst.root.isRevealed = true
          repaint();
          setTimeout(() => {
            camera.SetFocus([
              bst.root,
              bst.root.children[0],
              bst.root.children[1]
            ]);
          }, 100);
          //circles.forEach((d) => {if (!d.locked_to_tree) {dataHandler.removeFigure(d); d.delete();} })
          bst.use_op = true;
        };

        closure();
      }

      figures.push(bst);
    }
    return figures;
  }
}
