const NoteItem = ({ note, onEdit, onDelete }) => {
  return (
    <div>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <small>
        创建时间: {new Date(note.createdAt).toLocaleString()}
      </small>
      <div>
        <button onClick={() => onEdit(note)}>
          编辑
        </button>
        <button onClick={() => onDelete(note.id)}>
          删除
        </button>
      </div>
    </div>
  )
}

export default NoteItem