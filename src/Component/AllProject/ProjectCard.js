import React from 'react'
import './ProjectCard.css'
import branchlogo from '../../Static/Images/branch.jpg'
import reactlogo from '../../Static/Images/github.svg'
import githublogo from '../../Static/Images/github.svg'
import { useNavigate } from 'react-router-dom'

export const ProjectCard = ({username,projectname,projectId,project_id}) => {
    const navigate=useNavigate();
    const OpenDeployment=()=>{
        const url = `/Deployment?project=${projectname}&id=${project_id}`;
        navigate(url);
    }
  return (
    <div onClick={OpenDeployment} className='ProjectCard'>
        <div className='Top'>
            <div className='ProjectName'>
                <div><img className='logo' src ={reactlogo}/></div>
                <div>
                    <div>{projectname}</div>
                    <div className='link'>{`${projectId}.localhost:8000`}</div>
                </div>
            </div>
            <div>
                <div><img className='logo' src ={branchlogo}/></div>
            </div>
        </div>
        <div className='Middle'>
            <div><img className='icon' src={githublogo}/></div>
            <div>{username && `${username}/react-app`}</div>
        </div>
        <div className='Last'>
            <div>Update Readme.md</div>
            <div>181d ago</div>           

        </div>
    </div>
  )
}
