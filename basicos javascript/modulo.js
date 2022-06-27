//Ejemplo de como exportar funcioenes entre ficheros

//Con la clausula export podremos exportar esa funcion a otros archivos
export function f_exportacion(){
    return <h1>Soy una funcion de f_exportacion</h1>;
}

//Si ponemos default a la hora de exportar no será necesario exportar usando las llaves
export default function f_default () {
    return <h2>Soy una funcion exportada como default </h2>;
}