
class Albot {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.typeit;
        this.current_mood = ""
        this.addAlbot()
    }

    moveToCorner() {
        this.d
            .transition()
            .duration(1000)
            .style("bottom", "0%")
            .style("left", "0%");

    }

    addAlbot() {
        var d = d3.select("div").append("div")

        var myimage = d.append('img')
            .attr('src', 'res/images/Albot' + this.current_mood + '.png')
            .attr('class', 'albot')
            .style("pointer-events", "none")



        var speechbubble = d.append("p")
            .attr("class", "speech")

        speechbubble.append("h1").attr("id", "content")

        this.d = d
        this.img = myimage


        myimage.lower();
        
        if (dataHandler.level_state === 1 && !dataHandler.readyForNextLevel)  // if level 1, then fade in albot
        {
            console.log("first level!")
            this.d.style("opacity", 0)
            this.d.transition().duration(1500).style("opacity", 1)
            this.d
                .style("position", "absolute")
                .style("bottom", "40%")
                .style("left", "40%")
        } 
        else if (!dataHandler.readyForNextLevel) {
            console.log("moving!")
            this.d
                .style("position", "absolute")
                .style("bottom", "0%")
                .style("left", "0%")
            
            this.d   
                .transition()
                .duration(800)
                .style("bottom", "40%")
                .style("left", "40%")
        }

        /* if (!dataHandler.readyForNextLevel) {
            this.d
                .style("position", "absolute")
                .style("bottom", "40%")
                .style("left", "40%")
                .transition()
                .duration(1000)

        } else {
            this.d
                .style("position", "absolute")
                .style("bottom", "0%")
                .style("left", "0%")
        } */
        /* this.d
            .transition() */
            


        //speechbubble.lower();
    }

    delete() {
        this.d.remove()
        this.typeit.destroy()
    }

    mood(mood) {
        this.current_mood = mood;
    }

    async say(text, speed) {
        this.d.remove()
        this.addAlbot()
        if (speed == undefined) speed = 40
        if (this.typeit) {
            this.typeit.destroy()
        }
        var temp = this
        var i = 0
        return new Promise((resovle) => {
        temp.typeit = new TypeIt("#content", {
            beforeStep: async (step, instance) => {
                
                //console.log(instance.executed[instance.executed.length - 1])
                var char_info = instance.executed[instance.executed.length - 1]
                if (!char_info) return;
            
                var c = instance.executed[instance.executed.length - 1][1]
                if (c.length !== 1 || !c.toLowerCase().match(/[a-z]/i)) return
                //just added this, to not spam sounds when the dialogue is instant
                if (speed == 0) {
                    if (c.toLowerCase().match(/[a-z]/i) && i % 25 == 0) audioHandler.play("alphabet/" + c)
                } else {
                    //audioHandler.play("wood" + Math.ceil(Math.random() * 9))
                    if (c.toLowerCase().match(/[a-z]/i) && i % 4 == 0) 
                    {
                        audioHandler.play("alphabet/" + c)

                    }
                }
                i++
            },
            strings: text,
            speed: speed,
            loop: false
        }).exec(() => {
            temp.moveToCorner()
            setTimeout(resovle, 0)
        }).go()
        })
    }

    response() {
        let randomIndex = (Math.floor(Math.random() * dataHandler.albot_data.positive.length));
        let level = dataHandler.level_data.data[dataHandler.level_state];
        let optimalTries = this.optimalTriesCalculator(level);
        let operations = dataHandler.operations;
        let didWell = operations <= optimalTries;
        this.reaction(operations, optimalTries)
        let verb = operations == 1 ? dataHandler.albot_data.first[randomIndex] : didWell ? dataHandler.albot_data.positive[randomIndex] : dataHandler.albot_data.negative[randomIndex];
        let endingMessage = didWell ? level.success_message : " " + level.fail_message;
        this.say(verb + " " + endingMessage);
    }

    optimalTriesCalculator(level) {
        if (level.type == "circle" || level.type == "array" || level.type == "rb_bst") {
            let adder = 0;
            if (level.type == "rb_bst") {
                adder = 1;
            }
            return Math.log2(level.node_count) + adder;
        } else if (level.type == "bst") {
            if (level.subtype == "find") {
                return level.node_count + 1;
            } else {
                return 999999999999999999999;
            }
        }
    }

    reaction(numberOfTries, optimalTries) {
        if (numberOfTries == 1)
            this.mood("surprised");
        else if (numberOfTries <= optimalTries)
            this.mood("happy");
        else
            this.mood("sad");

    }

}