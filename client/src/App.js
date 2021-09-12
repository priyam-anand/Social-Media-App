import React, { createContext, useReducer, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home/home';
import { Route, Switch, Redirect } from 'react-router-dom';
import Profile from './pages/profile/profile';
import Login from './pages/login/Login';
import Register from './pages/register/register';
import { reducer, initialState } from './Reducer/useReducer';

export const userContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getInitialData = async () => {
    try {
      const resp = await fetch('/auth/initialData', {
        method: "GET",
        credentials: 'include',
        headers: {
          Accept: "Application/json",
          "Content-Type": "Application/json",
        }
      })
      const data = await resp.json();
      dispatch({ type: "INITAL_DATA", payload: data })
    } catch (err) {
      console.log(err);
    }

  }
  useEffect(() => {
    getInitialData();
  }, []);

  const isUser = () => {
    if (state.user !== null) {
      return true;
    }
    return false;
  }
  return (
    <>
      <userContext.Provider value={{ state, dispatch }}>
        <Switch>
          <Route exact path='/'>
            {isUser() ? <Home /> : <Login />}
          </Route>
          <Route path='/profile/:username'>
            {!isUser() ? <Redirect to='/' /> : <Profile />}
          </Route>
          <Route path='/login'>
            {isUser() ? <Redirect to='/' /> : <Login />}
          </Route>
          <Route path='/register'>
            {isUser() ? <Redirect to='/' /> : <Register />}
          </Route>
        </Switch>
      </userContext.Provider>
    </>
  )
}

export default App
