
var summary = summary();

function summary(){  

var margin = {top: 5, right: 5, bottom: 50, left: 35},
      width = 400 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%Y-%m-%d");

    var svg = d3.select(".summary").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom  )
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append('line')
    .style("stroke", "silver")
    .style("stroke-width", 3)
    .attr("x1", margin.left )
    .attr("y1", 0)
    .attr("x2", margin.left  )
    .attr("y2", height);

d3.json("/static/data/data_summary.json", function(data) {
    document.getElementsByClassName("summaryc1")[0].innerHTML = data['rows'];
    document.getElementsByClassName("summaryc2")[0].innerHTML = data['start'] + " to " + data['end'];
    document.getElementsByClassName("summaryc3")[0].innerHTML = parseFloat(data['hrave']).toFixed(2);
    document.getElementsByClassName("summaryc4")[0].innerHTML = parseFloat(data['scave']).toFixed(2);
    document.getElementsByClassName("summaryc5")[0].innerHTML = parseFloat(data['dwave']).toFixed(2) + " Miles";
});
    
}
    