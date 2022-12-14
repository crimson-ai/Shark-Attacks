/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

class MapVis {
    constructor(parentElement, sharksData, geoData, data) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.sharksData = sharksData;
        this.data = data;

        // define colors
        this.colors = ['#d1fdc7', '#66c239', 'rgba(50,154,14,0.93)', '#156004'];

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width =
            document.getElementById(vis.parentElement).getBoundingClientRect().width -
            vis.margin.left -
            vis.margin.right;
        vis.height = 700 -
            vis.margin.top -
            vis.margin.bottom;

        // init drawing area
        vis.svg = d3
            .select('#' + vis.parentElement)
            .append('svg')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg
            .append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Shark Attacks Worldwide')
            .style('font-size', 25)
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // add color legend
        vis.legend = vis.svg
            .append('g')
            .attr('class', 'legend')
            .attr(
                'transform',
                `translate(${(vis.width * 2.8) / 4}, ${vis.height - 20})`
            );

        vis.legendScale = d3.scaleLinear().range([0, 160]).domain([0, 100]);

        //console.log(vis.legendScale.domain())

        vis.legendAxis = d3.axisBottom().scale(vis.legendScale).ticks(3);

        vis.legendAxisGroup = vis.legend
            .append('g')
            .attr('class', 'axis axis--legend');

        vis.legend
            .selectAll()
            .data(vis.colors)
            .enter()
            .append('rect')
            .attr('width', 40)
            .attr('height', 20)
            .attr('x', (d, i) => i * 40)
            .attr('y', -20)
            .attr('fill', (d) => d);

        vis.legendAxisGroup.call(vis.legendAxis);

        // tooltip
        vis.tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'mapTooltip');

        //d3.geoOrthographic()
        vis.rotate = [0, 0];
        vis.zoom = vis.height / 600;

        vis.projection = d3
            .geoOrthographic() // d3.geoStereographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(249.5 * vis.zoom) // 249.5 is default. so multiply that by your zoom
            .rotate(vis.rotate);

        // path provider
        vis.path = d3.geoPath().projection(vis.projection);

        vis.svg
            .append('path')
            .datum({ type: 'Sphere' })
            .attr('class', 'graticule')
            .attr('fill', '#ADDEFF')
            .attr('stroke', 'rgba(129,129,129,0.35)')
            .attr('d', vis.path);

        vis.svg
            .append('path')
            .datum(d3.geoGraticule())
            .attr('class', 'graticule')
            .attr('fill', '#ADDEFF')
            .attr('stroke', 'rgba(129,129,129,0.35)')
            .attr('d', vis.path);

        // Convert TopoJSON to GeoJSON (target object = 'states')
        let world = topojson.feature(
            vis.geoData,
            vis.geoData.objects.countries
        ).features;

        vis.countries = vis.svg
            .selectAll('.country')
            .data(world)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', vis.path);

        //
        let m0, o0;
        var scrollSpeed = 50;
        var current = 0;
        const bgscroll = () => {
            current++;
            vis.projection.rotate([vis.legendScale(current), 0]);
            vis.svg.selectAll('path').attr('d', vis.path);
        };

        let temp = setInterval(bgscroll, scrollSpeed);

        vis.svg.call(
            d3
                .drag()
                .on('start', function (event) {
                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on('drag', function (event) {
                    clearInterval(temp);
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll('.country').attr('d', vis.path);
                    d3.selectAll('.graticule').attr('d', vis.path);

                    // BONUS
                    d3.selectAll('.sharks')
                        .attr('cx', (d) => vis.projection([d.longitude, d.latitude])[0])
                        .attr('cy', (d) => vis.projection([d.longitude, d.latitude])[1]);

                    // BONUS
                    d3.selectAll('.connection')
                        .attr('x1', function (d) {
                            return vis.projection([
                                vis.sharksData.nodes[d.source].longitude,
                                vis.sharksData.nodes[d.source].latitude,
                            ])[0];
                        })
                        .attr('y1', function (d) {
                            return vis.projection([
                                vis.sharksData.nodes[d.source].longitude,
                                vis.sharksData.nodes[d.source].latitude,
                            ])[1];
                        })
                        .attr('x2', function (d) {
                            return vis.projection([
                                vis.sharksData.nodes[d.target].longitude,
                                vis.sharksData.nodes[d.target].latitude,
                            ])[0];
                        })
                        .attr('y2', function (d) {
                            return vis.projection([
                                vis.sharksData.nodes[d.target].longitude,
                                vis.sharksData.nodes[d.target].latitude,
                            ])[1];
                        });
                })
        );

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach((d) => {
            let randomCountryValue = Math.random() * 4;
            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                category: 'category_' + Math.floor(randomCountryValue),
                color: vis.colors[Math.floor(randomCountryValue)],
                value: (randomCountryValue / 4) * 100,
            };
        });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        console.log(vis.countryInfo);

        vis.countries
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .attr('fill', 'rgba(181,0,0,0.48)')
                    .attr('stroke', 'darkred');

                console.log(d);
                vis.tooltip
                    .style('opacity', 1)
                    .style('left', event.pageX + 20 + 'px')
                    .style('top', event.pageY + 'px').html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <h3>${d.properties.name}<h3>      
                         
                            <h4> Fatal Bites: ${
                    vis.data.filter(
                        (item) =>
                            item.fatal === 'Yes' &&
                            item.country?.toLowerCase() ===
                            vis.countryInfo[
                                d.properties.name
                                ].name.toLowerCase()
                    ).length
                }</h4>    
                             <h4>Non-Fatal Bites: ${
                    vis.data.filter(
                        (item) =>
                            item.fatal === 'No' &&
                            item.country?.toLowerCase() ===
                            vis.countryInfo[
                                d.properties.name
                                ].name.toLowerCase()
                    ).length
                }</h4>  
                                 <h4> Total Bites: ${
                    vis.data.filter(
                        (item) =>
                            (item.fatal === 'Yes' ||
                                item.fatal === 'No') &&
                            item.country?.toLowerCase() ===
                            vis.countryInfo[
                                d.properties.name
                                ].name.toLowerCase()
                    ).length
                }</h4>                
                        </div>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('fill', (d) => vis.countryInfo[d.properties.name].color)
                    .attr('stroke', 'transparent');

                vis.tooltip
                    .style('opacity', 0)
                    .style('left', 0 + 'px')
                    .style('top', 0 + 'px');
            })
            .transition()
            .duration(500)
            .attr('fill', (d) => vis.countryInfo[d.properties.name].color);
    }
}