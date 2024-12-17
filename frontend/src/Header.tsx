import { Link } from 'react-router-dom';
import './Header.css'

function Header() {

  return (
    <>  
        <div className='header'>
            <Link className='header-item' to='/dashboard'>Dashboard</Link>
            <Link className='header-item' to='find'>Find account</Link>
            <Link className='header-item' to='/'>Github profile checker</Link>
            <Link className='header-item' to='favourite'>Favourite</Link>
            <Link className='header-item' to='profile'>Profile</Link>
        </div>
    </>
  )
}

export default Header
