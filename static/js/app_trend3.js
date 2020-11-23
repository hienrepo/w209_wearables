var trend3CsvData;
d3.csv('/static/data/heart_rate_export.csv', function(data){
	trend3CsvData = data;
});

var trend3Width = 800,
  trend3Height = 800,
  trend3Svg = d3
	.select(".trend3")
	.append("svg")
	.attr("width", trend3Width)
	.attr("height", trend3Height);

var trend3Margin = { top: 30, right: 30, bottom: 30, left: 40 },
  trend3Iwidth = trend3Width - trend3Margin.left - trend3Margin.right,
  trend3Iheight = trend3Height - trend3Margin.top - trend3Margin.bottom;

var gDrawing = trend3Svg
  .append("g")
  .attr("transform", `translate(${trend3Margin.left}, ${trend3Margin.top})`);

var trend3X = d3.scaleTime().range([0, trend3Iwidth]);
var trend3Y = d3.scaleLinear().range([trend3Iheight, 0]);

var parser = d3.timeParse("%Y-%m-%d %H:%M:%S %Z");

trend3X.domain([parser("2020-08-14 08:17:29 -0400"), parser("2020-09-14 08:17:29 -0400")]);
trend3Y.domain([0, 220]);

gDrawing
	.append("g")
	.attr("transform", `translate(0,${trend3Iheight})`)
	.call(d3.axisBottom(trend3X)
		.ticks(d3.timeDay.every(4))
		.tickFormat(function(d) {
			return d3.timeFormat("%Y-%m-%d")(d)
		}))
	.append("text")
	.style("fill", "black")
	.style("font-size", "8pt")
	.text("Elapsed time (min)")
	.attr("transform", `translate(${trend3Iwidth - 20}, ${-10})`);

gDrawing
	.append("g")
	.call(d3.axisLeft(trend3Y))
	.append("text")
	.style("fill", "black")
	.style("font-size", "8pt")
	.text("Heart rate (bpm)")
	.attr("transform", `translate(${80}, 0)`);
	
gDrawing
	.append("rect")
	.attr("fill", "808080")
	.attr("fill-opacity", "0.25")
	.attr("width", trend3Iwidth / 7.5)
	.attr("height", trend3Iheight);

function trend3Update(myData){
	document.getElementById("ageoutput").innerHTML = document.getElementById("ageinput").value;
	
	var maxrate = 220 - parseFloat(document.getElementById("ageinput").value);
	var moderatelow = Math.round(0.5 * maxrate);
	document.getElementById("moderatelow").innerHTML = moderatelow;
	var moderatehigh = Math.round(0.7 * maxrate) - 1;
	document.getElementById("moderatehigh").innerHTML = moderatehigh;
	var vigorouslow = Math.round(0.7 * maxrate);
	document.getElementById("vigorouslow").innerHTML = vigorouslow;
	var vigoroushigh = Math.round(0.85 * maxrate) - 1;
	document.getElementById("vigoroushigh").innerHTML = vigoroushigh;
	var overworkedlow = Math.round(0.85 * maxrate);
	document.getElementById("overworkedlow").innerHTML = overworkedlow;

	var marks = gDrawing.selectAll("circle").data(myData);
	
	marks.attr("fill", function(d){
			if(d.value <= moderatehigh){return "green"}
			else if(d.value < vigoroushigh){return "orange"}
			else{return "red"}
		});
	
	marks
		.enter()
		.append("circle")
		.attr("r", 1)
		.attr("cx", function(d){
			return trend3X(parser(d.startDate));
		})
		.attr("cy", function(d){
			return trend3Y(d.value);
		})
		.attr("fill", function(d){
			if(d.value <= moderatehigh){return "green"}
			else if(d.value <= vigoroushigh){return "orange"}
			else{return "red"}
		});

	marks.exit().remove();
	
	
	trend3Svg
		.on('mousemove', function() {
			if(d3.event.pageX >= trend3Margin.left + trend3Margin.right + trend3Iwidth / 15 && d3.event.pageX <= trend3Width - trend3Iwidth / 15 + 3){
				var i = Math.floor((d3.event.pageX - trend3Margin.left - trend3Margin.right) / (trend3Iwidth / 30)) - 1;
				var avgoutput = (parseFloat(trend3CsvData[i - 1].value) + parseFloat(trend3CsvData[i].value) + parseFloat(trend3CsvData[i + 1].value) + parseFloat(trend3CsvData[i + 2].value)) / 4
				document.getElementById("avgoutput").innerHTML = Math.round(avgoutput);
				
				trend3Svg.selectAll("rect").remove();
				d3.select(this)
					.append("rect")
					.attr("width", trend3Iwidth / 7.5)
					.attr("height", trend3Iheight)
					.attr("fill", "808080")
					.attr("fill-opacity", "0.25")
					// .attr("transform", "translate(" + [d3.event.pageX, trend3Margin.top] + ")")
					.attr("transform", "translate(" + [d3.event.pageX - trend3Margin.right - trend3Iwidth / 15, trend3Margin.top] + ")")
				
			}
		});
	
}

setTimeout(function() { trend3Update(trend3CsvData); }, 500);