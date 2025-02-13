import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  eventId: yup.string().required('Event ID is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  description: yup.string().required('Description is required'),
  contactNumber: yup.string().required('Contact Number is required'),
  eventLink: yup.string().url('Invalid URL').required('Event Link is required'),
  location: yup.string().required('Location is required'),
  price: yup.number().required('Price is required').min(0, 'Price must be at least 0'),
  startTime: yup.date().required('Start Time is required').min(new Date(), 'Start Time cannot be in the past'),
});

const UpdateEvent = ({ event, onClose }) => {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "upcoming_events", event.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const eventData = docSnap.data();
          eventData.startTime = new Date(eventData.startTime).toISOString().slice(0, 16);
          reset(eventData);
        } else {
          console.error("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [event, reset]);

  const onSubmit = async (data) => {
    const eventData = {
      ...data,
      isFree: data.price > 0 ? false : true,
      startTime: new Date(data.startTime).toISOString(),
    };

    try {
      const docRef = doc(db, "upcoming_events", event.id);
      await updateDoc(docRef, eventData);
      toast.success('Event updated successfully');
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error('Failed to update event');
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2 p-4 overflow-y-scroll" style={{height: '80vh'}}>
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Event ID</label>
        <input
          type="text"
          {...register('eventId')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.eventId && <p className="text-red-500">{errors.eventId.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Contact Number</label>
        <input
          type="text"
          {...register('contactNumber')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Event Link</label>
        <input
          type="text"
          {...register('eventLink')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.eventLink && <p className="text-red-500">{errors.eventLink.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Location</label>
        <input
          type="text"
          {...register('location')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          {...register('price')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          {...register('startTime')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div className="col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          Update Event
        </button>
      </div>
    </form>
  );
};

export default UpdateEvent;
