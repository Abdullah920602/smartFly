// Auth components exports
import Login from './Login';
import Register from './Register';
import SettingsPage from '../userEdit/SettingsPage';
import TravelerLogin from './TravelerLogin';
import AirlineRegister from './AirlineRegister';

// Export as named exports
export { Login, Register, SettingsPage, TravelerLogin, AirlineRegister };

// Re-export Login as AuthPage for backward compatibility
export { Login as AuthPage };
