// 整个应用都在同一个组件中。重构代码，使其由三个新的组件组成。Header、Content和Total。
// 所有数据仍驻留在App组件中，它使用props将必要的数据传递给每个组件。Header负责显示课
// 程的名称，Content显示各部分及其练习的数量，Total显示练习的总数量。

const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.part1} exercises={props.exercises1} />
      <Part name={props.part2} exercises={props.exercises2} />
      <Part name={props.part3} exercises={props.exercises3} />
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
      {props.exercises1 + props.exercises2 + props.exercises3}
    </p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content
        part1={part1}
        exercises1={exercises1}
        part2={part2}
        exercises2={exercises2}
        part3={part3}
        exercises3={exercises3}
      />
      <Total
        exercises1={exercises1}
        exercises2={exercises2}
        exercises3={exercises3}
      />
    </div>
  )
}

export default App