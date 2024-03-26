import React from 'react'
import './DeploymentCard.css'
import avatar from '../../Static/Images/avatar.png'
import branch from '../../Static/Images/branch.jpg'
import commit from '../../Static/Images/commit.png'
import { useNavigate } from 'react-router-dom'

export const DeploymentCard = ({username,deployment}) => {
  const createdAt = new Date(deployment.createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - createdAt;
  const navigate=useNavigate()
  const getlogs=()=>{
    const url = `/Logs?repoName=Amazon-Clone&id=${deployment._id}`;
    navigate(url);
  }

// Convert the time difference from milliseconds to days
const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return (
    <div onClick={getlogs} className='DeploymentCard'>
      <div className='first'>
        <div className='commit'>{deployment._id}</div>
        <div className='Status'>{deployment.status}</div>
      </div>
      <div className='Second'>
        <div>
        <div className='Status'>Ready</div>
        <div className='time'>({daysAgo}d ago)</div>
        </div>
        <div>
        <div className='branch'><img className='avatar' src={branch}/> main</div>
        <div className='Bottom'><div><img className='icon' src={commit}/></div><div>Final commit</div></div>
        </div>
      </div>
      <div className='Third'>
        <div >{daysAgo}d ago by {username}</div>         
        <div ><img className='avatar' src={avatar}/></div>
      </div>
    </div>
  )
}
