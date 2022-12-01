
// bar chart of shark population decline
// author: Ryan Abbate

class PopulationDecline {

    constructor(parentElement, data, chartTitle) {
        this.parentElement = parentElement;
        this.data = data;

        this.chartTitle = chartTitle;

        this.initVis()
    }

    initVis() {

        let vis = this;

        console.log('here (initVis)')

        vis.margin = {top: 70, right: 90, bottom: 90, left: 80};
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

        // add chart title
        vis.svg.append('g')
            .attr('class', 'title bar-chart-title')
            .append('text')
            .text(vis.chartTitle)
            .attr('transform', `translate(${vis.width / 2 + 45}, -50)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('id', 'barChartTooltip');


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
            .text('Shark Population (%)')
            .style('font-size', 20)
            .style('font-weight', 600)
            .style('fill', '#456983');

        // horizontal axis
        vis.svg.append('text')
            .attr('x', vis.width - 35)
            .attr('y', vis.height + 50)
            .text('Species')
            .style('font-size', 20)
            .style('font-weight', 600)
            .style('fill', '#456983');

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
        vis.xScale.domain(vis.data.map(function (d) { return d.species; }));
        vis.yScale.domain( [ 0, 100 ] );

        // draw the bars
        vis.bars = vis.svg.selectAll('.bar')
            .data(vis.data)

        vis.bars.exit().remove();

        vis.bars
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(d.species))
            .attr('y', d => vis.yScale(vis.height))
            .attr('width', vis.xScale.bandwidth())
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'grey')
                    .attr('fill', '#456983')

                vis.tooltip
                    .style('opacity', 1)
                    .style('left', event.pageX + 20 + 'px')
                    .style('top', event.pageY + 'px')
                    .html(`
                    <div style='border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px'>
                    <h3>${d.species}</h3>
                    <h4> ${100- d.plotValue.toLocaleString()}% decline </h4>
                    </div>
                                        
                    `)

            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#456983')
                    .attr('fill', function(d) {
                        return 'crimson'
                    })

                vis.tooltip
                    .style('opacity', 0)
                    .style('left', 0)
                    .style('top', 0)
                    .html(``);

            })
            .merge(vis.bars)
            .transition()
            .duration(2000)
            .attr('y', d => vis.yScale(d.plotValue) )
            .attr('height', function(d) { return vis.height - vis.yScale(d.plotValue); })
            .attr('fill', 'crimson')
//            .attr('stroke', 'grey');


        // add the axes
        vis.xAxisGroup
            .transition()
            .duration(500)
            .style('font-size', '15px')
            .style('color', '#456983')
            .call(d3.axisBottom((vis.xScale)))
            .selectAll('text')
            .attr('y', 30)
            .attr('x', -35)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(-30)')
        ;

        vis.yAxisGroup
            .transition()
            .duration(500)
            .style('font-size', '15px')
            .style('color', '#456983')
            .call(d3.axisLeft(vis.yScale));

        vis.text = vis.svg.selectAll('.text')
            .data(vis.data)

        vis.text
            .enter()
            .append('text')
            .attr('class', 'text')
            .attr('text-anchor', 'middle')
            .attr('x', d => vis.xScale(d.species) + 27)
            .attr('y', d => vis.yScale(d.plotValue) - 10)
            .text( function (d) {
                return '-' + (100 - d.plotValue) + '%';
            })
            .style('font-weight', 600)
            .style('fill', 'red')

    }

}