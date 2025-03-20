// ...existing imports...

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogoClick = (e) => {
    e.preventDefault();
    const dashboardPath = userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
    // Use history.push instead of window.location for cleaner navigation
    window.location.href = dashboardPath;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href={isAuthenticated ? (userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard') : '/'} 
           onClick={handleLogoClick}>
          Pill Reminder
        </a>
      </div>
      {/* ...rest of existing navbar code... */}
    </nav>
  );
};

export default Navbar;
