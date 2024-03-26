import React from 'react'
import './Userrepo.css'
import githublogo from '../../Static/Images/github.svg'
import { useNavigate } from 'react-router-dom';

export const Userrepo = ({reponame,repourl}) => {
    const navigate=useNavigate();
    const createproject=()=>{
        const encodedRepoName = encodeURIComponent(reponame);
        const encodedRepoUrl = encodeURIComponent(repourl);
        const url = `/configproject?repoName=${encodedRepoName}&repoUrl=${encodedRepoUrl}`;
        navigate(url);

    }
    return (
        <div className='repo'>
            <div>
                <img style={{ "width": "30px" }} src={githublogo} />
                <span style={{ "marginInlineStart": "10px" }}>{reponame}</span>
                <span style={{ "marginInlineStart": "10px" }}>16d ago</span>
            </div>
            <div>
                <div onClick={createproject} className='Button'>Import</div>
            </div>
        </div>
    )
}
