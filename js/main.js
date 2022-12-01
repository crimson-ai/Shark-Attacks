console.log('getting started on the final project!')

let promises = [
    d3.csv('data/activities-data.csv', d3.autoType),
    d3.csv('data/attacks-fatalities.csv', d3.autoType),
    d3.csv('data/odds.csv', d3.autoType),
    d3.json('data/sharks.json'),
    d3.json('data/world-110m.json'),
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'),
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'),
    d3.csv('data/shark-bite-type.csv', d3.autoType),
    d3.csv('data/shark-population-decline.csv', d3.autoType),
    d3.csv('data/shark-encounters.csv')

];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });


function createVis(data) {
    let barChartData = data[0]
    let lineChartData = data[7]
    let populationDeclineData = data[8]

    console.log('logging bar chart data', barChartData)
    console.log('logging line chart data', lineChartData)
    console.log('logging population decline data', populationDeclineData)

    let geoData = data[5]
    let sharksData = data[3]

    console.log(data)

    // Instantiate the visualizations
    barChart = new BarChart('activities-bar-chart', barChartData, 'What were people doing when they were bitten by a shark?');
    lineChart = new LineChart('line-plot-div', lineChartData, 'Human Fatalities Since 1900');
    populationDeclineChart = new PopulationDecline('shark-population-decline-plot', populationDeclineData, 'Declines in Shark Populations Since 1985')

    myMapVis = new MapVis('map-div', sharksData, geoData, data[9])

//    lollipopChart = new LollipopChart('foo-div', lollipopChartData);

}


function brushed() {

    // Gets the extent of the current brush
    let selectionRange = d3.brushSelection(d3.select('.brush').node());

    //


}


let metricType = document.getElementById('metric-type').value;

function updateMetric() {

    metricType = document.getElementById('metric-type').value;

    lineChart.wrangleData();

    console.log('logging metric type', metricType);

//            vis.data.sort( ( a, b) => b.Year - a.Year);
}




//d3.csv('data/activities-data.csv', d3.autoType).then(function(data) {

//    console.table(data)

//    // Instantiate the visualizations
//    barChart = new BarChart('activities-bar-chart', data)

    //lineChart = new LineChart('line-plot-div', data)

//    console.log(data)


//})

