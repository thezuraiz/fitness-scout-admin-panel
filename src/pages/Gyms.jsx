import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaArrowCircleRight, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Gyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notApprovedCount, setNotApprovedCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot1 = await getDocs(collection(db, "Gyms"));
        const gymsList = [];
        let notApproved = 0;
        querySnapshot1.forEach((doc) => {
          const gymData = doc.data();
          if (gymData.isApproved !== "Pending") {
            gymsList.push({ id: doc.id, ...gymData });
          } else if (gymData.isApproved === "Pending") {
            notApproved++;
          }
        });
        setGyms(gymsList);
        setNotApprovedCount(notApproved);
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
        Associated Gyms
      </h1>
      <p className="text-gray-600 text-center">
        List of all the gyms associated with us
      </p>
      <div className="flex flex-row justify-between px-4 mt-2 bg-gray-100 py-4">
        <p className="bg-slate-200 px-2 py-1 rounded-full font-semibold text-gray-700">
          Total Gyms: {gyms.length}
        </p>
        <button
          onClick={() => navigate("/approvals")}
          className="bg-slate-200 px-4 py-1 rounded-full hover:bg-slate-300 transition-all hover:shadow-lg duration-300 text-gray-700 font-semibold flex flex-row items-center gap-1"
        >
          Approval Requests{" "}
          <span className="bg-red-600 rounded-full px-2 text-sm absolute mb-8 ml-40 text-white">
            {notApprovedCount}
          </span>{" "}
          {<FaArrowCircleRight />}
        </button>
      </div>
      <div className="grid grid-cols-1 p-4 gap-4">
        {gyms.map((gym) => (
          <div
            key={gym.id}
            className="bg-gradient-to-r from-gray-50 to-slate-300 shadow-xl rounded-md p-4 flex flex-row justify-between hover:ring-4 transition-all duration-300 "
          >
            <div className="flex flex-row space-x-6 w-5/6">
              <img
                src={gym.images[0] || "/assets/DefaultGym.png"}
                alt={gym.gym_name}
                className="w-4/12 h-44 object-cover rounded-md"
              />
              <div className="[&>*]:mb-1">
                <h2 className="text-2xl font-semibold text-gray-900 ">
                  {gym.gym_name || "Gym Name"}
                </h2>
                <p className="text-gray-600 mt-2">
                  Address: {gym.address || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Contact Number: {gym.contact_number || "Not Available"}
                </p>
                <p className="text-gray-600 ">
                  Contact Email: {gym.email || "Not Available"}
                </p>

                {gym.isApproved !== "Not-Approved" ? (
                  <button
                    className={`text-gray-600 rounded-md py-2 my-1 px-3 ${
                      gym.gym_type === "Silver"
                        ? "bg-yellow-200"
                        : gym.gym_type === "Diamond"
                        ? "bg-green-400"
                        : "bg-blue-400 text-white"
                    }`}
                  >
                    Gym Type: {gym.gym_type || "Not Available"}
                  </button>
                ) : (
                  <div></div>
                )}
                <p className="text-gray-600">
                  Is Gym Approved: {gym.isApproved || "Not Available"}
                </p>
                <p className="text-yellow-600 flex flex-row items-center gap-2">
                  {gym.ratings}
                  {<FaStar />}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate(`/gym-detail/${gym.id}`)}
                className="bg-transparent hover:bg-slate-400 h-full text-gray-600 hover:text-gray-200 rounded-lg px-8 py-2 hover:scale-110 duration-300 transition-all text-2xl"
                title="View More"
              >
                {" "}
                {<FaArrowCircleRight />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gyms;
