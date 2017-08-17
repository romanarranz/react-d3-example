import React from 'react';
import * as d3shape from 'd3-shape';
import * as d3selection from 'd3-selection';
import * as d3interpolate from 'd3-interpolate';
import * as d3transition from 'd3-transition';

class PieChart extends React.Component {

	constructor(props) {
		super(props);

		this.dim = {
			w: this.props.width,
			h: this.props.height,
			r: Math.min(this.props.width, this.props.height) / 2
		}

		this.svg = null;

		// create function to draw the arcs of the pie slices.
		this.arc = d3shape.arc().outerRadius(this.dim.r - 10).innerRadius(0);

		// create a function to compute the pie slice angles.
		this.pie = d3shape.pie().sort(null).value(function(d){
			return d.freq;
		});

		// bind events
		this.createChart = this.createChart.bind(this);
	}

	componentDidMount() {
		this.createChart();
	}

	componentDidUpdate() {
		const self = this;

		if(self.svg) {
			const nD = self.props.data;

			// Animating the pie-slice requiring a custom function which specifies
			// how the intermediate paths should be drawn.
			var arcTween = function(a){

				var i = d3interpolate.interpolate(this._current, a);
				this._current = i(0);
				return function(t) {
					return self.arc(i(t));
				};
			};

			self.svg
				.selectAll('path')
				.data(self.pie(nD))
				.transition()
				.duration(500)
				.attrTween('d', arcTween);
		}
	}

	createChart() {
		const self = this;
		const node = this.node;
		const pD = this.props.data;

		// create svg
		var svg = d3selection.select(node).append('g')
			.attr('transform', `translate(${self.dim.w / 2},${self.dim.h / 2})`);

		// draw the pie slices.
		svg
			.selectAll('path')
			.data(self.pie(pD))
			.enter()
				.append('path')
				.attr('d', self.arc)
				.each(function(d){
					this._current = d
				})
				.style('fill', function(d){
					return self.props.segColor(d.data.type)
				})
				.on('mouseover', function(d){
					self.props.onMouseOver('pie', d);
				})
				.on('mouseout', function(d){
					self.props.onMouseOut('pie', d);
				});

		self.svg = svg;
	}

	render() {
		return (
			<svg
				ref={node => this.node = node}
				width={this.props.width}
				height={this.props.height}
			/>
		)
	}
}

export default PieChart
