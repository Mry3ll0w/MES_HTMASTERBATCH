import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home';
import Estadistico from './pages/estadistico';
import ErrorPage from './pages/ErrorPage';
import EjParam from './pages/EjParam';

import Menu_Ensacado from './pages/Menu_Ensacado';
import Mod_Ensacado from './pages/Mod_Ensacado';
import RegEnsacado from './pages/Reg_Ensacado';

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
          <Route path='/Ensacados' element = {<Menu_Ensacado />} />
          <Route path='/ModEnsacado' element={<Mod_Ensacado />} />
          <Route path='/RegEnsacado' element={<RegEnsacado />} />
      </Routes>
      
      </div>
      <Footer />
    </Router>);
}

export default App;
