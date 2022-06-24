import React from 'react'
import { TodoItem } from './todoitem'
export function Todolist({todos, toggleTodo}) {
    //Metemos codigo js con las llaves
    return (
    <ul>
        
        {
            todos.map(
                (todo) => (<TodoItem key={todo.id} todo = {todo} toggleTodo={toggleTodo}/>) 
            )
        }
    </ul>
  )
}
