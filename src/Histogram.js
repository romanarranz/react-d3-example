import React from 'react';
import * as d3array from 'd3-array';
import * as d3scale from 'd3-scale';
import * as d3selection from 'd3-selection';
import { format } from 'd3-format';
import { axisBottom } from 'd3-axis';

class Histogram extends React.Component {

	constructor(props) {
		super(props);
		this.dim = {
			t: 60,
			r: 0,
			b: 30,
			l: 0
		}
		this.dim.w = 500 - this.dim.l - this.dim.r;
		this.dim.h = 300 - this.dim.t - this.dim.b;

		this.svg = null;

		// create function for x-axis mapping.
		const self = this;
		this.x = d3scale.scaleBand().rangeRound([0, self.dim.w]).paddingInner([0.1]).domain(self.props.data.map(function(d){
			return d[0];
		}));

		// Create function for y-axis map
		this.y = d3scale.scaleLinear().range([self.dim.h, 0]).domain([0, d3array.max(self.props.data, function(d){
			return d[1];
		})]);

		// bind events
		this.createChart = this.createChart.bind(this);
	}

	componentDidMount() {
		this.createChart();
	}

	componentDidUpdate() {
		if (this.svg) {
			const self = this;
			const nD = this.props.data;
			const color = this.props.barColor;

			// update the domain of the y-axis map to reflect change in frequencies.
			self.y.domain([0, d3array.max(nD, function(d) {
				return d[1];
			})]);


			// Attach the new data to the bars.
			var bars = self.svg.selectAll(".bar").data(nD);

			// transition the height and color of rectangles.
			bars
				.select("rect")
				.transition()
				.duration(500)
				.attr("y", function(d) {
					return self.y(d[1]);
				})
				.attr("height", function(d) {
					return self.dim.h - self.y(d[1]);
				})
				.attr("fill", color);

			// transition the frequency labels location and change value.
			bars
				.select("text")
				.transition()
				.duration(500)
				.text(function(d) {
					return format(",")(d[1])
				})
				.attr("y", function(d) {
					return self.y(d[1]) - 5;
				});
		}
	}

	createChart() {
		const self = this;
		const node = this.node;

		var dim = this.dim;

		// create svg
		var svg = d3selection.select(node).append('g')
			.attr('transform', `translate(${dim.l},${dim.t})`);

		var hD = this.props.data;

		// Add x-axis to the histogram svg.
		svg
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0,${dim.h})`)
			.call(axisBottom(self.x));

		// Create bars for histogram to contain rectangles and freq labels
		var bars = svg
			.selectAll('.bar')
			.data(hD)
			.enter()
			.append('g')
				.attr('class', 'bar');

		// create the rectangles
		bars.append('rect')
			.attr('x', function(d){
				return self.x(d[0]);
			})
			.attr('y', function(d){
				return self.y(d[1]);
			})
			.attr('width', self.x.bandwidth())
			.attr('height', function(d){
				return self.dim.h - self.y(d[1]);
			})
			.attr('fill', self.props.barColor)
			.on('mouseover', function(d){
				self.props.onMouseOver('histogram', d);
			})
			.on('mouseout', function(d){
				self.props.onMouseOut('histogram', d);
			});

		// create the frequency labels above the rectangles
		bars.append('text').text(function(d){
			return format(',')(d[1]);
		})
		.attr('x', function(d){
			return self.x(d[0]) + self.x.bandwidth() / 2;
		})
		.attr('y', function(d){
			return self.y(d[1]) - 5;
		})
		.attr('text-anchor', 'middle');

		this.svg = svg;
	}

	render() {
		return (
			<svg
				ref={node => this.node = node}
				width={this.dim.w + this.dim.l + this.dim.r}
				height={this.dim.h + this.dim.t + this.dim.b}
			/>
		);
	}
}

export default Histogram
