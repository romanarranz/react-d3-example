import React from 'react'
import Dashboard from './Dashboard'
import './App.css'

class App extends React.Component {
	constructor(props){
		super(props)
		this.onResize = this.onResize.bind(this)
		this.state = { screenWidth: 1000, screenHeight: 800, hover: 'none' }
	}

	onResize() {
		this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120 })
	}

	componentDidMount() {
		window.addEventListener('resize', this.onResize, false)
		this.onResize()
	}

	render() {
		const freqData=[
			{State:'AL',freq:{low:4786, mid:1319, high:249}},
			{State:'AZ',freq:{low:1101, mid:412, high:674}},
			{State:'CT',freq:{low:932, mid:2149, high:418}},
			{State:'DE',freq:{low:832, mid:1152, high:1862}},
			{State:'FL',freq:{low:4481, mid:3304, high:948}},
			{State:'GA',freq:{low:1619, mid:167, high:1063}},
			{State:'IA',freq:{low:1819, mid:247, high:1203}},
			{State:'IL',freq:{low:4498, mid:3852, high:942}},
			{State:'IN',freq:{low:797, mid:1849, high:1534}},
			{State:'KS',freq:{low:162, mid:379, high:471}}
		];

		return (
			<div className="App">
				<Dashboard
					data={freqData}
					size={[this.state.screenWidth, this.state.screenHeight / 2]}
				/>
			</div>
		)
	}
}

export default App
