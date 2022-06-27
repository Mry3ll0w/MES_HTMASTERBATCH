import { f_exportacion } from "./modulo";
import f_default from "./modulo";
//Como concatenar variables

const nombre = "Antonio"
const apellido = "Roldan"

console.log(`${nombre} ${apellido}`) //Antonio Roldan Andrade

//Usado dentro de react para pasarle a un string una variable

function ejemplo ({background}) {
    return (<div className={`bg-color-${background}`} >Hola</div>);
}

//Usando los acortadores de nombre

//Creamos un objeto persona
const persona = {
    nombre: nombre,
    apellido: apellido
}

//Se puede hacer exactamente lo mismo 
const p2 = {
    nombre,apellido
}

//Arrow function

function hola(){
    return "hola";
}

//Si la funcion solo es de una linea podemos hacer lo siguiente
const arrowhola = () => "hola"

//Destructuring==> Sacar las propiedades del objeto para no tener que hacerlo de forma 
//tradicional
//Usando fuera de los argumentos
function procesaPersona (persona){
    const {nombre, apellido} = persona;
    console.log(`${nombre} ${apellido}`);
}

//Haciendo destructuring en los argumentos
function ProcesaPersona ({nombre, apellido}){
    console.log(`${nombre} ${apellido}`);
}

//Usando el spread operator

//Concatenar arrays
const v1 = [1,2,3,4];
const v2 =[5,6,7,8];

const v3 = [...v1, ...v2];//v3 = v1 + v3

// usando el spread operator con objetos
function spread_persona ({nombre, ...persona}){
    //quieres devolver algo cuyas propiedades del componente se llamen igual que el resto de persona
    return <div key={nombre} {...persona}>Soy un ejemplo</div>;
    //Con esto tenemos key={nombre} apellido={apellido} etc
}

//Uso ternary function => Asignarle un valor a una variable en caso de no estar definido

let coche = {
    marca : "SEAT", 
    modelo :"Ibiza TDI"
}

let coche_ejemplo = coche.marca ? coche.marca : "no definido"; //Si el campo marca del objeto coche no esta definido se define con el valor ///tras coche marca

