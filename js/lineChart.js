
// line chart of human fatalities, provoked and unprovoked bites
// author:  Ryan Abbate

class LineChart {

    constructor(parentElement, data, chartTitle) {
        this.parentElement = parentElement;
        this.data = data;

        this.chartTitle = chartTitle;

        this.initVis()
    }

    initVis() {

        let vis = this;

        vis.metricType = 'Fatalities';

        console.log('here (initVis)')

        vis.margin = {top: 80, right: 90, bottom: 90, left: 80};
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
        vis.xScale = d3.scaleLinear()
            .range( [ 0, vis.width ] );

        vis.yScale = d3.scaleLinear()
            .range( [ vis.height, 0 ] );

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale);

        // add chart title
        vis.svg.append('g')
            .attr('class', 'title line-chart-title')
            .append('text')
            .text(vis.chartTitle)
            .attr('transform', `translate(${vis.width / 2 + 45}, -50)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('id', 'lineChartTooltip');


        // create the axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'x-axis axis')
            .attr('transform', 'translate(0, ' + vis.height + ')');

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'y-axis axis');


        // create axis labels

        // vertical axis
        vis.svg.append('text')
            .attr('x', -65)
            .attr('y', -20)
            .text('Count')
            .style('font-size', 20)
            .style('font-weight', 600)
            .style('fill', '#456983');

        // horizontal axis
        vis.svg.append('text')
            .attr('x', vis.width - 35)
            .attr('y', vis.height + 50)
            .text('Year')
            .style('font-size', 20)
            .style('font-weight', 600)
            .style('fill', '#456983');

        this.wrangleData()

    }

    wrangleData() {

        let vis = this;

        let filteredData = []

        vis.metricType = metricType;

        filteredData = vis.data.map


        console.log('wrangle data sees: ', vis.data)


        vis.updateVis()

    }

    updateVis() {

        let vis = this;

        // update the domains
        vis.xScale.domain([ d3.min(vis.data, function(d) {return d.Year; }), d3.max(vis.data, function(d) {return d.Year }) ]);
        vis.yScale.domain( [ 0, d3.max(vis.data, function(d) {return d[vis.metricType]; }) ] );

        // draw the line
        vis.line = vis.svg.selectAll('.line')
            .data(vis.data)

        vis.line.exit().remove();

        // draw the line
        vis.line
            .enter()
            .append('path')
            .attr('class', 'line')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'grey')
                    .attr('fill', '#c95151')

                vis.tooltip
                    .style('opacity', 1)
                    .style('left', event.pageX + 20 + 'px')
                    .style('top', event.pageY + 'px')
                    .html(`
                    <div style='border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px'>
                    <h3>${d.Year}</h3>
                    <h4> ${d.Unprovoked.toLocaleString()} </h4>
                    </div>
                                        
                    `)

            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#456983')
                    .attr('fill', function(d) {
                        return '#456983'
                    })

                vis.tooltip
                    .style('opacity', 0)
                    .style('left', 0)
                    .style('top', 0)
                    .html(``);

            })
            .merge(vis.line)
            .datum(vis.data)
            .transition()
            .duration(500)
            .attr('d', d3.line()
                .x(function (d) { return vis.xScale(d.Year); })
                .y(function (d) { return vis.yScale(d[vis.metricType]); })
                .curve(d3.curveMonotoneX)
            );


        // add the axes
        vis.xAxisGroup
            .transition()
            .duration(500)
            .style('font-size', '15px')
            .style('color', '#456983')
            .call(d3.axisBottom((vis.xScale)).tickFormat(d3.format('')))
            .selectAll('text')
            .attr('y', 20)
            .attr('x', 0)
            .attr('dy', '.35em')

//            .attr('transform', 'rotate(-30)')
        ;

        vis.yAxisGroup
            .transition()
            .duration(500)
            .style('font-size', '15px')
            .style('color', '#456983')
            .call(d3.axisLeft(vis.yScale));

        vis.circles = vis.svg.selectAll('circle')
            .data(vis.data);

        vis.circles.exit().remove();

        vis.circles
            .enter()
            .append('circle')
            .merge(vis.circles)
            .transition()
            .duration(500)
            .attr('fill', 'crimson')
            .attr('stroke', '#456983')
            .attr('cx', function(d) { return vis.xScale(d.Year); })
            .attr('cy', function(d) { return vis.yScale(d[vis.metricType]); })
            .attr('r', 4);



    }

}