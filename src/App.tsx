import './styles/main.css'
import {Route, useLocation} from 'wouter'
import {NavBar} from './components/UI/navBar/navBar.tsx'
import {Layout} from './components/UI/layout/layout.tsx'
import {CurrencyConverter} from './components/myTools/сurrency-сonverter/currencyConverter.tsx'
import {Calculator} from './components/myTools/сalculator/calculator.tsx'

function App() {
	const [location, setLocation] = useLocation()
	return (
		<div className={'App'}>
			<header className={'header'}>
				<NavBar>
					<a
						className={`link ${location === '/' ? 'current' : ''}`}
						onClick={() => setLocation('/')}
					>
						Home
					</a>
					<a
						className={`link ${location === '/currency-converter' ? 'current' : ''}`}
						onClick={() => setLocation('/currency-converter')}
					>
						Currency Converter
					</a>
					<a
						className={`link ${location === '/calculator' ? 'current' : ''}`}
						onClick={() => setLocation('/calculator')}
					>
						Calculator
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
					<Route path='/currency-converter' component={CurrencyConverter}/>
					<Route path='/calculator' component={Calculator}/>
					<Route path='/about'>About Us: blablabalabala</Route>
					<Route path='/'>HOME</Route>
				</Layout>
			</main>
		</div>
	)
}

export default App
