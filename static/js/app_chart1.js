var chart1 = chart1();

function chart1(){  




    var margin = {top: 20, right: 80, bottom: 50, left: 60},
      width = 780- margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3.select(".chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 30 )
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear().range([height, 0]);

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

 //   d3.json("/static/data/data_summary.json", function(data) {
    d3.json(summaryFile, function(data) {
      var str1 = parseFloat(data['hrave']).toFixed(2);
      var summary1 =  str1.concat(" / min");
      document.getElementsByClassName("chart1s2")[0].innerHTML = summary1;

      var str2 = parseFloat(data['dwave']).toFixed(1);
      var summary2 =  str2.concat(" Miles/Day");
      document.getElementsByClassName("chart1s5")[0].innerHTML = summary2;

});  



    console.log(dataFile);        
    d3.csv(dataFile, types, function(error, data){
   // d3.csv("/static/data/data_scatter.csv", types, function(error, data){

      y.domain(d3.extent(data, function(d){ return d.y}));

      x.domain(d3.extent(data, function(d){ return d.x}));

      var chartType = 'DHR';
      // see below for an explanation of the calcLinear function
      var lg = calcLinear(data, "x", "y", chartType , d3.min(data, function(d){ return parseFloat(d.x)}), d3.max(data, function(d){ return parseFloat(d.x)}));

      svg.append("line")
          .attr("class", "regression")
          .attr("x1", x(lg.ptA.x))
          .attr("y1", y(lg.ptA.y))
          .attr("x2", x(lg.ptB.x))
          .attr("y2", y(lg.ptB.y))
          .on("mouseover", function(d) {    
            div.transition()        
                .style("opacity", .8);    
            div.html("</br> y = " + lg.eqn.x + "x + " + lg.eqn.y ) 
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
          .call(xAxis);

      svg.append("g")
      .call(d3.axisLeft(y))
      ;    

      svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 30 ) + ")")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Distance in miles");

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
              return "green";
            }
            else{
              return "lightgreen"
            }
            
          })
          .attr("cy", function(d){ return y(d.y); })
          .attr("cx", function(d){ return x(d.x); })
          .on("mouseover", function(d) {    
            div.transition()        
                .style("opacity", .8);    
            div.html("<p> Walking Running Distance: " + d.x + "<br/> Heart Rate:" + d.y ) 
               .style("left", (d3.event.pageX) + "px")    
               .style("top", (d3.event.pageY - 28) + "px")
               .style("background" , function(){
            
            if  (d.y >= 95 &&  d.y <= 160)
            {
              return "green";
            }
            else{
              return "lightgreen";
            }
            
          }); 
            })          
       .on("mouseout", function(d) {    
            div.transition()      
                .style("opacity", 0); 
        })
       ;

    });

    svg.append("circle").attr("cx",260).attr("cy",30).attr("r", 6).style("fill", "green")
    svg.append("circle").attr("cx",260).attr("cy",45).attr("r", 6).style("fill", "lightgreen")
    svg.append("text").attr("x", 270).attr("y", 30).text("Recommended Heart Rate").style("font-size", "12px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 270).attr("y", 45).text("Not Recommended Heart Rate").style("font-size", "12px").attr("alignment-baseline","middle")

    svg.append('line')
    .style("stroke", "silver")
    .style("stroke-width", 3)
    .attr("x1", margin.left + 625 )
    .attr("y1", 0)
    .attr("x2", margin.left + 625 )
    .attr("y2", height);

    

    function types(d){
      //d.x = +d.HeartRate;
      //d.y = +d.DistanceWalkingRunning;
      d.x = +d.DistanceWalkingRunning;
      d.y = +d.HeartRate;
      return d;
    }
 }

    function calcLinear(data, x, y, chartType, minX, maxX){
      // Let n = the number of data points
      var n = data.length;

      // Get just the points
      var pts = [];
      data.forEach(function(d,i){
        var obj = {};
        obj.x = d[x];
        obj.y = d[y];
        obj.mult = obj.x*obj.y;
        pts.push(obj);
      });

      var sum = 0;
      var xSum = 0;
      var ySum = 0;
      var sumSq = 0;
      pts.forEach(function(pt){
        sum = sum + pt.mult;
        xSum = xSum + pt.x;
        ySum = ySum + pt.y;
        sumSq = sumSq + (pt.x * pt.x);
      });
      var a = sum * n;
      var b = xSum * ySum;
      var c = sumSq * n;
      var d = xSum * xSum;
      var m = (a - b) / (c - d);
      var e = ySum;

      var f = m * xSum;
      var b = (e - f) / n;


      // Print the equation below the chart
      
      if (chartType==="DHR"){
        if (m > 0){
          document.getElementsByClassName("chart1s6")[0].innerHTML = "Heart Rate increases with Distance Walked/Run";
        }
        else{
          document.getElementsByClassName("chart1s6")[0].innerHTML = "Heart Rate decreases with Distance Walked/Run";
        }
      }  

      
      
      else if (chartType==="SHR"){
        if (m>0){
            document.getElementsByClassName("chart2s6")[0].innerHTML = "Heart Rate increases with Step Count";
        }
        else{
            document.getElementsByClassName("chart2s6")[0].innerHTML = "Heart Rate decreases with Step Count";
        }

        
      }



      else  if (chartType==="SBE"){
        if (m>0){
            document.getElementsByClassName("chart3s6")[0].innerHTML = "Basal Energy Burnt increases with Step Count";
        }
        else{
            document.getElementsByClassName("chart3s6")[0].innerHTML = "Basal Energy Burnt decreases with Step Count";
        }
        
      }



      else{
        if (m>0){
            document.getElementsByClassName("chart4s6")[0].innerHTML = "Basal Energy Burnt increases with Distance Walked/Run";
        }
        else{
            document.getElementsByClassName("chart4s6")[0].innerHTML = "Basal Energy Burnt increases with Distance Walked/Run";
        }
        
      }
      
      //document.getElementsByClassName("equation1")[0].innerHTML = "y = " + m + "x + " + b;
      //  document.getElementsByClassName("equation1")[1].innerHTML = "x = ( y - " + b + " ) / " + m;
     
      // return an object of two points
      // each point is an object with an x and y coordinate

      return {
        ptA : {
          x: minX,
          y: m * minX + b
        },
        ptB : {
          x: maxX,
          y: m*maxX + b
        },
        eqn : {
          x: m,
          y: b
        }
      }


    }


    