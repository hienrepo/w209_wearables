
var chart3 = chart3();

function chart3(){  
var margin = {top: 20, right: 80, bottom: 50, left: 60},
      width = 780- margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3.select(".chart3").append("svg")
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

    d3.json("/static/data/data_summary.json", function(data) {
      var str1 = parseFloat(data['beave']).toFixed(2);
      var summary1 =  str1.concat(" Calories / hr");
      document.getElementsByClassName("chart3s2")[0].innerHTML = summary1;

      var str2 = parseFloat(data['scave']).toFixed(1);
      var summary2 =  str2.concat(" /Day");
      document.getElementsByClassName("chart3s5")[0].innerHTML = summary2;
      

});             
            

    d3.csv("/static/data/data_basal.csv", types3, function(error, data){

      y.domain(d3.extent(data, function(d){ return d.y}));
      x.domain(d3.extent(data, function(d){ return d.x}));

      var chartType = 'SBE';

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
      .text("Basal Energy Burned");      

      svg.selectAll(".point")
          .data(data)
        .enter().append("circle")
          .attr("class", "point")
          .attr("r", 5)
          .style("fill" , function(d){
            if  (d.y >= 58)
            {
              return "goldenrod";
            }
            else{
              return "wheat"
            }
            
          })
          .attr("cy", function(d){ return y(d.y); })
          .attr("cx", function(d){ return x(d.x); })
          .on("mouseover", function(d) {    
            div.transition()        
                .style("opacity", .8);    
            div.html("<p>Step Count: " + d.x + "<br/> Basal Energy Burned:" + d.y ) 
               .style("left", (d3.event.pageX) + "px")    
               .style("top", (d3.event.pageY - 28) + "px")
               .style("background" , function(){
            
            if  (d.y >= 58)
            {
              return "goldenrod";
            }
            else{
              return "wheat";
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

    svg.append("circle").attr("cx",240).attr("cy",70).attr("r", 6).style("fill", "goldenrod")
    svg.append("circle").attr("cx",240).attr("cy",85).attr("r", 6).style("fill", "wheat")
    svg.append("text").attr("x", 250).attr("y", 70).text("Above Standard Basal Energy Burnt").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 250).attr("y", 85).text("Below Standard Basal Energy Burnt").style("font-size", "12px").attr("alignment-baseline","middle")


    function types3(d){
      d.x = +d.StepCount;
      d.y = +d.BasalEnergyBurned;

      return d;
    }
}
    