const NoteForm = ({ 
  title, 
  content, 
  onTitleChange, 
  onContentChange, 
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  return (
    <div>
      <h2>{isEditing ? '编辑笔记' : '添加新笔记'}</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="笔记标题"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="笔记内容"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows="4"
          />
        </div>
        <div>
          <button type="submit">
            {isEditing ? '保存修改' : '添加笔记'}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel}>
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default NoteForm