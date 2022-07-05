import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/home';
import Estadistico from './pages/estadistico';
import ErrorPage from './pages/ErrorPage';
import EjParam from './pages/EjParam';
import RegEnsacado from './pages/Ensacado';
import { Header } from './Components/Header';
import { styles} from './Style/styles';
import Footer from './Components/Footer';
export function App() {

  return (
    <Router>
      <Header />
      <div style={styles.home_div}>
      <Routes>
          <Route path ="/" element={<Home />}/>
          <Route path='/estadistico' element ={<Estadistico />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/ejparam/:username' element = {<EjParam />} />
          <Route path='/RegEnsacado' element = {<RegEnsacado />} />
      </Routes>
      
      </div>
      <Footer />
    </Router>);
}

export default App;
