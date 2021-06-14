import './App.css';
import Testing from './components/Testing'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Formpdf from './components/Formpdf';
import PDFcompare from './components/PDFcompare';
function App() {
  return(
    <>
    <Router>
      <Switch>
        <Route component={Testing} exact path='/' />
        <Route component={Formpdf} path='/form' />
        <Route component={PDFcompare} path='/compare' />

      </Switch>
    </Router>
    </>
  )
  
}

export default App;
