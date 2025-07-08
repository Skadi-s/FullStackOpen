import NoteItem from './NoteItem'

const NoteList = ({ notes, searchTerm, onEdit, onDelete }) => {
  return (
    <div>
      <h2>笔记列表 ({notes.length} 条)</h2>
      {notes.length === 0 ? (
        <div>
          <p>{searchTerm ? '没有找到匹配的笔记' : '还没有笔记，请添加第一条笔记'}</p>
        </div>
      ) : (
        <div>
          {notes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NoteList