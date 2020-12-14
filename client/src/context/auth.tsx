import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initState = { user: null };

if (typeof window !== "undefined" && localStorage.getItem("jwtToken")) {
  const decodedToken: any = jwtDecode(localStorage.getItem("jwtToken"));
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initState);
  function login(userData) {
    typeof window !== "undefined" && localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    typeof window !== "undefined" && localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    ></AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
