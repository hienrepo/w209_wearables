
var chart2 = chart2();

function chart2(){  
var margin = {top: 20, right: 80, bottom: 50, left: 60},
      width = 780- margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3.select(".chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 30 )
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);
    var div = d3.select("body").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0);  

    var sampleFolder = gOptions.sampleFolder;
    var summaryFile = sampleFolder + 'data_summary.json';
    var dataFile = sampleFolder + 'data_scatter.csv';  
    
  d3.json(summaryFile, function(data) {             

  //  d3.json("/static/data/data_summary.json", function(data) {
      var str1 = parseFloat(data['hrave']).toFixed(2);
      var summary1 =  str1.concat(" / min");
      document.getElementsByClassName("chart2s2")[0].innerHTML = summary1;

      var str2 = parseFloat(data['scave']).toFixed(1);
      var summary2 =  str2.concat(" /Day");
      document.getElementsByClassName("chart2s5")[0].innerHTML = summary2;

      description = "<b>Description:</b>The graph displays plot of Heart Rate (in bpm) with Step Count. " +
                    "X value of a data point is Step Count(sum) by hour.  " + 
                    " Y value of a data point is average Heart Rate aggregated (mean) by hour. User " +
                    "can hover over any datapoint to see the individual values . The trend line is a " +
                    " regression plot of Heart Rate based on Step Count. The regression line equation " +
                    " is displayed as a tooltip. " 

      document.getElementsByClassName("chart2s7")[0].innerHTML = description;
      

});             
    d3.csv(dataFile, types2, function(error, data){
   // d3.csv("/static/data/data_scatter.csv", types2, function(error, data){

      y.domain(d3.extent(data, function(d){ return d.y}));
      x.domain(d3.extent(data, function(d){ return d.x}));

      var chartType = 'SHR';

      // see below for an explanation of the calcLinear function
      var lg2 = calcLinear(data, "x", "y", chartType , d3.min(data, function(d){ return parseFloat(d.x)}), d3.max(data, function(d){ return parseFloat(d.x)}));

      svg.append("line")
          .attr("class", "regression")
          .attr("x1", x(lg2.ptA.x))
          .attr("y1", y(lg2.ptA.y))
          .attr("x2", x(lg2.ptB.x))
          .attr("y2", y(lg2.ptB.y))
          .on("mouseover", function(d) {    
            div.transition()        
                .style("opacity", .7);    
            div.html("</br> y = " + lg2.eqn.x + "x + " + lg2.eqn.y ) 
               .style("left", (d3.event.pageX) + "px")    
               .style("top", (d3.event.pageY - 28) + "px")
               .style("font-weight", "bold")
               .style("background" , "steelblue");  
            })          
       .on("mouseout", function(d) {    
            div.transition()      
                .style("opacity", 0); 
        });

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 30 ) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Step Count");    

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Heart Rate");      

      svg.selectAll(".point")
          .data(data)
        .enter().append("circle")
          .attr("class", "point")
          .attr("r", 5)
          .style("fill" , function(d){
            if  (d.y >= 95 &&  d.y <= 160)
            {
              return "red";
            }
            else{
              return "lightsalmon"
            }
            
          })
          .attr("cy", function(d){ return y(d.y); })
          .attr("cx", function(d){ return x(d.x); })
          .on("mouseover", function(d) {    
            div.transition()        
                .style("opacity", .8);    
            div.html("<p>Step Count: " + d.x + "<br/> Heart Rate:" + d.y ) 
               .style("left", (d3.event.pageX) + "px")    
               .style("top", (d3.event.pageY - 28) + "px")
               .style("background" , function(){
            
            if  (d.y >= 95 &&  d.y <= 160)
            {
              return "red";
            }
            else{
              return "lightsalmon";
            }
            
          }); 
            })          
       .on("mouseout", function(d) {    
            div.transition()      
                .style("opacity", 0); 
        })
       ;

    });

    svg.append('line')
    .style("stroke", "silver")
    .style("stroke-width", 3)
    .attr("x1", margin.left + 625 )
    .attr("y1", 0)
    .attr("x2", margin.left + 625 )
    .attr("y2", height);

    svg.append("circle").attr("cx",260).attr("cy",30).attr("r", 6).style("fill", "red")
    svg.append("circle").attr("cx",260).attr("cy",45).attr("r", 6).style("fill", "lightsalmon")
    svg.append("text").attr("x", 270).attr("y", 30).text("Recommended Heart Rate").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 270).attr("y", 45).text("Not Recommended Heart Rate").style("font-size", "12px").attr("alignment-baseline","middle")

    

    function types2(d){
      d.x = +d.StepCount;
      d.y = +d.HeartRate;

      return d;
    }
}
    