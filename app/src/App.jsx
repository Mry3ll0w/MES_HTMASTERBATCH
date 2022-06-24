import React from "react";
import { useState } from "react";//Sirve para renderizar automaticamente el array
import { Fragment } from "react";
import { useRef } from "react";//Identificar referencias en react
import { Todolist } from "./Components/todolist";
import {v4 as uuid4} from 'uuid'

export function App(){
    //Creamos el tipo de array use state
    //[nombre_estado, funcion que modifica el estado], le pasamos un estado inicial
    const [todos,setTodos] = useState([
        {id : 1, task: "Tarea1", complete: false}, {id:2 , task : "Tarea2", complete:true}
    ])
    
    //funcion arrow encargada de la insercion de nuevos elementos en el vector state de tareas
    const todoTaskRef = useRef();//Asi lo podremos usar en las funciones creadas
    
    const toggleTodo = (id) =>{
        const newTodos =[...todos];//El operador ... nos sirve para hacer una copia rapida de un array
        const todo = newTodos.find((todo) => todo.id === id);//Buscamos en el map 
        todo.complete = !todo.complete;
        setTodos(newTodos);//Metemos el nuevo array modificado dentro del useset
    }
    
    //Iguales que las funciones normales pero sin this
    const handleTodoAdd =()=>{
        const task = todoTaskRef.current.value;//Obtengo el valor del texto introducido
        if (task === '') return ; //si es un string vacio entonces no hago nada
        //No podemos modificar directamente un estado, por tanto creamos una copia
        //Para generar los id usamos la biblioteca automatica (uuid, instalada)
        setTodos((prevTodos) => {
            return [...prevTodos, {id: uuid4() ,task:task ,complete:false}]
        })
        todoTaskRef.current.value = null;
    };

    //
    const handleClearAll = () => {
        const newTodos = todos.filter((todo) => !todo.complete);
        setTodos(newTodos)
    }

    const handleClearTodos = () =>{
        const newTodos = [];
        setTodos(newTodos);
    }


    //Usaremos un fragment para poder enviar 2 components a la vez
    return (
        <Fragment>
            <button onClick={handleClearTodos}>Borrar todas las tareas</button>
            <div text-align="center">
            <Todolist todos={todos} toggleTodo={toggleTodo}/>
            <input type = "text" ref={todoTaskRef} placeholder="NuevaTarea"/>
            
            <button onClick={handleTodoAdd}>
                Add tarea
            </button>
            <button onClick={handleClearAll}>Eliminar tareas completadas</button>
            <button onClick={handleClearTodos}>Borrar todas las tareas</button>
            </div>
            
            x
        </Fragment>
        
    )
}


