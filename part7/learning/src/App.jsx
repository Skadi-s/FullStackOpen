import {
  BrowserRouter as Router,
  Routes, Route
} from "react-router-dom"
import Navigation from './components/Navigation'
import Home from './components/Home'
import NotesManager from './components/NotesManager'
import About from './components/About'

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<NotesManager />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
