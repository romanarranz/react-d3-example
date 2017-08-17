import React from 'react';
import * as d3array from 'd3-array';
import * as d3collection from 'd3-collection';
import Histogram from './Histogram';
import PieChart from './PieChart';
import Legend from './Legend';
import './Dashboard.css';

// Wrapper class which contains 3 charts
class Dashboard extends React.Component {

	constructor(props) {
		super(props);

		this.filteredData = props.data;
		this.filteredData.forEach(d => d.total = d.freq.low + d.freq.mid + d.freq.high);

		// set initial state
		this.state = {
			fData: this.filteredData,
			pieData: this.calculateTotalFreqByState(),
			legendData: this.calculateTotalFreqByState(),
			histogramData: this.calculateTotalFreqBySegment(),
			histogramBarColor: 'steelblue'
		};

		// bind events
		this.onChildMouseOver = this.onChildMouseOver.bind(this);
		this.onChildMouseOut = this.onChildMouseOut.bind(this);
	}

	// calculate total frequency by segment for all state.
	calculateTotalFreqByState() {
		const self = this;

		var tF = ['low', 'mid', 'high'].map(function(d) {
			return {
				type: d,
				freq: d3array.sum(self.filteredData.map(function(t) {
					return t.freq[d];
				}))
			};
		});

		return tF;
	}

	// calculate total frequency by state for all segment.
	calculateTotalFreqBySegment() {
		var sF = this.filteredData.map(function(d) {
			return [d.State, d.total];
		});

		return sF;
	}

	segColor(c) {
		return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c];
	}

	onChildMouseOver(id, d) {
		const self = this;

		switch (id) {
			case 'histogram':

				// filter for selected state.
				var st = self.filteredData.filter(function(s){
					return s.State === d[0];
				})[0];

				var nD = d3collection.keys(st.freq).map(function(s){
					return {
						type: s,
						freq: st.freq[s]
					};
				});

				// call update functions of pie-chart and legend.
				self.setState({
					pieData: nD,
					legendData: nD
				});

				break;

			case 'pie':

				// call the update function of histogram with new data
				const newData = self.filteredData.map(function(v){
					return [v.State, v.freq[d.data.type]];
				});

				const newBarColor = self.segColor(d.data.type);

				self.setState({
					histogramData: newData,
					histogramBarColor: newBarColor
				});

				break;

			default:
				break;
		}
	}

	onChildMouseOut(id, d) {
		const self = this;

		switch (id) {
			case 'histogram':

				// reset pie-chart and legend.
				self.setState({
					pieData: self.calculateTotalFreqByState(),
					legendData: self.calculateTotalFreqByState()
				});

				break;

			case 'pie':

				// call the update function of histogram with all data.
				const resetData = self.filteredData.map(function(v){
					return [v.State, v.total];
				});

				self.setState({
					histogramData: resetData,
					histogramBarColor: 'steelblue'
				});

				break;

			default:
				break;
		}
	}

	render() {
		return (
			<div>
				<Histogram
					barColor={this.state.histogramBarColor}
					data={this.state.histogramData}
					onMouseOver={this.onChildMouseOver}
					onMouseOut={this.onChildMouseOut}
				/>
				<PieChart
					segColor={this.segColor}
					width={250}
					height={250}
					data={this.state.pieData}
					onMouseOver={this.onChildMouseOver}
					onMouseOut={this.onChildMouseOut}
				/>
				<Legend
					data={this.state.legendData}
					chooseColor={this.segColor}
				/>
			</div>
		);
	}
}

export default Dashboard
