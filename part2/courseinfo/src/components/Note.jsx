const Note = ({ note }) => {
  return (
    <div>
      <p>{note.content}</p>
      <small>{note.date}</small>
    </div>
  )
}

export default Note