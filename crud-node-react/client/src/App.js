
import { useState } from 'react';
import axios from 'axios';//Para hacer las llamadas a la api del backend 
import './App.css';

export function App() {

  const [MovieName, SetMovieName] = useState('');
  const [Review, SetReview] = useState('');

  //Funcion para enviar datos a node
  const submitData = () =>{
    console.log(MovieName);
    console.log(Review);
    axios.post("http://172.26.0.21:3001/api/insert",
      {pelicula:MovieName, Review:Review}
      ).then(() => {
        alert("Insercion realizada");
      });
  };

  return (
    <div className="App">
      <h1>Ejemplo de CRUD con nodejs y react</h1>
      <div className = "form">
        <label>Titulo de la pelicula</label>
        <input type = "text" name="MovieName" onChange={(e)=>{
          SetMovieName(e.target.value);
        }}/>
        <br/>
        <label>Review</label>
        <input type = "text" name = "Review" onChange={(e) => {SetReview(e.target.value);}}/>
      </div>
      <button onClick={submitData}>Subir review</button>
    </div>
  );
}

export default App;
