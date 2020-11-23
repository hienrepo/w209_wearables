var summary = summary();

function summary(){

    d3.json("/static/data/data_summary.json", function(data) {

    var summary = "The tables and charts below describe your activities between "

    summary = summary.concat(data['start'])
    summary = summary.concat(" and ")
    summary = summary.concat(data['end']).concat(".").concat(" You did quite a bit in this time, with ")
    summary = summary.concat(data['rows']).concat(" health data entries recorded!")
    summary = summary.concat("It looks like you took ").concat(parseFloat(data['scave']).toFixed(1))
    summary = summary.concat(" Steps/Day in this time, amounting to an average distance of ")
    summary = summary.concat(parseFloat(data['dwave']).toFixed(1))
    summary = summary.concat(" mi per day.  Your average measured heart rate as you completed these activities was ")
    summary = summary.concat(parseFloat(data['hrave']).toFixed(1))
    summary = summary.concat("/min. That’s enough from us—Why don’t you take a look yourself?")

    document.getElementsByClassName("summary")[0].innerHTML = summary;

});  

} 