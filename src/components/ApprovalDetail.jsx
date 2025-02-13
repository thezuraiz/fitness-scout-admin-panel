import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { toast } from "react-toastify";

const ApprovalDetail = ({ gym }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const navigate = useNavigate();
  const [gymType, SetgymType] = useState(gym.gymType);

  const handleUpdateApproval = async () => {
    try {
      const docRef = doc(db, "Gyms", gym.id);
      await updateDoc(docRef, { isApproved: "Approved", gym_type: gymType });
      setShowPopup(false);
      toast.success("Gym Approved successfully");
      navigate("/gyms");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update Approval Status");
    }
  };

  const handleRejectGym = async () => {
    try {
      const docRef = doc(db, "Gyms", gym.id);
      await updateDoc(docRef, { isApproved: "Not-Approved" });
      setShowPopup(false);
      toast.success("Gym Rejected");
      navigate("/gyms");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update Approval Status");
    }
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setShowPopup(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "approve") {
      handleUpdateApproval();
    } else if (actionType === "reject") {
      handleRejectGym();
    }
  };

  return (
    <div
      className="w-full p-4 gap-4 justify-center overflow-y-scroll "
      style={{ height: "80vh" }}
    >
      <div className="w-full bg-gray-100 shadow-md gap-4 flex flex-row rounded-md p-4 justify-items-center">
        <img
          src={gym.images[0] || "/assets/DefaultGym.png"}
          alt={gym.gym_name}
          className="hover:scale-105 duration-300 transition-all w-6/12 h-56 object-cover rounded-md my-4"
        />
        <div className="content-center">
          <p className=" text-lg ">{gym.description}</p>
          <p className="!text-start text-gray-700">Location: {gym.address}</p>
          <p className="!text-start text-gray-700">
            Contact Number: {gym.contact_number}
          </p>
          <p className="!text-start text-gray-700">
            Contact Email: {gym.email}
          </p>
          <p className="!text-start text-gray-700">
            Gym Type: {gym.gymType || "Not_Decided"}
            <div className="!text-start text-gray-700">
              Gym Type:
              <select
                value={gym.gymType}
                onChange={(e) => SetgymType(e.target.value)}
                className="ml-2 p-1 border rounded-md"
              >
                <option value={gym.gym_type || "Not_Decided"}>
                  {gym.gymType || "Not_Decided"}
                </option>
                <option value="Basic">Basic</option>
                <option value="Silver">Silver</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-100 shadow-md justify-items-center rounded-md">
        <div className="border-t w-full p-4 mb-4">
          <h1 className="text-2xl text-center border-b bg-gray-100 py-2 font-semibold">
            Amenities
          </h1>
          <div className="flex flex-row gap-2 flex-wrap justify-center my-2">
            {gym.amenities.length > 0 ? (
              gym.amenities?.map((data, index) => (
                <p
                  key={index}
                  className={`rounded-full bg-gray-200 px-4 py-1 ${
                    data.isSelected === false ? "hidden" : ""
                  } `}
                >
                  {data.name}
                </p>
              ))
            ) : (
              <p className="text-gray-600 text-lg mt-4 text-center">
                No Amenities Found
              </p>
            )}
          </div>
        </div>
        <div className="border-t w-full p-4">
          <h1 className="text-2xl text-center border-b bg-gray-100 py-2 font-semibold">
            Liscence
          </h1>
          <div className="flex justify-center my-2">
            <img
              className="rounded-md hover:scale-110 duration-300 transition-all"
              src={gym.license || "/assets/DefaultGym.png"}
              alt="License-image"
            />
          </div>
        </div>
        <div className="border-t w-full p-4 text-center ">
          <h1 className="text-2xl text-center border-b bg-gray-100 py-2 font-semibold">
            Owner Info
          </h1>
          <h1 className="text-gray-700 text-lg mt-4">Owner Name: {gym.name}</h1>
          <h1 className="text-gray-700 text-lg ">
            Owner Phone: {gym.contact_number}
          </h1>
          <h1 className="text-gray-700 text-lg mb-4">
            Owner Email: {gym.email}
          </h1>
        </div>
      </div>
      <div className="bg-gray-200 my-4 w-full rounded-lg flex items-center justify-center space-x-4 py-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          onClick={() => handleActionClick("approve")}
        >
          Approve Gym
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          onClick={() => handleActionClick("reject")}
        >
          Reject Gym
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Update</h2>
            <p>
              Are you sure you want to{" "}
              {actionType === "approve" ? "Approve" : "Reject"} this Gym?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-md"
                onClick={handleConfirmAction}
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

export default ApprovalDetail;
