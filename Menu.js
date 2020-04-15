class Menu {

    constructor(x, y) {
        this.menu_list = 
        [
            {text: "Press R to reset camera"},
            {text: "Press ESC to show/hide menu and progression"},
            {text: "Press M to mute or unmute background music"},
            {text: "Scroll the mousewheel to zoom in and out"},
            {text: "Click and drag to pan the camera"},
            {text: "Press this box to remove"},
        ]
        this.menu_list.forEach((d, i) => d.id = i)
        this.text_height = 20
        this.x = x
        this.y = y
        this.visible = true
        this.margin = 50
        this.draw();
    }

    delete() {
        
    }

    
    draw () {
        var temp = this;
        
        if (this.ele) 
        {
            this.ele.remove();
        }
        if (this.visible) 
        {
        this.ele = svg.append("g")
        
        var square = this.ele.append("rect")
        .attr("x", width * 0.785)
        .attr("y", height * 0.005)
        .style("fill", "white")
        .style("stroke-width", 3)
        .style("stroke", "black")
        .attr("opacity", 0.6)
        .attr("width", (this.menu_list.length-1) * (temp.margin) + 200)
        .attr("height", (this.menu_list.length -1) * (temp.margin) - 127)
        
        this.ele.on("click", () => {this.visible = false; this.draw()})


        var p = this.ele
            .selectAll(".menutext")
            .data(this.menu_list, d => d.id)
            .join("text")
            .text(d => d.text)
            .attr("opacity", 0.6)
            .attr("class", "menutext")
            .attr("y", (d, i) => height * 0.025 + i * this.text_height)
            .attr("x", width * 0.8)
        } else {
            this.ele = svg.append("g")
        
            var square = this.ele.append("rect")
            .attr("x", width * 0.785)
            .attr("y", height * 0.005)
            .style("fill", "white")
            .style("stroke-width", 3)
            .style("stroke", "black")
            .attr("opacity", 0.6)
            .attr("width", 50)
            .attr("height", 25)
            this.ele.on("click", () => {this.visible = true; this.draw()})

            var p = this.ele
                    .append("text")
                    .text("...")
                    .attr("opacity", 0.6)
                    .attr("class", "menutext")
                    .attr("y", (d, i) => height * 0.025)
                    .attr("x", width * 0.8 - 7)
        }
    }
}