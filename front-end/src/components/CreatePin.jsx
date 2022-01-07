import React, {useState} from 'react';
import {AiOutlineCloudDownload, AiOutlineCloudUpload} from 'react-icons/ai';
import {MdDelete} from 'react-icons/md';
import {client} from '../client';
import {useNavigate} from 'react-router-dom';
import Spinner from './Spinner';
import { categories } from '../utils/data';

const CreatePin = ({user}) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const {type, name} = e.target.files[0];
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpg' || type === 'image/gif' || type === 'image/jpeg'){
      setWrongImageType(false)
      setLoading(true);
      client.assets
        .upload('image', e.target.files[0], { contentType: type, filename: name})
        .then((document) => {
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error) => {
          console.log('image upload error', error)
        })
    }else{
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category ){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        category,
        userId: user._id,
        postedBy: {
          _type: 'postedby',
          _ref: user._id
        }
      }
      client
      .create(doc)
      .then(() => {
        navigate('/')
      })
    }else{
      setFields(true);
      setTimeout(() => {
        setFields(false)
      }, 2000);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 text-xl transition-all duration-150 ease-in">
          Please enter all fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bh-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-3xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use high-quality JPG, SVG, GIF or less than 20MB
                  </p>
                </div>
                <input 
                  type="file" 
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                  id="" />
              </label>
            ): (
              <div className="relative h-full ">
                <img src={imageAsset?.url} alt="upload-pic" className="h-full w-full" />
                <button 
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow:md transition-all duration-500 ease-in-out"
                  onClick={ () => setImageAsset(null) }
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
              <input 
                type="text" 
                name="title"
                value={title}
                onChange={ (e) => setTitle(e.target.value)}
                placeholder="Add Your Title"
                className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2" 
                id="" 
              />
                {
                  user && (
                    <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                      <img 
                        src={user.image}
                        alt="user"
                        className="w-10 h-10 rounded-full"
                       />
                       <p className="font-bold">{user.userName}</p>
                    </div>
                  )}
              <input 
                type="text" 
                name="about"
                value={about}
                onChange={ (e) => setAbout(e.target.value)}
                placeholder="What is your pin about"
                className="outline-none sm:text-lg  border-b-2 border-gray-200 p-2" 
                id="" 
              />
              <input 
                type="text" 
                name="destination"
                value={destination}
                onChange={ (e) => setDestination(e.target.value)}
                placeholder="Enter the Image's destination"
                className="outline-none sm:text-lg  border-b-2 border-gray-200 p-2" 
                id="" 
              />
              <div className="flex flex-col">
                <div>
                  <p className="mt-2 font-semibold text-lg sm:text-lg">Choose Pin Category</p>
                  <select 
                    onChange={ (e) => setCategory(e.target.value)}
                    className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                    name="" 
                    id="">
                      <option value="other" className="bg-white">Select Category</option>
                      {categories.map((category, key) => (
                        <option 
                          value={category.name}
                          key={key} 
                          className="text-base border-0 outline-none capitalize bg-white text-black"
                        >
                          {category.name} 
                        </option>
                      ))}
                    </select>
                </div> 
                <div className="flex justify-end items-end mt-5">
                  <button
                    type="button"
                    onClick={savePin}
                    className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                  >
                    Save Pin
                  </button>

                </div>
              </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
