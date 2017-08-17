import React from 'react';
import * as d3array from 'd3-array';
import * as d3selection from 'd3-selection';
import { format } from 'd3-format';

class Legend extends React.Component {

	constructor(props) {
		super(props);

		this.legend = null;

		// bind events
		this.createLegend = this.createLegend.bind(this);
	}

	componentDidMount() {
		this.createLegend();
	}

	componentDidUpdate() {
		if (this.legend) {
			const self = this;
			const nD = this.props.data;

			// update the data attached to the row elements.
			var l = self.legend.select('tbody').selectAll('tr').data(nD);

			// update the frequencies.
			l.select('.legendFreq').text(function(d) {
				return format(',')(d.freq);
			});

			// update the percentage column.
			l.select('.legendPerc').text(function(d) {
				return self.getLegend(d, nD);
			});
		}
	}

	createLegend() {
		const self = this;
		const node = this.node;
		const lD = this.props.data;

		var legend = d3selection.select(node);

		// create one row per segment.
		var tr = legend
			.append('tbody')
				.selectAll('tr')
				.data(lD)
				.enter()
					.append('tr');

		// create the first column for each segment
		tr
			.append('td')
				.append('svg')
					.attr('width', '16')
					.attr('height', '16')
					.append("rect")
						.attr('width', '16')
						.attr('height', '16')
						.attr('fill', function(d){
							return self.props.chooseColor(d.type);
						});

		// create the second column for each segment.
		tr
			.append('td')
				.text(function(d){
					return d.type;
				});


		// create the third column for each segment.
		tr
			.append('td')
				.attr('class', 'legendFreq')
				.text(function(d) {
					return format(',')(d.freq);
				});

		// create the fourth column for each segment.
		tr
			.append('td')
				.attr('class', 'legendPerc')
				.text(function(d) {
					return self.getLegend(d, lD);
				});

		this.legend = legend;
	}

	// Utility function to compute percentage.
	getLegend(d, aD) {
		return format('%')(d.freq / d3array.sum(aD.map(function(v) {
			return v.freq;
		})));
	}

	render() {
		return (
			<table
				ref={node => this.node = node}
				className='legend' />
		);
	}
}

export default Legend
