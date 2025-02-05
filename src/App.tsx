import './App.css'
import {Link, Route, useLocation} from 'wouter'
import {NavBar} from './components/UI/navBar/navBar.tsx'
import {Layout} from './components/UI/layout/layout.tsx'
import {CurrencyConverter} from './components/myTools/CurrencyConverter/currencyConverter.tsx'

function App() {
	const [location, setLocation] = useLocation()
	return (
		<div className={'App'}>
			<header>
				<NavBar>
					<a
						className={`link ${location === '/' ? 'current' : ''}`}
						onClick={() => setLocation('/')}
					>
						Home
					</a>
					<a
						className={`link ${location === '/CurrencyConverter' ? 'current' : ''}`}
						onClick={() => setLocation('/CurrencyConverter')}
					>
						Currency Converter
					</a>
					<a
						className={`link ${location === '/about' ? 'current' : ''}`}
						onClick={() => setLocation('/about')}
					>
						About
					</a>
				</NavBar>
			</header>
			<main>
				<Layout>
					<Route path='/CurrencyConverter' component={CurrencyConverter}/>
					<Route path='/about'>About Us: blablabalabala</Route>
					<Route path='/'>HOME</Route>
				</Layout>
			</main>
		</div>
	)
}

export default App
