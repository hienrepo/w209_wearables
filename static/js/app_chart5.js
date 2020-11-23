var chart5CsvData;
d3.csv('/static/data/flights_steps_export.csv', function(data){
	chart5CsvData = data;
});

setTimeout(function() { chart5(chart5CsvData); }, 500);

function chart5(data){
	for(var i in data){
		if(i != "columns"){
			jQuery("#table8").append("<tr></tr>");
			for(var j in data[i]){
				jQuery("#table8").find("tr").last().append("<td>" + data[i][j] + "</td>");
			}
		}
	}
	
	var margin = {top: 10, right: 30, bottom: 20, left: 50},
		width = 700 - margin.left - margin.right,
		height = 700 - margin.top - margin.bottom;

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
		.call(d3.axisBottom(x).tickSize(0));

	var y1 = d3.scaleLinear()
		.domain([0, 15])
		.range([ height, 0 ]);
		
	var y2 = d3.scaleLinear()
		.domain([0, 18000])
		.range([ height, 0 ]);

	svg.append("g")
		.call(d3.axisLeft(y1));
		
	svg.append("g")
		.attr("transform", "translate(620,0)")
		.call(d3.axisRight(y2).tickFormat(d3.formatPrefix(",.0", 1e3)));

	var column = d3.scaleBand()
		.domain(columns)
		.range([0, x.bandwidth()])
		.padding([0.05])

	var color = d3.scaleOrdinal()
		.domain(columns)
		.range(['#e41a1c','#377eb8'])

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
				return {key: key, value: d[key]}; 
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
		});
}