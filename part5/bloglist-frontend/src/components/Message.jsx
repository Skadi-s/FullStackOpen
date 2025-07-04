const Message = ({ message }) => {
  const style = {
    color: 'green',
    backgroundColor: 'lightgrey',
    border: '1px solid green',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px'
  }

  if (!message) {
    return null
  }

  return (
    <div className="message" style={style}>
      {message}
    </div>
  )
}

export default Message
