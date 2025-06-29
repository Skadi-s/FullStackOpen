import React from 'react'

const Header = ({ course }) => {
  return <h1>{course}</h1>
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    course.map((c) => (
      <div key={c.id}>
        <Header course={c.name} />
        <Content parts={c.parts} />
        <Total parts={c.parts} />
      </div>
    ))
  )
}

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><strong>total of {totalExercises} exercises</strong></p>
}

export default Course