import React from 'react'
import vercelimg from './vercel-icon.png'
import slash from './slash.png'
import usericon from './usericon.png'
import bellicon from '../../Static/Images/bell.png'
import avatar from '../../Static/Images/avatar.png'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'



export const Navbar = ({click,islogin}) => {
  const navigate=useNavigate();
  const handlePr=()=>{
    navigate('/Project')
  }
  return (
    <div className='Navbar'>
        <div className='left'>
            <img src={vercelimg} alt='logo'/>
            <img className = 'slash'src={slash} alt='slash'/>
            <img  className = 'user' src={avatar} alt='icon'/>   
            {islogin && <div className='username'>{islogin.username}</div>}   
            <div onClick={handlePr} className='hobby'>Hobby</div>                      
        </div>
        <div className='Right'>
          { !islogin?<div className='right'>

            <div className='Contact'>Contact</div>
            <div className='Login' onClick={click}>Login</div>
            <div className='Signup'>Sign Up</div>
          </div>:
          <div div className='right right2'>
          
            <div className='feedback' >Feedback</div>
            <div className='Help'>Help</div>
            <div className='bellicon'><img src={bellicon} alt='#'/></div>
            <div className='Avatar'><img src={avatar} alt='#'/></div>
          </div>

          }

        </div>
    </div>
  )
}
