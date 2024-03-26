import React from 'react'
import { Navbar } from '../Navbar/Navbar'
import { useState,useEffect } from 'react'
import "./HomePage.css"
import githublogo from '../../Static/Images/github.svg'
import gitlablogo from '../../Static/Images/images.png'
import bitbucket from '../../Static/Images/bitbucket.webp'
import nextjs from '../../Static/Images/nextjs.png'
import nuxtjs from '../../Static/Images/Nuxt.png'
import svele from '../../Static/Images/Svelekit.png'
import vite from '../../Static/Images/Vite.png'
import footerlogo from '../../Static/Images/frameworks-arranged.svg'
import {Project} from '../CreateProject/Project.js'


export const HomePage = ({user,Login}) => {

  return (
    <div>
        <div className='Home'>
            <div className='title'>
                <div className='Head'> <h1>Let's build something new.</h1></div>
                <div className='tagline'>To deploy a new Project, import an existing Git Repository or get started with one of our Templates.</div>
            </div>
            <div className='Cards'>
              <div className='Card1'>
                <h1>Import Git Repository</h1>
                {/* <div className='Cover'> */}
                  {!user?
                  <div className='Cover'>
                  <div className='tagline'>Select a Git provider to import an existing project from a Git Repository.</div>
                  <div className='Buttons'>
                  <div className='Button' onClick={Login}><img src={githublogo} alt="alt"/>Continue With Github</div>
                  <div className='Button Button2'><img src={gitlablogo} alt="alt"/>Continue With GithLab</div>
                  <div className='Button Button3'><img src={bitbucket} alt="alt"/>Continue With Bitbucket</div>

                  </div>

                  </div>:
                  <div>
                    <Project user={user}/>
                  </div>
                  }

                {/* </div> */}
                <h4>Import Third-Party Git Repository -</h4>
              </div>
              <div className='Card1'>
                <h1>Clone Templates</h1>
                {/* <div className='Cover'> */}
                  <div className='TemplateR1'>
                    <div className='template'> <img src={nextjs} alt="#"/><div className='lower' style={{"fontWeight":"bold"}}>NextJs</div></div>
                    <div className='template'> <img src={nuxtjs} alt="#"/><div className='lower' style={{"fontWeight":"bold"}}>NextJs</div></div>

                  </div>
                  <div className='TemplateR1'>
                    <div className='template'> <img src={svele} alt="#"/><div className='lower' style={{"fontWeight":"bold"}}>NextJs</div></div>
                    <div className='template'> <img src={vite} alt="#"/><div className='lower' style={{"fontWeight":"bold"}}>NextJs</div></div>

                  </div>
                  <h4>Browse All Template -</h4>
                
              </div>
              

            </div>

          <div className='Footer'> <div className='tagline' style={{"margin-bottom":"20px","fontWeight":"200"}}>Optimized For</div>
          <div className='footerlogo' style={{"margin-bottom":"20px"}}><img src={footerlogo}/></div>

          </div>
        </div>

    </div>
  )
}
