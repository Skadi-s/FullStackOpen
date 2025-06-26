// 整个应用都在同一个组件中。重构代码，使其由三个新的组件组成。Header、Content和Total。
// 所有数据仍驻留在App组件中，它使用props将必要的数据传递给每个组件。Header负责显示课
// 程的名称，Content显示各部分及其练习的数量，Total显示练习的总数量。

const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => (
        <Part
          name={part.name}
          exercises={part.exercises}
        />
      ))}
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Total = (props) => {
  return (
    <p>
      Number of exercises{' '}
      {props.parts.reduce((sum, part) => sum + part.exercises, 0)}
    </p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App