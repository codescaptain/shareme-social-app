import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {RiHome2Fill, RiHomeFill} from 'react-icons/ri'
import {IoIosArrowForward} from 'react-icons/io'
import logo from '../assets/logo.png'
import { categories } from '../utils/data'

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-black transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({user, closeToggle}) => {
  const handleCloseSideBar = () => {
    if(closeToggle) closeToggle(false)
  }
  return (
    <div className="flex flex-col justify-between bg-wihte h-full overflow-y-scrikk min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link 
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSideBar}
          >
            <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            onClick={handleCloseSideBar}
            to="/"
            className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle }
            > 
            <RiHomeFill />
            Home
            </NavLink>
            <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover Categories</h3>
            {categories.map(category =>(
              <NavLink
                onClick={handleCloseSideBar}
                to={`/category/${category.name}`}
                className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle }
                key={category.name}
              >
                  <img 
                    className="w-8 h-8 rounded-full shadow-sm"
                    src={category.image} 
                    alt="category image" />
                  {category.name}
              </NavLink>
            ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user?._id}`}
          className="flex my-5 mb-3 gap-2 items-center p-2 rounded-lg shodow-lg bg-white mx-3"
          onClick={handleCloseSideBar}
        >
        <img src={user?.image} alt="user" className="w-10 h-10 rounded-full" />
        <p>{user.userName}</p>
        </Link>
      )}
    </div>
  )
}

export default Sidebar
