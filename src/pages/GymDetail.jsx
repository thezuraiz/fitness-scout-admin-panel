import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaArrowAltCircleRight, FaStar } from 'react-icons/fa';

const GymDetail = () => {
    const { id } = useParams();
    const [gym, setGym] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "Gyms", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setGym({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.error("No such document!");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [id]);        

    if (loading) {
      return (
        <div className="justify-items-center content-center h-96">
          <div className="bg-gray-700 rounded-full h-28 content-center p-4 mb-10">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className={"w-20 h-12 transition-all duration-300"}
            />
          </div>
          <div className="items-center w-20 h-20 rounded-full border-8 animate-spin border-b-blue-600 border-r-blue-600"></div>
        </div>
      );
    }


    return (
        <div className='w-full p-4 gap-4 flex flex-row justify-center'>
            <div className='w-8/12 bg-gray-50 shadow-md rounded-md p-4 justify-items-center'>
            <h1 className='text-3xl font-bold'>{gym.gym_name}</h1>
            <img src={gym.images[0] || '/assets/DefaultGym.png'} alt={gym.gym_name} className='hover:scale-105 duration-300 transition-all w-10/12 h-80 object-cover rounded-md my-4'/>
            <p className=' text-lg '>{gym.description}</p>
            <p className='!text-start text-gray-700'>Location: {gym.address}</p>
            <p className='!text-start text-gray-700'>Contact Number: {gym.contact_number}</p>
            <p className='!text-start text-gray-700'>Contact Email: {gym.email}</p>
            <p className='!text-start text-gray-700'>Gym Type: {gym.gym_type || 'Not Found'}</p>
            <div className='border-t w-full p-4'>
                <h1 className='text-2xl text-center border-b bg-gray-100 py-2 font-semibold'>Opening Hours</h1>
                    <div className='flex flex-col justify-center gap-2'>
                    {gym.opening_hours.length>0? gym.opening_hours.map((data, index) => (
                        <h1 key={index} className='text-gray-700 text-lg mt-4 text-center'>{data}</h1>
                    ))
                    :
                    <h1 className='text-gray-700 text-lg mt-4 text-center'>9:00 AM - 06:00 PM</h1>
                }
                </div>
            </div>

            </div>

            <div className='w-4/12 bg-gray-50 shadow-md justify-items-center rounded-md'>
            <button onClick={()=>navigate(`/transactions/${gym.id}`)} className='hover:shadow-lg hover:bg-gray-300 flex flex-row bg-gray-200 items-center rounded-full m-4  px-4 py-2 w-4/5 justify-center gap-2 font-semibold'>Trnasactions History {<FaArrowAltCircleRight/>}</button>
            <div className='border-t w-full p-4 mb-4'>
                <h1 className='text-2xl text-center border-b bg-gray-100 py-2 font-semibold'>Amenities</h1>
                <div  className='flex flex-row gap-2 flex-wrap justify-center my-2'>
                {gym.amenities?.map((data, index) => (
                        <p key={index} className={`rounded-full bg-gray-100 px-4 py-1 ${data.isSelected===false? 'hidden':''} `}>{data.name}</p>
                    ))}
                    </div>
            </div>
            <div className='border-t w-full p-4'>
                <h1 className='text-2xl text-center border-b bg-gray-100 py-2 font-semibold'>Liscence</h1>
                <div  className='flex justify-center my-2'>
                       <img className='rounded-md hover:scale-105 duration-300 transition-all' src={gym.license|| '/assets/DefaultGym.png'} alt='License-image'/> 
                    </div>
            </div>
            <div className='border-t w-full p-4'>
                <h1 className='text-2xl text-center border-b bg-gray-100 py-2 font-semibold'>Owner Info</h1>
                    <h1 className='text-gray-700 text-lg mt-4'>Owner Name: {gym.name}</h1>
                    <h1 className='text-gray-700 text-lg '>Owner Phone: {gym.contact_number}</h1>
                    <h1 className='text-gray-700 text-lg mb-4'>Owner Email: {gym.email}</h1>
            </div>
            <div className='border-t w-full p-4'>
                    <h1 className='text-gray-700 text-lg text-center'>Total Visitors: {gym.visitors?.length}</h1>
            </div>
            <div className='border-t w-full p-4 flex flex-row justify-center gap-2'>
                <p className='text-center text-gray-700'>Rated:</p>
                <p className='text-center text-yellow-500 flex flex-row items-center'>{gym.ratings}{<FaStar/>}</p>
            </div>

            </div>
        </div>
    );
};

export default GymDetail;