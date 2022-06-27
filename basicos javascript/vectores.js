 //Crearemos una clase para instanciar los elementos de la misma
class coche {
    constructor(marca = "",modelo=""){
        this.marca = marca;
        this.modelo = modelo;
        
    }

};

let c1 = new coche ("SEAT", 'Ibiza');
let c2 = new coche ("Mercedes", 'CLA200');
let c3 = new coche('Ford', 'mustang');

let v = [c1,c2,c3];

console.log(v);

//Uso del metodo find
//Syntax = [donde buscar] => filtro
console.log(v.find(v => v.marca == 'Mercedes'));

//Metodo SOME ==> Si existe lo buscado = true, si no false
console.log(v.some(v => v.marca == 'Audi'));//devuelve false, ya que no hay un audi

//Usando el metodo SOME + includes
//Includes ==> nos sirve para filtrar si contiene lo buscado
console.log(v.some(v    =>  v.marca.includes('s')));//Devuelve true, ya que la palabra SEAT contiene S

//Metodo Every ==> Comprueba si en todos se cumple una condición
console.log(v.every( v => v.marca != NaN));//Todos los posts la marca esta rellena

//Metodo map ==> Nos sirve para extraer cosas de conjuntos 

//Ejemplo crear un array con todas las marcas de los coches
let arr = v.map(v => v.marca);
console.log(arr);

//Tambien podemos aplicar filtros en el map
arr = v.filter(v => v.modelo.includes('a'));
console.log(arr);
//Podemos comprobar si un atributo esta definido usando
arr = v.filter( v => v?.image );//arr esta vacio, ya que no hay ningun elemento con el atributo image
console.log(arr);

//Metodo reduce ==> creacion de un array con todas los atributos de clase coche x
//Separa en caracteres si se trata de strings
arr = v.reduce((modelos, v) => {
    return [...modelos, ...v.modelo]
},[]);

console.log(arr);

//Ejemplo de set ==> Elimina todos los caracteres repetidos 

arr = v.reduce((modelos, v) => {
    return Array.from( new Set ([...modelos, ...v.modelo]))
},[]);

console.log(arr);

//Diferencia entre == y === 
//== : No comprueba si el tipo es el mismo, es decir 1 == '1' es T
// === : Comprueba el tipo ademas del contendio 1 === '1' es F
