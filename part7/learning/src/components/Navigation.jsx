import { Link } from "react-router-dom"

const Navigation = () => {
  return (
    <nav>
      <Link to="/">首页</Link>
      {' | '}
      <Link to="/notes">笔记</Link>
      {' | '}
      <Link to="/about">关于</Link>
    </nav>
  )
}

export default Navigation
