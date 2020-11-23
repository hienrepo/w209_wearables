//var svg = d3.select("svg"),
var trend2 = trend2();

function trend2(){ 

var margin = {top: 10, right: 30, bottom: 90, left: 30},
    margin2 = {top: 330, right: 30, bottom: 10, left: 30},
    width = 700 - margin.left - margin.right,
    height = 380 - margin.top - margin.bottom,
    height2 = 380- margin2.top - margin2.bottom;

var svg = d3.select(".trend2").append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height", height + margin.top + margin.bottom + 30 )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

var lineOpacity = 1;
var lineStroke = "5px";
var parseTime = d3.timeParse("%m/%d/%y");
var dateFormater = d3.timeFormat("%m/%d/%y")
time_unit_value = 1 ;
var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);


var xAxis = d3.axisBottom(x)
    .ticks(d3.timeDay.every(4))
    .tickFormat(function(d) {
    return d3.timeFormat("%d-%m")(d)
  }),
    xAxis2 = d3.axisBottom(x2)
    .ticks(d3.timeDay.every(4))
    .tickFormat(function(d) {
    return d3.timeFormat("%d-%m")(d)
  }),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var step = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.step); });

           

var step2 = d3.line()
    .x(function (d) { return x2(d.date); })
    .y(function (d) { return y2(d.step); });
 
      

var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0); 


var Line_chart = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("clip-path", "url(#clip)");  


var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");  

var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

d3.csv("/static/data/data_trend.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.step = d.StepCount ;
      
  });
  

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function (d) { return parseFloat(d.step); })]);
  x2.domain(x.domain());
  y2.domain(y.domain());



focus.append("g")
    .attr("class", "axis-x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

focus.append("g")
    .attr("class", "axis-y")
    .call(yAxis);

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -20 )
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "ylabel")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Step Count");
svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 30 ) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Date");         


Line_chart.append("path")
    .datum(data)
    .attr("class", "step")
    .attr("d", step);

    

context.append("path")
    .datum(data)
    .attr("class", "step")
    .attr("d", step2);



context.append("g")
    .attr("class", "axis-x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());



svg.append("rect")
  .attr("class", "zoom")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(zoom);



// tooltip starts here  

mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");  

mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line1")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");   


 mouseG.append('svg:rect') 
      .data(data)
      .attr("class", "mouse-area")
      .attr('width', width ) 
      .attr('height', height  )
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr("x", margin.left)
      .attr("y", margin.top)
      .on('mouseout', function() { // on mouse out hide line, 
        d3.select(".mouse-line1")
          .style("opacity", "0"); 
        div.transition()        
                .style("opacity", "0");     
       
      })
      .on('mouseover', function(d) { 
        d3.select(".mouse-line1")
          .style("opacity", "1");
        div.transition()        
                .style("opacity", "0.8");   
        
      })
      .on('mousemove', function(d) { // mouse moving over canvas
        var mouse = d3.mouse(this);
        var inpDate = x.invert(mouse[0] - margin.left);
        var xDate =  parseTime(dateFormater(inpDate ));
        var bisect = d3.bisector(function (d) { return d.date; }).left // retrieve row index of date on parsed csv
        var idx = bisect(data, xDate);
         var step = data[idx]['step']

        d3.select(".mouse-line1")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + (height + margin.top);
            d += " " + mouse[0] + "," + margin.top;
            return d;
          });
             
            div.html("<p> <span style=color:red>  Step Count: " + parseFloat(step).toFixed(5)  + 
              " Miles</span><br/> Date:" + d3.timeFormat("%a %d")(xDate)  
              ) 
               .style("left", (d3.event.pageX + 10) + "px")    
               .style("top", (d3.event.pageY - 10) + "px");
             

         }); 


})
;



function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  Line_chart.select(".step").attr("d", step);
  focus.select(".axis-x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  Line_chart.select(".step").attr("d", step);
  focus.select(".axis-x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.date = parseTime(d.date);
  d.total = +d.step;
  return d;
}
}



