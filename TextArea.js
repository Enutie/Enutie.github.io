

class TextArea { //should be called codearea instead probably

    constructor(code ) {
        
        
        code.forEach((d, i) => d.id = i)
        this.text_areas = code
        
        //this.text_areas = [{text: "insert (node, root) {", id: 0, static: true}, {text: user_code, id: 1, editable: true}, {text: "}", id: 2, static: true}]
        this.placeHolderText = "Enter code here..."
        this.z = 500
    }

    delete() {

        if (this.ele) 
        {
            this.text = this.getText()
            this.ele.remove()
        }
    }

    getText() {
        d3.selectAll(".editable").nodes().forEach(d => {
            
            d3.select(d).datum().text = d.innerText

        })
        //d3.selectAll(".editable").nodes().forEach(d => console.log(d3.select(d).data()))
        var text = this.text_areas.reduce((str, element) => {return str + element.text + "\n"}, "")
        return text;
    }


    draw() {
        //this.delete();

        if (!this.ele) {
            this.ele = d3.select("div")
            .append("pre")
            .attr("class", "textarea")
            .datum(this)
            .style("position", "absolute")
            .style("left", "80%")
            .style("top", "18%")
        }
        var temp = this
        

        
        this.textarea = this.ele
            .selectAll(".textarea")
            .data(this.text_areas, d => d.id)
            .join(
                enter => enter.append("code")
                //.style("font size", 5)
                .style("background-color", d => {
                    if (d.editable) {return "lightgreen"}
                    else {return "rgba(250, 250, 250, 0.5)"}
                })
                .attr("contenteditable", d => d.editable)
                .attr("innerText", function(d) {
                    this.innerText = d.text;
                }))
                .attr("class", d => {
                    if (d.editable)
                    {
                        return "editable"
                    }
                    else {
                        return "uneditable"
                    }
                })
        //this.textarea.attr("pointer-events", "none");
        
        
        /* this.textarea = this.ele.append("pre")
                .append("code")
                .attr("class", "textarea")
                .attr("contenteditable", "true")
                .each(function (d) {
                    this.innerText = temp.text;
                })
            
             this.ele   .append("pre")
                .append("code")
                .attr("class", "textarea")
                .each(function (d) {
                    this.innerText = "}";
                })*/
        
        if (this.button) this.button.remove();
        this.button = this.ele.append("button")
            .style("padding", "15px 32px")
            .attr("innerText", "hey")
            .attr("content", "Execute")
            .attr("onclick", "clickedExecuteCode()") 

        /* console.log(hljs.getLanguage('js').k) */
            
        //this.textarea.node().addEventListener('keyup', (event) => {hljs.highlightBlock(this.textarea.node())} ) // doesnt work properly
        //hljs.highlightBlock(this.textarea.node())

        d3.selectAll("pre code").nodes().forEach(element => {
            hljs.highlightBlock(element)
        });

    }
}