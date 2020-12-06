var chart5CsvData;

var sampleFolder = gOptions.sampleFolder;

var dataFile = sampleFolder + 'flights_steps_export.csv';  
d3.csv(dataFile, function(data){
//d3.csv('/static/data/flights_steps_export.csv', function(data){
	chart5CsvData = data;
});

setTimeout(function() { chart5(chart5CsvData); }, 500);

function chart5(data){
	/*
	for(var i in data){
		if(i != "columns"){
			jQuery("#table8").append("<tr></tr>");
			for(var j in data[i]){
				jQuery("#table8").find("tr").last().append("<td>" + data[i][j] + "</td>");
			}
		}
	}
	*/
	
	jQuery("#FlightsMin").html(data.reduce(function(prev, curr) {
		return (parseFloat(prev.FlightsClimbed) || 0) < (parseFloat(curr.FlightsClimbed) || 0) ? prev : curr;
	}).FlightsClimbed);
	jQuery("#FlightsMean").html(data.reduce(function(r, c){
		return r + (parseFloat(c.FlightsClimbed) || 0)
	}, 0) / data.length);
	jQuery("#FlightsMax").html(data.reduce(function(prev, curr) {
		return (parseFloat(prev.FlightsClimbed) || 0) > (parseFloat(curr.FlightsClimbed) || 0) ? prev : curr;
	}).FlightsClimbed);
	jQuery("#StepsMin").html(data.reduce(function(prev, curr) {
		return (parseFloat(prev.StepCount) || 0) < (parseFloat(curr.StepCount) || 0) ? prev : curr;
	}).StepCount);
	jQuery("#StepsMean").html(data.reduce(function(r, c){
		return r + (parseFloat(c.StepCount) || 0)
	}, 0) / data.length);
	jQuery("#StepsMax").html(data.reduce(function(prev, curr) {
		return (parseFloat(prev.StepCount) || 0) > (parseFloat(curr.StepCount) || 0) ? prev : curr;
	}).StepCount);
	
	var margin = {top: 10, right: 30, bottom: 20, left: 50},
		width = 800 - margin.left - margin.right,
		height = 800 - margin.top - margin.bottom;

	var svg = d3.select(".chart5")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var columns = data.columns.slice(1);

	var groups = d3.map(data, function(d) {
		return(d.startDate)
	}).keys();

	var x = d3.scaleBand()
		.domain(groups)
		.range([0, width])
		.padding([0.2]);
	
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)
			.tickValues(x.domain().filter(function(d,i){ 
				return !(i%5);
			}))
			.tickFormat(function(d, i){
				return d.substr(5, 5);
			}));

	var y1 = d3.scaleLinear()
		.domain([0, 15])
		.range([ height, 0 ]);
		
	var y2 = d3.scaleLinear()
		.domain([0, 18000])
		.range([ height, 0 ]);
	
	var div = d3.select("body")
		.append("div") 
		.attr("class", "tooltip")
		.style("opacity", 0);  

	svg.append("g")
		.attr("class", "axisRed")
		.call(d3.axisLeft(y1))
		.append("text")
		.style("fill", "black")
		.style("font-size", "8pt")
		.text("Flights Climbed")
		.attr("transform", `translate(${80}, 0)`);
		
	svg.append("g")
		.attr("transform", "translate(720,0)")
		.attr("class", "axisBlue")
		.call(d3.axisRight(y2)
			.tickFormat(d3.formatPrefix(",.0", 1e3))
		)
		.append("text")
		.style("fill", "black")
		.style("font-size", "8pt")
		.text("Steps Walked")
		.attr("transform", `translate(${-70}, 0)`);

	var column = d3.scaleBand()
		.domain(columns)
		.range([0, x.bandwidth()])
		.padding([0.05]);

	var color = d3.scaleOrdinal()
		.domain(columns)
		.range(['#FC766A','#5B84B1'])
		
	var bgcolor = d3.scaleOrdinal()
		.domain(columns)
		.range(['#FED1CD','#DCE5EF'])
	
	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	
	svg.append("g")
		.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d) { 
			return "translate(" + x(d.startDate) + ",0)";
		})
		.selectAll("rect")
		.data(function(d) {
			return columns.map(function(key) {
				return {key: key, value: d[key], startDate: d.startDate}; 
			}); 
		})
		.enter()
		.append("rect")
		.attr("x", function(d) {
			return column(d.key); 
		})
		.attr("y", function(d) { 
			if(d.key == "FlightsClimbed"){
				return y1(d.value); 
			}
			
			if(d.key == "StepCount"){
				return y2(d.value); 
			}
		})
		.attr("width", column.bandwidth())
		.attr("height", function(d) { 
			if(d.key == "FlightsClimbed"){
				return height - y1(d.value);
			}
			if(d.key == "StepCount"){
				return height - y2(d.value); 
			}
		})
		.attr("fill", function(d) { 
			return color(d.key); 
		})
		.on("mouseover", function(d) {
			div.transition()
				.style("opacity", 1);
            div.html("<p>" + d.key + ": " + d.value + "<br />Date: " + days[new Date(d.startDate).getUTCDay()] + " " + d.startDate.substr(8, 2))
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px")
				.style("background" , function(){
					return bgcolor(d.key);
				});
		})
		.on("mouseout", function(d) {
			div.transition()
				.style("opacity", 0); 
        });
}