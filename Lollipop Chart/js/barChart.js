
// bar chart of activities

class BarChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis() {

        let vis = this;

        console.log('here (initVis)')

        vis.margin = {top: 40, right: 20, bottom: 40, left: 50};
        vis.width = 800 - vis.margin.left - vis.margin.right;
//        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;
//        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // initialize the drawing area
        vis.svg = d3.select('#' + vis.parentElement).append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        // scales and axes
        vis.xScale = d3.scaleBand()
            .range( [ 0, vis.width ] )
            .padding(0.4);

        vis.yScale = d3.scaleLinear()
            .range( [ vis.height, 0 ] );

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale);


        // create the axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'x-axis axis')
            .attr('transform', 'translate(0, ' + vis.height + ')');

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'y-axis axis');

        this.wrangleData()

    }

    wrangleData() {

        let vis = this;

        let filteredData = []

        filteredData = vis.data

        console.log('wrangle data sees: ', vis.data)


        vis.updateVis()

    }

    updateVis() {

        let vis = this;

        // update the domains
        vis.xScale.domain(vis.data.map(function (d) { return d.activity; }));
        vis.yScale.domain( [ 0, d3.max(vis.data, function(d) {return d.value; }) ] );

        // draw the bars
        vis.bars = vis.svg.selectAll('.bar')
            .data(vis.data)

        vis.bars.exit().remove();

        vis.bars
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .merge(vis.bars)
            .transition()
            .duration(500)
            .attr('x', d => vis.xScale(d.activity) )
            .attr('y', d => vis.yScale(d.value) )
            .attr('width', vis.xScale.bandwidth() )
            .attr('height', function(d) { return vis.height - vis.yScale(d.value); })
            .attr('fill', 'orange')
            .attr('stroke', 'grey');


        // add the axes
        vis.xAxisGroup
            .transition()
            .duration(500)
            .style('font-size', '15px')
            .call(d3.axisBottom((vis.xScale)));

        vis.yAxisGroup
            .transition()
            .duration(500)
            .style('font-size', '15px')
            .call(d3.axisLeft(vis.yScale));


    }

}