import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaArrowCircleRight } from "react-icons/fa";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import CreatePlan from "../components/CreatePlan";
import PlanDetail from "../components/PlanDetail";

const DietPlans = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState([]);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot2 = await getDocs(collection(db, "dietPlans"));
                const plansList = [];
                querySnapshot2.forEach((doc) => {
                    plansList.push({ id: doc.id, ...doc.data() });
                });
                setPlans(plansList);
                console.log(plansList);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [showCreatePopup]);

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


      const handleDelete = async () => {
        try {
          const docRef = doc(db, "dietPlans", planToDelete);
          await deleteDoc(docRef);
          toast.success('Plan deleted successfully');
          setPlans(plans.filter(plan => plan.id !== planToDelete));
          setShowDeletePopup(false);
        } catch (error) {
          console.error("Error deleting event:", error);
          toast.error('Failed to delete event');
        }
      };
    

    return (
        <div>
            <h1 className='text-3xl text-gray-900 text-center mt-4 font-semibold'>Diet Plans</h1>
            <h1 className='text-md text-gray-700 text-center'>All the Diet Plans recommended by professionals.</h1>
            <div className="bg-gray-100 flex px-4 py-2 items-center justify-between">
                <h1 className="font-semibold">Total Plans: {plans.length}</h1>
                <button onClick={()=>setShowCreatePopup(true)} className="px-4 py-1 rounded-full bg-gray-500 hover:bg-gray-700 hover:scale-95 text-white flex flex-row items-center gap-2"><FaPlus/> Add Plan</button>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-4">
                {plans.length===0?<h1 className="text-center text-gray-700 mt-4">No Plans Available!</h1>:null}
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-gray-50 m-4 p-4 rounded-md shadow-md">
                        <p className="text-gray-700">Calories: <b>{plan.calories}</b></p>
                        <p className="text-gray-700">Dietary Preference: {( plan.dietaryPreference)}</p>
                        <div className="flex justify-center gap-2 mt-4 bg-white text-gray-500">
                            <button
                            onClick={()=>{
                                setSelectedPlan(plan);
                                setShowDetailPopup(true);
                            }}
                            title="View Detail" className="px-4 py-1 rounded-full hover:text-gray-700"><FaArrowCircleRight /></button>
                            <button
                            onClick={() => {
                                setPlanToDelete(plan.id);
                                setShowDeletePopup(true);
                              }}
                            title="Delete Plan" className="px-4 py-1 rounded-full hover:text-red-700 "><FaTrash /></button>
                        </div>
                    </div>
                ))}
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
            <h1 className="text-center shadow-lg pb-3 font-semibold text-2xl mb-2">Create New Diet Plan</h1>
            <CreatePlan onClose={() => setShowCreatePopup(false)}/>
          </div>
        </div>
      )}

            {showDetailPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-50 rounded-md shadow-md w-7/12 pb-4">
            <div className="flex justify-end">
              <button
                className="hover:bg-gray-700 font-bold text-md py-1 m-1 text-gray-700 hover:text-white px-3 rounded-full"
                onClick={() => setShowDetailPopup(false)}
              >
                X
              </button>
            </div>
            <h1 className="text-center shadow-lg pb-3 font-semibold text-2xl mb-2">{selectedPlan.dietaryPreference}</h1>
            <PlanDetail plan={selectedPlan}/>
          </div>
        </div>
      )}

            
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this Plan?</p>
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

export default DietPlans;