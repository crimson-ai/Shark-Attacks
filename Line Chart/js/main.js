
console.log('getting started!')

d3.csv('data/activities-data.csv', d3.autoType).then(function(data) {

    console.table(data)

    // Instantiate the visualizations
    barChart = new BarChart('activities-bar-chart', data)

    console.log(data)


})

d3.csv('data/Attacks_Fatalities.csv', d3.autoType).then(function(data) {

    console.table(data)

    // Instantiate the visualizations

    lineChart = new LineChart('line-plot-div', data)
    console.log(data)


})

