import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './styles.scss'
import GithubKitty from './github.svg'
import './home.font'

class HomeSPA extends Component {

	constructor(props){
		super(props);
		this.state = {
			forth:true,
			beers:0
		};
	}

	componentDidMount(){
		setTimeout(() => this.setState({ forth : !this.state.forth }), 500);
		setInterval(() => this.setState({ forth : !this.state.forth }), 5000);
	}

	beerMe(){
		this.setState({
			beers : this.state.beers+1
		});
	}

    renderGame(){
		const beer = (i) => <span key={i} className="icon icon-beer"/>;
        return (
            <div>
				<div className="beers">
                	{[...Array(this.state.beers)].map((x,i) => beer(i))}
				</div>
				<div  className={`gitcat ${this.state.forth ? "forth" : ""}`} onClick={this.beerMe.bind(this)}>
					<GithubKitty/>
				</div>
            </div>
        )
    }

	render(){
		if(this.state.beers < 10) {
			return this.renderGame();
		} else {
			return <h1>Yer a wizard, harry.</h1>
		}
	}
}


ReactDOM.render(<HomeSPA />, document.getElementById('react-spa'))
