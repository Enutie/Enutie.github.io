class Roadmap {
    constructor(x, y) {
        this.visible = false

        this.image_width = 100
        this.image_height = 100
        this.margin = 25
        this.columns = 5
        this.opacity = 0.7
        this.x = width/2 - (this.columns * (this.image_width + this.margin))/2
        this.y = height/2 - (this.columns * (this.image_height))/2

        this.showing_achievements = false
        this.achievements = 
        [
            {
                title: "Array",
                completed: true,
                pre_text: "    ___                          \n   /   |  ______________ ___  __ \n  / /| | / ___/ ___/ __ `/ / / / \n / ___ |/ /  / /  / /_/ / /_/ /  \n/_/  |_/_/  /_/   \\__,_/\\__, /   \n                       /____/    \n \n",
                description: "You have learned about arrays!\n An array is a data structure, if sorted binary search can be used to find elements in log(n) time."
            
            },
            {
                title: "BST",
                completed: true,
                pre_text: "    ____     _____    ______ \n   / __ )   / ___/   /_  __/ \n  / __  |   \\__ \\     / /    \n / /_/ /   ___/ /    / /     \n/_____/   /____/    /_/      \n                             \n",
                description: "You have learned about BST!\n A BST is a data structure used to store nodes. To use the data-structure then navigate from the root to the desired node."
            },
            {
                title: "Binary Search",
                completed: true,
                pre_text: "     __    _                        \n    / /_  (_)___  ____ ________  __ \n   / __ \\/ / __ \\/ __ `/ ___/ / / / \n  / /_/ / / / / / /_/ / /  / /_/ /  \n /_.___/_/_/ /_/\\__,_/_/   \\__, /   \n                          /____/    \n",
                description: "You have learned about Binary Search!"
            },
            {
                title: "RB BST",
                completed: true,
                pre_text: "     ____  ____     ____ ___________ \n    / __ \\/ __ )   / __ ) ___/_  __/ \n   / /_/ / __  |  / __  \\__ \\ / /    \n  / _, _/ /_/ /  / /_/ /__/ // /     \n /_/ |_/_____/  /_____/____//_/      \n\n",
                description: "You have learned about red black BST!"
            },
        ]

        this.new_achievements = this.achievements.reduce((acc, a) => a.completed ? acc.concat(a) : acc, [])

    }

    delete() {
        if (this.ele) 
        {
            this.ele.remove()
            if (this.range) this.range.remove()
            if (this.achievement_div) this.achievement_div.remove()
            if (this.showing_achievements_button) this.showing_achievements_button.remove()
        }
    }

    switch() {
        if (dataHandler.logo) dataHandler.logo.remove()
        if (this.visible) this.showing_achievements = false
        this.visible = !this.visible;
        this.draw()
    }


    draw() {
        var data = dataHandler.level_data.data.concat()
        this.x = width/2 - (this.columns * (this.image_width + this.margin))/2
        this.delete()
        var temp = this
        this.ele = svg.append("g")
        data.splice(0,1)
        data.forEach((d,i) => {
            d.id = i;
        });
        
        if (this.visible) {

            if (this.showing_achievements) {
                
                this.achievement_div = d3.select("div").append("div")
                
                //.style("pointer-events", "none")
                //.style("position", "relative")
                .style("text-align", "center")
                .style("height", "100%")
                .style("background-color", "white")
                .style("opacity", 0.9)
                .on("click", (d) => {
                    if (temp.showing_achievements) temp.switch(temp)
                   // else {}
                })
                //.style("", "15px")

            this.achievement_div.append("pre").text("Achievements:").style("font-size", "30px").style("text-align", "center")
            
            this.achievement_div
            .selectAll(".achievements")
            .data(this.achievements, d => d.title)
            .join(
                enter => 
                    enter
                    .append("pre")
                    .attr("class", "achievements")
                    .text(d => d.completed ? d.pre_text : "") //.text(d => d.pre_text.join("\n"))
                    //.style("font-family", "monaco")
                    .style("background-color", d => temp.new_achievements.includes(d) ? "green" : "grey")
                    //.style("opacity", 0.5)
                    .style("color", "gold")
                    .style("font-size", "20px")
                    .style("text-align", "center")
                    .on("mouseover", this.mouseover)
                    .on("mouseout", this.mouseout)
                    .on("click", this.mouseclick)

            )
            } 
            else {
            this.ele.append("rect")
                    .attr("x", this.x - 50)
                    .attr("y", this.y - 50)
                    .style("fill", "white")
                    .style("stroke-width", 3)
                    .style("stroke", "black")

                    .attr("width", (temp.columns-1) * (temp.image_width + temp.margin) + 200)
                    .attr("height", (temp.columns) * (temp.image_width + temp.margin) + 50)

            this.ele.append("text")
                    .style("opacity", this.opacity)
                    .text("Menu")
                    .attr("x", this.x + (temp.columns-1) * (temp.image_width + temp.margin) /2)
                    .attr("y", this.y - 10)
                    .attr("font-size", 30)
                    

            this.squares = this.ele.selectAll(".level_image")
            .data(data, d => d.id)
            .join(
                enter => enter.append("rect")
                        .attr("class", "level_image")
                        
                        .attr("x", function(d) { return (d.id % temp.columns) * (temp.image_width + temp.margin) + temp.x; })
                        .attr("y", function(d) { return parseInt(d.id / temp.columns) * (temp.image_width + temp.margin) + temp.y})
                        .attr("width", function(d) { return temp.image_width; })
                        .attr("height", function(d) { return temp.image_height; })
                        .style("stroke-width", (d) => {
                            if (d.id == dataHandler.level_state - 1) {
                                return 5
                            } else {
                                return 0
                            }
                        })
                        .style("stroke", "gold")
                        .style("fill", function(d) {
                            if (d.level_finished) {
                                return "lightgreen" 
                            } else 
                            {
                                return "lightgrey"
                            }
                        })
                       // .style("opacity", 0.4)
                        .on("click", (d, i) => {
                            svg.selectAll("circle").remove()
                            dataHandler.level_state = i + 1
                            dataHandler.restartLevel()
                            temp.visible = false
                            temp.draw()
                        })
                        
                        

                )
            this.ele.selectAll(".type")
                .data(data, d => d.id)
                .join(
                    enter => enter.append("text")
                            .attr("class", "type")
                            .style("fill", "white")
                            .attr("pointer-events", "none")
                            .attr("x", function(d) { return (d.id % temp.columns) * (temp.image_width + temp.margin) + temp.x + temp.image_width/24 ; })
                            .attr("y", function(d) { return parseInt(d.id / temp.columns) * (temp.image_width + temp.margin) + temp.y + temp.image_height/4})
                            .text((d) => d.type.toUpperCase())
                            .attr("font-size", 20)
                )

            this.ele.selectAll(".level_type")
            .data(data, d => d.id)
            .join(
                enter => enter.append("text")
                        .attr("class", "level_type")
                        .attr("pointer-events", "none")
                        .attr("x", function(d) { return (d.id % temp.columns) * (temp.image_width + temp.margin) + temp.x + temp.image_width/16 ; })
                        .attr("y", function(d) { return parseInt(d.id / temp.columns) * (temp.image_width + temp.margin) + temp.y + temp.image_height/2})
                        .text((d) => d.level_type)
                        .attr("font-size", 15)
            )

            
            
            // range animation time
            this.range = d3.select("div").append("div")
                .style("position", "absolute")
                .style("width", "20%")
                .style("left", "40%")
                .style("top", "5%")

            var range_text = this.range 
                .append("text")
                .text("Animation speed: " + timeout_time + " ms")
                .style("text-align", "justify")
                
            this.range
                .append("input")
				.attr("type", "range")
				.attr("min", 0)
                .attr("max", 3000)
                .attr("value", timeout_time)
                
                
				.attr("step", "10")
				.attr("id", "hey")
				.on("input", function input() {
                    //update();
                    timeout_time = this.value
                    range_text.text("Animation speed: " + timeout_time + " ms")
                });

                this.showing_achievements_button = svg.append("g")
        
                var square = this.showing_achievements_button.append("rect")
                    .attr("x", width * 0.645)
                    .attr("y", height * 0.08)
                    .style("fill", "white")
                    .style("stroke-width", 3)
                    .style("stroke", "black")
                    .attr("opacity", 0.6)
                    .attr("width", 105)
                    .attr("height", 25)
                
                    this.showing_achievements_button.on("click", () => {temp.showing_achievements = true; temp.visible = true; temp.draw()})
    
                var p = this.showing_achievements_button
                        .append("text")
                        .text("Achievements")
                        .attr("opacity", 0.6)
                        .attr("class", "menutext")
                        .attr("x", width * 0.65)
                        .attr("y", height * 0.1)

                if (this.new_achievements.length > 0) {
                    this.showing_achievements_button
                        .append("circle")
                        .attr("r", 15)
                        .attr("cx", width * 0.645)
                        .attr("cy", height * 0.078)
                        .style("fill", "red")
                        .style("opacity", 0.5)

                    this.showing_achievements_button
                        .append("text")
                        .text(this.new_achievements.length.toString())
                        .attr("x", width * 0.643)
                        .attr("y", height * 0.085)
                        .style("fill", "white")
                        .style("opacity", 0.9)
                }
            }
        }
    }

    mouseover(d, i) {
        const achievement = d3.select(this);
        var i = map.new_achievements.indexOf(d)
        if (i !== -1) map.new_achievements.splice(i, 1)
        achievement
        .style("background-color", "black")
        .text(d => d.pre_text + d.description)
        
    }
    mouseout(d, i) {
        var rand_nr = Math.floor(Math.random() * 13 + 1)
        audioHandler.play("key" + rand_nr);
        const achievement = d3.select(this);
        achievement
        .style("background-color", "grey")
        .text(d => d.pre_text)
        
    }
    mouseclick(d, i) {
        const achievement = d3.select(this);
        achievement
        
    }
}