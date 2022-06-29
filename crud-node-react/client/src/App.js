
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';//Para hacer las llamadas a la api del backend 
import './App.css';

export function App() {

  //States
  const [MovieName, SetMovieName] = useState('');
  const [Review, SetReview] = useState('');
  const [movielist,SetMovieList] = useState([]);

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

  //Funcion para obtener los datos del backend al frontend
  useEffect(() => {
    axios.get('http://172.26.0.21:3001/api_get').then((response) => {
      SetMovieList(response.data); 
    })
  });

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
      <h1>Guardado en la base de datos</h1>
      {movielist.map((i) => {
        return <h1>MovieName : {i.moviename}</h1>
      })}
    </div>
  );
}

export default App;
