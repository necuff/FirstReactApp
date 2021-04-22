import React, {useEffect} from 'react'
import TodoList from './Todo/TodoList'
import Context from './context' 
import Loader from './loader'
import Modal from './Modal/Modal'

const AddTodo = React.lazy(() => import('./Todo/AddTodo')) //Ленивая загрузка

function App() {
/*
  const [todos, setTodos] = React.useState([])  
  setTimeout(() => {
    setLoading(false)
    setTodos([{id: 1, completed: false, title: 'Купить хлеб'},{id: 2, completed: false, title: 'Купить масло'},
    {id: 3, completed: false, title: 'Купить молоко'}])
  }, 2000)
  */

  /*скрыть/показать спиннер*/
  const [loading, setLoading] = React.useState(true)  

  /*Загрузка данных из сети*/  
  const [todos, setTodos] = React.useState([])  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then(response => response.json())
      .then(todos => {
        setTimeout(() => {
          setTodos(todos)
          setLoading(false)
        }, 2000) //имитируем задержку сервера
        
      })
  }, [])
  

  function toggleTodo(id){
    setTodos(
      todos.map(todo=> {
        if(todo.id === id){
          todo.completed = !todo.completed;
        }      
        return todo;
      })    
    )    
  }

  function removeTodo(id){
    setTodos(todos.filter(todo => todo.id !== id))
  }

  function addTodo(title){
    setTodos(todos.concat([{
      title,
      id: Date.now(),
      completed: false
    }]))
  }

  return (
    <Context.Provider value = {{ removeTodo }}>
      <div className='wrapper'>
        <h1>React tutorial</h1>    
        <Modal /> 
        {/*Компонент для ленивой загрузки*/}
        <React.Suspense fallback={<p>Loading...</p>}> {/** пока компонент загружается отображаем данный блок*/}
          <AddTodo onCreate={addTodo}/>
        </React.Suspense>                
        
        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo}></TodoList>
        ) : (
          loading ? null : <p>No todos!</p>
        )}
      </div>
    </Context.Provider>    
  );
}

export default App;
