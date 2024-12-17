import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main_page from './main-page';
import Header from './header';
import Profile from './profile';
import './App.css';
import Find from './Find';
import Favourite from './favourite';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Header />  {/* Always displayed */}
      <Routes>
        <Route path="/" element={<Main_page />} />  
        <Route path='/find' element={<Find />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/favourite' element={<Favourite />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;