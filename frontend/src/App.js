import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import CreatePrescription from './components/CreatePrescription';
import NotificationList from './components/NotificationList';
import ErrorBoundary from './components/ErrorBoundary';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';
import DrugInteractionChecker from './components/DrugInteractionChecker';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <ProtectedRoute exact path="/doctor-profile" component={DoctorProfile} roleRequired="doctor" />
              <ProtectedRoute exact path="/patient-profile" component={PatientProfile} roleRequired="patient" />
              <ProtectedRoute path="/doctor-dashboard" component={DoctorDashboard} roleRequired="doctor" />
              <ProtectedRoute path="/patient-dashboard" component={PatientDashboard} roleRequired="patient" />
              <ProtectedRoute path="/create-prescription" component={CreatePrescription} roleRequired="doctor" />
              <ProtectedRoute path="/notifications" component={NotificationList} />
              <ProtectedRoute path="/drug-interactions" component={DrugInteractionChecker} roleRequired="doctor" />
              <ProtectedRoute path="/doctor/profile" component={DoctorProfile} roleRequired="doctor" />
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
