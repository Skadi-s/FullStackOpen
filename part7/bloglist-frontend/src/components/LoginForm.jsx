import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../reducers/userReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const { currentUser, isLoading, error } = useSelector(state => state.user);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginUser({ username, password }));
      dispatch(setNotificationWithTimeout(`Welcome ${username}!`, 5000));
      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch(setNotificationWithTimeout("Wrong username or password", 5000));
    }
  };

  if (currentUser) {
    return (
      <div>
        <p>Logged in as {currentUser.name}</p>
        <button onClick={() => dispatch(logoutUser())}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login to application</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;