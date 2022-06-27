
import './App.css';

export function App() {
  return (
    <div className="App">
      <h1>Ejemplo de CRUD con nodejs y react</h1>
      <div className = "form">
        <label>FechaHora</label>
        <input type = "text" name="MovieName"/>
        <br/>
        <label>Review</label>
        <input type = "text" name = "Review"/>
      </div>
    </div>
  );
}

export default App;
