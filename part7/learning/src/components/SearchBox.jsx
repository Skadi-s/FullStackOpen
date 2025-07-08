const SearchBox = ({ searchTerm, onSearchChange }) => {
  return (
    <div>
      <h3>搜索笔记</h3>
      <input
        type="text"
        placeholder="搜索笔记..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}

export default SearchBox
