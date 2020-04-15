class Logger {

    constructor(x, y) {
        this.op_list = [{str: "No action performed yet...", isPlaceholder: true}]
        this.x = x
        this.y = y
        this.text_height = 20
        this.font_size = 15
        this.row_count = 9
        this.extended_row_count = 20
        this.extended_rows = false

        this.timeWhenLastOp = Date.now()
        this.currentCombo = []
        
        this.COMBO_TIMEOUT = 1000
        this.draw();
    }

    delete() {
        if (this.ele) 
        {
            this.ele.remove();
        }
    }

    addOp(op) {
        if (this.op_list.filter(d => d.isPlaceholder).length > 0) this.op_list = []
        op.id = Date.now()
        this.op_list.push(op)

        //add to combo
        var timeNow = Date.now()
        var deltaTime = timeNow - this.timeWhenLastOp

        if (deltaTime < this.COMBO_TIMEOUT) {
            this.currentCombo.push(op)
        } else {
            this.currentCombo = [op]
        }
        this.timeWhenLastOp = timeNow


        // Play dramatic sound
        this.draw()
    }



    draw () {
        var temp = this;
        var shorter_list = this.op_list
        count = this.extended_rows ? this.extended_row_count : this.row_count
        if (this.op_list.length > count) shorter_list = this.op_list.slice(this.op_list.length - count, this.op_list.length)
        shorter_list.forEach((d, i) => {
            d.x = temp.x * 2
            d.y = temp.text_height * i + temp.y;
        });


        var t = 500
        
        if (!this.ele) {this.ele = svg.append("g")} 
        
        var combo_data = [{count: this.currentCombo.length, text: "Wow!", id: 0, x: 300, y: 100}]

        var log2comboLen = Math.log2(this.currentCombo.length) 
        if (Number.isInteger(log2comboLen)) {
            var combo_text_options = 
            [
                "Nice!",
                "Superb!",
                "Extraordinary!", 
                "Wicked!",
                "Mind-boggling!",
                "Prophetical!",
                "Other wordly!",
                "Celestial!",
                "ABSOLUTE LEGEND!",
            ]
            var combo_text = this.ele
            .selectAll(".combotext")
            .data(combo_data, d => d.id)
            .join(
                enter => 
                enter.append("text")
                    .attr("fill", piyg(Math.random()))
                    .attr("class", "combotext")
                    .attr('font-size', d => temp.comboTextSize(d))
                    .attr('font-family',"monaco")
                    .text(d => combo_text_options[Math.ceil(log2comboLen)])
                    .style("opacity", 1)
                    .attr("x", (d, i) => 200)
                    .attr("y", d => d.y)
                    .call(enter => 
                        enter.transition(t)
                        .attr('font-size', d => temp.comboTextSize(d)/2)
                        .attr("x", (d, i) => d.x + 150)
                    ) 
                , update => 
                    update
                    .call(update =>
                        update.attr("fill", piyg(Math.random()))
                        .transition(t)
                        .attr("x", (d, i) => d.x + 250)
                        .text(d => combo_text_options[Math.ceil(log2comboLen)])
                        .attr('font-size', d => temp.comboTextSize(d, true) / 2)
                        .attr("y", d => d.y)
                        .transition(t)
                        .attr('font-size', d => temp.comboTextSize(d)/2)
                        .attr("x", (d, i) => d.x + 150)
                    )
            
            )
        }
        
        var combo_count = this.ele
            .selectAll(".combocount")
            .data(combo_data, d => d.id)
            .join(
                enter => 
                    enter.append("text")
                        .attr("fill", "green")
                        .attr("class", "combocount")
                        .attr('font-size', d => temp.comboTextSize(d))
                        .attr('font-family',"monaco")//font size
                        .text(d => "x" + d.count)
                        .style("opacity", 0.5)
                        .attr("x", (d, i) => 200)
                        .attr("y", d => d.y)
                        .call(enter => 
                            enter.transition(t)
                            .attr('font-size', temp.font_size * 2)
                            .attr("x", (d, i) => d.x)
                        ) 
                        .on("click", d => {
                            console.log(d3.select(".combotext"))
                            d3.select(".combotext").style("opacity", 0.1)
                        })
                , update => 
                        update
                        .call(update =>
                            update.transition(t)
                            .attr("x", (d, i) => d.x)
                            .text(d => "x" + d.count)
                            .attr('font-size', d => temp.comboTextSize(d, true))
                            .attr("y", d => d.y)
                            .transition(t)
                            .attr('font-size', temp.font_size * 2)
                            .attr('font-size', d => temp.comboTextSize(d))
                        )
                , exit => 
                        exit.remove()
            )


        var p = this.ele
            .selectAll(".textline")
            .data(shorter_list, d => d.id)
            .join(
                enter => enter.append("text")
                    .attr("fill", "green")
                    .attr("class", "textline")
                    .attr('font-size', temp.font_size)//font size
                    .attr('font-family',"monaco")//font size
                    .attr("font-style", function(d) {
                        if (d.isPlaceholder) return "italic"
                        else return "default"
                    })
                    .attr("x", (d, i) => -100)
                    .attr("y", d => d.y)
                    .text(d => d.str)
                    .call(enter => enter.transition(t)
                    .attr("x", (d, i) => d.x))                   ,
                update => update
                    .attr("fill", "black")
                    .call(update => update.transition(t)
                    .attr("x", (d, i) => temp.x)
                    .attr("y", d => d.y)),
                exit => exit
                    .attr("fill", "brown")
                  .call(exit => exit.transition(t)
                    .attr("y", -50)
                    .remove())
            )     
        this.ele.on("click", () => 
        {
            temp.extended_rows = !temp.extended_rows
            temp.draw()
        })
    }

    comboTextSize(d, enlarged) {
        var extra = 0;
        if (enlarged) extra = 1

        if (d.count > 256)  return this.font_size * 8.00 + extra
        if (d.count > 128)  return this.font_size * 7.25 + extra
        if (d.count > 64)   return this.font_size * 6.50 + extra
        if (d.count > 32)   return this.font_size * 5.75 + extra
        if (d.count > 16)   return this.font_size * 5.00 + extra
        if (d.count > 8)    return this.font_size * 4.25 + extra
        if (d.count > 4)    return this.font_size * 3.50 + extra
        if (d.count > 2)    return this.font_size * 2.75 + extra
        else                return this.font_size * 2.00 + extra
                                
    }
}