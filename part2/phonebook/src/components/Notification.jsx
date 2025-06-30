const Notification = ({ message }) => {
    const style = {
        color: 'green',
        fontStyle: 'italic',
        border: 'solid',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    }

    if (message === null) {
        return null
    }
    
    return (
        <div className="notification" style={style}>
        {message}
        </div>
    )
}

export default Notification