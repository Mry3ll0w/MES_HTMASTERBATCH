import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home';
import Estadistico from './pages/estadistico';
import ErrorPage from './pages/ErrorPage';
import EjParam from './pages/EjParam';
import RegEnsacado from './pages/Reg_Ensacado';
import LoginForm from './pages/LoginForm';
import RegistroPlanta from './pages/RegistroPlanta';
import { Header } from './Components/Header';
import { styles} from './Style/styles';
import Footer from './Components/Footer';
import { useEffect } from 'react';
import Grafica_Estadistico from './pages/grafica_estadistico';
import Profile from './pages/Profile';

//Imagenes
import Personal from './pages/AdminUsers';
let loggeduser=''
export function App() {

  useEffect(()=>{
      document.title = 'M.E.S.'
      
  });

  return (
    <Router>
      <Header />
      <div style={styles.home_div}>
      <Routes>
          <Route path ="/" element={<LoginForm />} />
          <Route path = "/home" element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/estadistico' element ={<Estadistico />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/ejparam/:username' element = {<EjParam />} />
          <Route path='/RegEnsacado' element={<RegEnsacado />} />
          <Route path='/GraficaEstadistico' element={<Grafica_Estadistico />} />
          <Route path='/Login' element={<LoginForm />} />
          <Route path='/Personal' element={<Personal />} />
          <Route path='/RegistroPlanta' element={<RegistroPlanta />} />
      </Routes>
      
      </div>
      <Footer />
    </Router>);
}

export default App;
