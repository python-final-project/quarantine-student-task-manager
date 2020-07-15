import React from 'react';
import axios from 'axios';
import Task from '../../components/Task';
import NewTask from '../../components/NewTask';
import ApiUrl from '../../constants/url';
import StudentNav from '../../components/StudentNav';


export default class StudentDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

        activeStudent: props.activeStudent,
        tasks : props.tasks, 
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCreateTask = this.handleCreateTask.bind(this)
   
  }

  async handleChange(event) {
    const selectedStudentId = event.target.value
 
    // TODO: ADD completed=false to the query
    const url = ApiUrl.BASE + ApiUrl.TASK + `?student_id=${event.target.value}&completed=false`
    const tasks = await getData(url)

    
    this.setState({
        currentStudent_id : selectedStudentId,
        tasks : tasks,
    }  )

  }

  handleCreateTask(task){
    // this function is called by the child (Componets/NewTask) and is sending the new data that was store 
    // the child can call it BS is send as a prop in <NewTask....
    // in DB. We need to added (concat) to the state.tasks so we can call a setState an re render.

    const newTasks = this.state.tasks.concat(task)
    this.setState({
      tasks : newTasks,
    })

  }


  render(){      

      //for fun
      let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);

    return (
    <>
        <StudentNav id={this.state.activeStudent.id} />
        <h1>Student's Dashboard </h1>

        <hr />

        <h3 style={{color: randomColor}}>
            Welcome!! {this.state.activeStudent.name}!!!
        </h3>
        <p> There are {this.state.tasks.length} tasks for you</p>

        <hr />
        <h3>
            Task List:
        </h3>
        <ol>
            {this.state.tasks.map(task => <Task key={task.id} task={task} />)}
        </ol>

        <hr />

        <NewTask student_id={ this.state.activeStudent.id} onCreateTask={this.handleCreateTask}  />
        
    </>
    )}
}

async function getData(url) {
    
    const response = await fetch(url);
    const data = await response.json()

    return data
}

export async function getServerSideProps(context) {

    const tasksUrl = ApiUrl.BASE + ApiUrl.TASK + `?student_id=${context.params.id}`
    const studentUrl = ApiUrl.BASE + ApiUrl.STUDENT + `${context.params.id}`

    const tasks = await getData(tasksUrl)
    const activeStudent = await getData(studentUrl)

    
  return {
      props: {
        tasks : tasks,
        activeStudent: activeStudent,
      }
  }
}

