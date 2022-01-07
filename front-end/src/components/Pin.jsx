import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { urlFor, client } from '../client'
import { v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({pin: {postedBy, image, _id, destination, save}}) => {
  const navigate = useNavigate()
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const user = fetchUser();
  const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.googleId))?.length;
  const savePin = (id) => {
    if(!alreadySaved){
      setSavingPost(true)
      client
        .patch(id)
        .setIfMissing({ save: []})
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.googleId,
          postedBy:{
            _type: 'postedby',
            _ref: user?.googleId
          }
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false)
        })
    }
  }

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      })
  }
  return (
    <div className="m-2">
      <div 
        onMouseEnter={ () => setPostHovered(true)}
        onMouseLeave={ () => setPostHovered(false)}
        onClick={ () => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden trasition-all duration-500 ease-in-out"
      >
      <img src={urlFor(image).width(250).url()} className="rounded-lg w-full" alt="post" />
      {postHovered && (
        <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 z-50" style={{height: "100%"}}>
          <div className="flex items-center justify-between">
            <div className="flex ga-2">
              <a href={`${image?.asset?.url}?dl=`}
               download
               onClick={ (e) => e.stopPropagation()} // for image download
               className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
               >
                <MdDownloadForOffline />
              </a>
            </div>
            {
              alreadySaved ? (
                <button 
                  type="button"
                  className="rounded-3xl hover:shadow-md outline-none text-base bg-red-500 opacity-70 hover:opacity-100 px-5 py-1 text-white"
                >{save?.length} Saved</button>
              ) : (
                <button
                  type="button"
                  onClick= { (e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className="rounded-3xl hover:shadow-md outline-none text-base bg-red-500 opacity-70 hover:opacity-100 px-5 py-1 text-white"
                >{savingPost ? 'saving' : 'Save'}</button>
              )
            }
          </div>
          <div className="flex justify-between items-center gap-2 w-full">
            {
              destination && (
                <a 
                  href={destination}
                  target="_blank"
                  rel="norefferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                </a>
              )
            }
            {postedBy?._id === user?.googleId && (
              <button
                type="button"
                onClick={ (e) => {
                  e.stopPropagation();
                  deletePin(_id)
                }}
                className="rounded-3xl hover:shadow-md outline-none text-base bg-white opacity-70 hover:opacity-100 px-5 py-2 text-dark font-bold"
                >
                  <AiTwotoneDelete />
              </button>
            )}
          </div>
        </div>
      )}
      </div>
      <Link className="flex gap-2 mt-2 items-center" to={`user-profile/${postedBy?._id}`}>
          <img src={postedBy?.image} className="w-8 h-8 rounded-full object-cover" alt="profile" />
          <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  )
}

export default Pin
