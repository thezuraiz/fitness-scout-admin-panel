import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaArrowCircleLeft, FaArrowCircleRight, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApprovalDetail from "../components/ApprovalDetail";

const Approvels = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot1 = await getDocs(collection(db, "Gyms"));
        const gymsList = [];
        querySnapshot1.forEach((doc) => {
          const gymData = doc.data();
          if (gymData.isApproved === "Pending") {
            gymsList.push({ id: doc.id, ...gymData });
          }
        });
        setGyms(gymsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      <h1 className="text-3xl text-gray-900 text-center mt-4 font-semibold">
        Approvel Requests
      </h1>
      <p className="text-gray-600 text-center">
        List of all the gyms Waiting to be Approved
      </p>
      <div className="flex flex-row justify-between px-4 mt-2 bg-gray-100 py-4">
        <p className="bg-slate-200 px-2 py-1 rounded-full font-semibold text-gray-700">
          Total Requests: {gyms.length}
        </p>
        <button
          onClick={() => navigate("/gyms")}
          className="bg-slate-200 px-4 py-1 rounded-full hover:bg-slate-300 transition-all hover:shadow-lg duration-300 text-gray-700 font-semibold flex flex-row items-center gap-1"
        >
          {<FaArrowCircleLeft />} Go Back
        </button>
      </div>
      <div className="grid grid-cols-1 p-4 gap-4">
        {gyms.length === 0 && (
          <div className="text-center text-gray-600 font-semibold text-xl">
            No Requests Pending
          </div>
        )}
        {gyms.map((gym) => (
          <div
            key={gym.id}
            className="bg-gradient-to-r from-gray-50 to-slate-300 shadow-xl rounded-md p-4 flex flex-row justify-between hover:scale-95 transition-all duration-300"
          >
            <div className="flex flex-row space-x-6 w-5/6 ">
              <img
                src={gym.images[0] || "/assets/DefaultGym.png"}
                alt={gym.gym_name}
                className="w-4/12 h-44 object-cover rounded-md"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {gym.gym_name || "Gym Name"}
                </h2>
                <p className="text-gray-600">
                  Address: {gym.address || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Contact Number: {gym.contact_number || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Contact Email: {gym.email || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Gym Type: {gym.gymType || "Not_Decided"}
                </p>
                <p className="text-yellow-600 flex flex-row items-center">
                  {gym.ratings}
                  {<FaStar />}
                </p>
              </div>
            </div>
            <div>
              <button
                className="bg-transparent hover:bg-slate-400 h-full text-gray-600 hover:text-gray-200 rounded-lg px-8 py-2 hover:scale-110 duration-300 transition-all text-2xl"
                title="View More"
                onClick={() => {
                  setSelectedGym(gym);
                  setShowPopup(true);
                }}
              >
                {<FaArrowCircleRight />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-50 rounded-md shadow-md w-7/12 pb-4">
            <div className="flex justify-end">
              <button
                className="hover:bg-gray-700 font-bold text-md py-1 m-1 text-gray-700 hover:text-white px-3 rounded-full"
                onClick={() => setShowPopup(false)}
              >
                X
              </button>
            </div>
            <h1 className="text-center shadow-lg pb-3 font-semibold text-2xl mb-2">
              Approval Request By {selectedGym.gym_name || "Gym Name"}
            </h1>
            <ApprovalDetail gym={selectedGym} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvels;
