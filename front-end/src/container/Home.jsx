import React, { useEffect, useRef, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import {UserProfile, Sidebar} from '../components'
import { client } from '../client'
import Pins from './Pins'
import logo from '../assets/logo.png'
import { userQuery } from '../utils/data'
import { fetchUser } from '../utils/fetchUser'

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState({})
  const scrollRef = useRef(null);
  const userInfo = fetchUser();
  useEffect(() => {

    const query = userQuery(userInfo?.googleId);
    client.fetch(query)
    .then((data) => {
    setUser(data[0])
    })
  }, [])
  
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });


  return (
    <div className="flex bg-gray-50 md:flex-row flex-col transaction-height duration-75 ease-out ">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={ user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
        <HiMenu fontSize={40} className="cursor-pointer" onClick={ () => setToggleSidebar(true) }/>
        <Link to="/">
          <img src={logo} alt="logo" className="w-28" />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="logo" className="w-28" />
        </Link>
        </div>
      {
        toggleSidebar && (
          <div className="fixed w-3/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
                <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={ () => setToggleSidebar(false) } />
            </div>
            <Sidebar user={ user && user} closeToggle={setToggleSidebar} />
          </div>
        )
      }
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={ user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
