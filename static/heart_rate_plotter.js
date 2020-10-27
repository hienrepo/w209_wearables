var width = 500,
  height = 500,
  svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom;

var gDrawing = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleLinear().range([0, iwidth]);
var y = d3.scaleLinear().range([iheight, 0]);
	
x.domain([0, 30]);
y.domain([0, 200]);

gDrawing
	.append("g")
	.attr("transform", `translate(0,${iheight})`)
	.call(d3.axisBottom(x))
	.append("text")
	.style("fill", "black")
	.style("font-size", "8pt")
	.text("Elapsed time (min)")
	.attr("transform", `translate(${iwidth - 20}, ${-10})`);

gDrawing
	.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.style("fill", "black")
	.style("font-size", "8pt")
	.text("Heart rate (bpm)")
	.attr("transform", `translate(${80}, 0)`);
	
gDrawing
	.append("rect")
	.attr("fill", "808080")
	.attr("fill-opacity", "0.25")
	.attr("width", iwidth / 7.5)
	.attr("height", iheight);

function update(myData){
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
			if(d.hr <= moderatehigh){return "green"}
			else if(d.hr < vigoroushigh){return "orange"}
			else{return "red"}
		});
	
	marks
		.enter()
		.append("circle")
		.attr("r", 3)
		.attr("cx", function(d){
			return x(d.min);
		})
		.attr("cy", function(d){
			return y(d.hr);
		})
		.attr("fill", function(d){
			if(d.hr <= moderatehigh){return "green"}
			else if(d.hr <= vigoroushigh){return "orange"}
			else{return "red"}
		});

	marks.exit().remove();
	
	svg
		.on('mousemove', function() {
			if(d3.event.clientX >= margin.left + margin.right + iwidth / 15 && d3.event.clientX <= width - iwidth / 15 + 3){
				var i = Math.floor((d3.event.clientX - margin.left - margin.right) / (iwidth / 30)) - 1;
				var avgoutput = (parseFloat(csvData[i - 1].hr) + parseFloat(csvData[i].hr) + parseFloat(csvData[i + 1].hr) + parseFloat(csvData[i + 2].hr)) / 4
				document.getElementById("avgoutput").innerHTML = avgoutput;
				
				d3.selectAll("rect").remove();
				d3.select(this)
					.append("rect")
					.attr("width", iwidth / 7.5)
					.attr("height", iheight)
					.attr("fill", "808080")
					.attr("fill-opacity", "0.25")
					.attr("transform", "translate(" + [d3.event.clientX - margin.right - iwidth / 15, margin.top] + ")")
			}
		});
}

var csvData;
d3.csv('./data/mydata.csv', function(data){
	csvData = data;
});

setTimeout(function() { update(csvData); }, 500);