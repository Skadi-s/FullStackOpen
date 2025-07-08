import { useState, useEffect } from 'react'
import NoteForm from './components/NoteForm'
import SearchBox from './components/SearchBox'
import NoteList from './components/NoteList'

function App() {
  const [notes, setNotes] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // 从 localStorage 加载笔记
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // 保存笔记到 localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = (e) => {
    e.preventDefault()
    if (newTitle.trim() && newContent.trim()) {
      const newNote = {
        id: Date.now(),
        title: newTitle.trim(),
        content: newContent.trim(),
        createdAt: new Date().toISOString()
      }
      setNotes([...notes, newNote])
      setNewTitle('')
      setNewContent('')
    }
  }

  const deleteNote = (id) => {
    if (window.confirm('确定要删除这条笔记吗？')) {
      setNotes(notes.filter(note => note.id !== id))
    }
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setNewTitle(note.title)
    setNewContent(note.content)
  }

  const saveEdit = (e) => {
    e.preventDefault()
    if (newTitle.trim() && newContent.trim()) {
      setNotes(notes.map(note => 
        note.id === editingId 
          ? { ...note, title: newTitle.trim(), content: newContent.trim() }
          : note
      ))
      setEditingId(null)
      setNewTitle('')
      setNewContent('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewTitle('')
    setNewContent('')
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>📝 我的笔记</h1>
      
      {/* 添加/编辑笔记表单 */}
      <NoteForm 
        title={newTitle}
        content={newContent}
        onTitleChange={setNewTitle}
        onContentChange={setNewContent}
        onSubmit={editingId ? saveEdit : addNote}
        onCancel={cancelEdit}
        isEditing={editingId !== null}
      />

      <hr />

      {/* 搜索框 */}
      <SearchBox 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* 笔记列表 */}
      <NoteList 
        notes={filteredNotes}
        searchTerm={searchTerm}
        onEdit={startEdit}
        onDelete={deleteNote}
      />
    </div>
  )
}

export default App
