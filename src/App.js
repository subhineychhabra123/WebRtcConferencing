import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import HttpsRedirect from 'react-https-redirect';
import 'react-toastify/dist/ReactToastify.css';


import createBrowserHistory from './history';
import AppRoutes from './AppRoutes';
import store from './store/store';
import { validateToken, getfromLocalStorage } from './utils/common';
const history = createBrowserHistory();

import './app.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './assets/vendor/fontawesome-free/css/all.min.css';
import './assets/css/sb-admin-2.css';
import './assets/css/sb-admin-2.min.css';
import './assets/css/custom.css';

const checkToken = () => {
  const token = getfromLocalStorage('token');
  const isValid = validateToken(token, history);
  const parameter = new URLSearchParams(history.location.search).get('data');
  if (isValid && history.location.search === '') {
    if (window.location.pathname === '/') {
      history.push('/dashboard');
    } else {
      const params = history.location.state;
      history.push(`${window.location.pathname}`, params);
    }
  } else if (isValid && history.location.search !== '') {
    if (isValid) {
      history.push(`${window.location.pathname}${history.location.search}`);
    }
  } else if (!isValid && parameter !== null) {
    history.push(`${window.location.pathname}${history.location.search}`);
  } else {
    history.push('/');
  }
};

function App() {
  checkToken();
  
  return (
    <Provider store={store}>
      <HttpsRedirect>
        <Router history={history}>
          <ToastContainer />
          <AppRoutes />
        </Router>
      </HttpsRedirect>
    </Provider>
  );
}

export default App;
