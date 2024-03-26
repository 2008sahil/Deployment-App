import React, { useEffect, useState } from 'react'
import './Project.css'
import githublogo from '../../Static/Images/github.svg'
import searchlogo from '../../Static/Images/search.png'
import { Userrepo } from '../Userrepo/Userrepo'

export const Project = ({user}) => {
    const [userrepos,setuserrepos]=useState(null)
    useEffect(()=>{
        const fetchuserrepo=async()=>{
            const data={username:user.username}
            await fetch('http://localhost:4000/user/getuserrepo',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization":"Bearer "+localStorage.getItem("auth")
                },
                body:JSON.stringify(data)
                
            }).then((data)=>{
                return data.json();
            }).then((data)=>{
                setuserrepos(data)
            })

        }
        fetchuserrepo();
    },[])


  return (
    <div className='Project'>
        <div className='ProjectHead'>
            <div className='userProfile'>
                <img src ={githublogo} alt='#' />
                <span>{user.username}</span>
            </div>
            <div className='userProfile'>
                <img src ={searchlogo} alt='#' />
                <span>Search...</span>
            </div>
        </div>

        <div className='userRepos'>
            {userrepos && userrepos.map((repo)=>{return <Userrepo reponame={repo.name} repourl={repo.url}/>})}
            
        </div>
    </div>
  )
}
