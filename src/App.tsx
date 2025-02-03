import './App.css'
import {NavBar} from './components/UI/navBar/navBar.tsx'
import {CurrencyConverter} from './components/myTools/CurrencyConverter/currencyConverter.tsx'
import {Layout} from './components/UI/layout/layout.tsx'

function App() {

  return (
     <>
       <header>
         <NavBar>
            <p>Currency Converter</p>
         </NavBar>
       </header>
        <main>
           <Layout>
              <CurrencyConverter/>
           </Layout>
        </main>
     </>
  )
}

export default App
