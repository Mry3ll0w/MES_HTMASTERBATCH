import React from "react";
import ReactDOM  from "react-dom/client";
import {App} from "./App"
//Llamamos al render de React, 
//1 archivo o html a renderizar , donde se va a mostrar
const root = ReactDOM.createRoot(document.getElementById('root'));
window.logged = ''
root.render(<App />)