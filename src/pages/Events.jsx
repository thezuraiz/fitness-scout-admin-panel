import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaExternalLinkAlt, FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import CreateEvent from "../components/CreateEvent";
import UpdateEvent from "../components/UpdateEvent";
import { FaPlus } from "react-icons/fa6";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pastEvents, setPastEvents] = useState([]);
  const [eventsToday, setEventsToday] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot3 = await getDocs(collection(db, "upcoming_events"));
        const eventsList = [];
        querySnapshot3.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() });
        });
        setEvents(eventsList);
        categorizeEvents(eventsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const categorizeEvents = (eventsList) => {
      const today = new Date();
      const past = [];
      const todayEvents = [];
      const upcoming = [];

      eventsList.forEach((event) => {
        const eventDate = new Date(event.startTime);
        if (eventDate < today) {
          past.push(event);
        } else if (eventDate.toDateString() === today.toDateString()) {
          todayEvents.push(event);
        } else {
          upcoming.push(event);
        }
      });

      setPastEvents(past);
      setEventsToday(todayEvents);
      setUpcomingEvents(upcoming);
    };

    fetchData();
  }, [events]);

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "upcoming_events", eventToDelete);
      await deleteDoc(docRef);
      toast.success('Event deleted successfully');
      setEvents(events.filter(event => event.id !== eventToDelete));
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error('Failed to delete event');
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
    <div>
      <h1 className='text-3xl text-gray-900 text-center mt-4 font-semibold'>Events</h1>
      <h1 className='text-md text-gray-700 text-center'>All the Events throughout the Gyms.</h1>
      <div className="bg-gray-100 flex px-4 py-2 items-center justify-between">
        <h1 className="font-semibold">Total Events: {events.length}</h1>
        <button onClick={() => setShowCreatePopup(true)} className="px-4 py-1 rounded-full bg-gray-500 hover:bg-gray-700 hover:scale-95 text-white flex flex-row items-center gap-2"><FaPlus/> Add Event</button>
      </div>
      <div className="flex flex-row gap-4 p-4">
        <div className="w-4/12">
          <h2 className='text-2xl text-gray-700 text-center border-b mb-3'>Past Events({pastEvents.length})</h2>
        <div className='p-4 bg-gray-100  w-full overflow-y-scroll' style={{ height: '90vh' }}>
          <div className='grid grid-cols-1 gap-4'>
            {pastEvents.map((event) => (
                <div key={event.id} className='bg-white shadow-md rounded-md p-4'>
                <h3 className='text-xl text-center border-b font-semibold'>{event.title}</h3>
                <p className="text-gray-700 text-center mb-1">{event.description}</p>
                <p className="text-gray-700 border-t ">Contact: {event.contactNumber}</p>
                <p className="text-gray-700 ">Email: {event.email}</p>
                <p className="text-gray-700 ">Location: {event.location}</p>
                <p className="text-gray-700 border-b mb-1" >Time: {new Date(event.startTime).toLocaleString()}</p>
                <p className="text-gray-700 text-center">Price: <span className="bg-green-500 rounded-full px-2 text-white">{event.isFree === true ? 'Free' : event.price + ' Rs' || '0 Rs'}</span></p>
                <div className="flex justify-center mt-2">
                  <Link className="text-gray-600 hover:text-gray-700" target="_blank" to={event.eventLink}><FaExternalLinkAlt /></Link>
                </div>
                <div className="border-y mt-2 bg-gray-50 flex justify-center gap-4 p-3 text-gray-500">
                  <button className="hover:text-red-600" onClick={() => {
                    setEventToDelete(event.id);
                    setShowDeletePopup(true);
                  }}><FaTrash /> </button>
                </div>
              </div>
            ))}
          </div>
            </div>
        </div>
        <div className="w-4/12">
          <h2 className='text-2xl text-gray-700 text-center border-b mb-3'>Events Today({eventsToday.length})</h2>
        <div className='p-4 bg-gray-100  w-full overflow-y-scroll' style={{ height: '90vh' }}>
          <div className='grid grid-cols-1 gap-4'>
            {eventsToday.length===0?<p className="text-center text-gray-700">No Events Today!</p>:null}
            {eventsToday.map((event) => (
                <div key={event.id} className='bg-white shadow-md rounded-md p-4'>
                <h3 className='text-xl text-center border-b font-semibold'>{event.title}</h3>
                <p className="text-gray-700 text-center mb-1">{event.description}</p>
                <p className="text-gray-700 border-t ">Contact: {event.contactNumber}</p>
                <p className="text-gray-700 ">Email: {event.email}</p>
                <p className="text-gray-700 ">Location: {event.location}</p>
                <p className="text-gray-700 border-b mb-1" >Time: {new Date(event.startTime).toLocaleString()}</p>
                <p className="text-gray-700 text-center">Price: <span className="bg-green-500 rounded-full px-2 text-white">{event.isFree === true ? 'Free' : event.price + ' Rs' || '0 Rs'}</span></p>
                <div className="flex justify-center mt-2">
                  <Link className="text-gray-600 hover:text-gray-700" target="_blank" to={event.eventLink}><FaExternalLinkAlt /></Link>
                </div>
                <div className="border-y mt-2 bg-gray-50 flex justify-center gap-4 p-3 text-gray-500">
                  <button className="hover:text-red-600" onClick={() => {
                    setEventToDelete(event.id);
                    setShowDeletePopup(true);
                  }}><FaTrash /> </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className="w-4/12">
          <h2 className='text-2xl text-gray-700 text-center border-b mb-3'>Upcoming Events({upcomingEvents.length})</h2>
        <div className='p-4 bg-gray-100 w-full overflow-y-scroll' style={{ height: '90vh' }}>
          <div className='grid grid-cols-1 gap-4'>
          {upcomingEvents.length===0?<p className="text-center text-gray-700">No Upcoming Events!</p>:null}
            {upcomingEvents.map((event) => (
                <div key={event.id} className='bg-white shadow-md rounded-md p-4'>
                <h3 className='text-xl text-center border-b font-semibold'>{event.title}</h3>
                <p className="text-gray-700 text-center mb-1">{event.description}</p>
                <p className="text-gray-700 border-t ">Contact: {event.contactNumber}</p>
                <p className="text-gray-700 ">Email: {event.email}</p>
                <p className="text-gray-700 ">Location: {event.location}</p>
                <p className="text-gray-700 border-b mb-1" >Time: {new Date(event.startTime).toLocaleString()}</p>
                <p className="text-gray-700 text-center">Price: <span className="bg-green-500 rounded-full px-2 text-white">{event.isFree === true ? 'Free' : event.price + ' Rs' || '0 Rs'}</span></p>
                <div className="flex justify-center mt-2">
                  <Link className="text-gray-600 hover:text-gray-700" target="_blank" to={event.eventLink}><FaExternalLinkAlt /></Link>
                </div>
                <div className="border-y mt-2 bg-gray-50 flex justify-center gap-4 p-3 text-gray-500">
                  <button className="hover:text-blue-600" onClick={() => {
                      setSelectedEvent(event);
                      setShowUpdatePopup(true);
                    }}><FaPencilAlt /> </button>
                  <button className="hover:text-red-600" onClick={() => {
                    setEventToDelete(event.id);
                    setShowDeletePopup(true);
                  }}><FaTrash /> </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-50 rounded-md shadow-md w-7/12 pb-4">
            <div className="flex justify-end">
              <button
                className="hover:bg-gray-700 font-bold text-md py-1 m-1 text-gray-700 hover:text-white px-3 rounded-full"
                onClick={() => setShowCreatePopup(false)}
              >
                X
              </button>
            </div>
            <h1 className="text-center shadow-lg pb-3 font-semibold text-2xl mb-2">Create New Event</h1>
            <CreateEvent onClose={() => setShowCreatePopup(false)}/>
          </div>
        </div>
      )}

      {showUpdatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-50 rounded-md shadow-md w-7/12 pb-4">
            <div className="flex justify-end">
              <button
                className="hover:bg-gray-700 font-bold text-md py-1 m-1 text-gray-700 hover:text-white px-3 rounded-full"
                onClick={() => setShowUpdatePopup(false)}
              >
                X
              </button>
            </div>
            <h1 className="text-center shadow-lg pb-3 font-semibold text-2xl mb-2">Update Event</h1>
            <UpdateEvent event={selectedEvent} onClose={() => setShowUpdatePopup(false)} />
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this event?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;