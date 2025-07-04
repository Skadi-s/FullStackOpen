const Message = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

export default Message
