import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Login } from './component';
const Registration = lazy(() => import('./component/Registration'));
const VideoChat = lazy(() => import('./component/VideoChat'));
const ForgetPassword = lazy(() => import('./component/ForgetPassword'));
const ResetPassword = lazy(() => import('./component/ResetPassword'));
const AdminLayout = lazy(() => import('./layouts/Admin.jsx'));

function AppRoutes() {
  return (
    <Suspense fallback={<h3 className='loading'>Loading...</h3>}>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/login' exact component={Login} />
        <Route path='/forgetpassword' exact component={ForgetPassword} />
        <Route path='/resetpassword' exact component={ResetPassword} />
        <Route path='/register' exact component={Registration} />
        <Route path='/meeting/:meetingId' exact component={VideoChat} />
        <Route path='/admin' render={(props) => <AdminLayout {...props} />} />
        <Redirect to='/admin/dashboard' />
      </Switch>
    </Suspense>
  );
}

export default AppRoutes;
