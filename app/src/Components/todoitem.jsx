import React from 'react'
import { Todolist } from './todolist'

//Trata un unico item
export function TodoItem({todo, toggleTodo}) {
  const {id, task, complete} = todo
  const handleTodoClick = () => {
    toggleTodo(id);
  }
  return (
    <li>
        <input type="checkbox" checked={complete} onChange={handleTodoClick}/>
        
        {task}
    </li>
  )
}
