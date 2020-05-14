const color = d3.scaleOrdinal(d3.schemeCategory10);

var scheme = d3.scaleLinear().domain([0,100]).range(["#4484CE", "#94618e"])

function setScheme(range){
    this.scheme = d3.scaleLinear().domain([0,range]).range(["#4484CE", "#94618e"]);
}