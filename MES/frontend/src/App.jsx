import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/home';
import Estadistico from './pages/estadistico';
import ErrorPage from './pages/ErrorPage';
import EjParam from './pages/EjParam';
export function App() {

  return (
    <Router>
      <h1>MES v0.0.1</h1>

      <Routes>
          <Route path ="/" element={<Home/>}/>
          <Route path='/estadistico' element ={<Estadistico />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/ejparam/:username' element = {<EjParam />} />
      </Routes>
      
      <footer>©UNNOX-GROUP 2022 </footer>
    </Router>);
}

export default App;
