import React, { useReducer } from "react";
import { loginReducer } from "../reducers/loginReducer";
import { useIsMounted } from "../hooks/useIsMounted";

const login = {
  user: "",
  password: "",
  loading: false,
  connected: false,
  error: "",
};

const Login = () => {
  const [state, dispatch] = useReducer(loginReducer, login);
  const { loading, connected, error } = state;
  const isMounted = useIsMounted();

  const handleLoginButton = (event) => {
    event.preventDefault();
    dispatch({
      type: "INIT",
      payload: {
        user: event.target.elements.name.value,
        password: event.target.elements.password.value,
      },
    });
    fetch(`http://${process.env.REACT_APP_API_URL}/login`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Something went wrong ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        if (isMounted.current) {
          dispatch({ type: "CHECK", payload: result });
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          dispatch({ type: "FETCH_LOGIN_FAILURE", payload: error.message });
        }
      });
  };

  return (
    <>
      <div className="container my-4">
        <h1 className="text-center">Login</h1>
        {error && <p className="alert alert-danger">{error}</p>}
        {connected && (
          <div class="alert alert-success" role="alert">
            Success !
          </div>
        )}
        <form onSubmit={handleLoginButton}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              UserName
            </label>
            <input
              className="form-control"
              id="name"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" id="password" />
          </div>
          <button id="login" type="submit" className="btn btn-primary">
            {loading ? <p>Loading....</p> : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
