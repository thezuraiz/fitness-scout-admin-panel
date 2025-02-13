import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaArrowCircleLeft, FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Transactions = () => {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransactionIndex, setSelectedTransactionIndex] = useState(null);
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

  const handleUpdateStatus = async () => {
    if (selectedTransactionIndex !== null) {
      const updatedTransactions = [...gym.transactions];
      updatedTransactions[selectedTransactionIndex].transactionStatus = 'Paid';
      try {
        const docRef = doc(db, "Gyms", id);
        await updateDoc(docRef, { transactions: updatedTransactions });
        setGym((prevGym) => ({
          ...prevGym,
          transactions: updatedTransactions,
        }));
        setShowPopup(false);
        toast.success('Transaction status updated successfully');
      } catch (error) {
        console.error("Error updating document:", error);
        toast.error('Failed to update transaction status');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
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
      <h1 className='text-3xl text-gray-900 text-center mt-4 font-semibold'>{gym.gym_name} Transactions History</h1>
      <p className='text-gray-600 text-center'>List of all the transactions by {gym.gym_name}</p>
      <div className="flex flex-row justify-between px-4 mt-2 bg-gray-100 py-4">
        <p className="bg-slate-200 px-2 py-1 rounded-full font-semibold text-gray-700">Total Transactions: {gym.transactions?.length}</p>
        <button onClick={() => navigate(`/gym-detail/${gym.id}`)} className="bg-slate-200 px-4 py-1 rounded-full hover:bg-slate-300 transition-all hover:shadow-lg duration-300 text-gray-700 font-semibold flex flex-row items-center gap-1" >
          {<FaArrowCircleLeft />}  Go Back
        </button>
      </div>
      <div className='p-6'>
        <table className=" w-full border border-separate border-gray-400">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border border-gray-400 px-3 py-2">Transaction Date</th>
              <th className="border border-gray-400 px-3 py-2">Method</th>
              <th className="border border-gray-400 px-3 py-2">Status</th>
              <th className="border border-gray-400 px-3 py-2">Amount</th>
              <th className="border border-gray-400 px-3 py-2">Message</th>
              <th className="border border-gray-400 px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gym.transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-700 py-4">No transactions available</td>
                </tr>)}
            {gym.transactions.map((tran, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-2 py-1">{formatDate(tran.requested_date)}</td>
                <td className="border border-gray-300 px-2 py-1">{tran.transactionMethod || 'Unknown'}</td>
                <td className="border border-gray-300 px-2 py-1">{tran.transactionStatus}</td>
                <td className="border border-gray-300 px-2 py-1">{tran.widthDrawAmount}</td>
                <td className="border border-gray-300 px-2 py-1">{tran.message || 'None'}</td>
                <td className="border border-gray-300 px-2 py-1 justify-items-center">
                  <button
                  disabled={tran.transactionStatus === 'Paid'}
                    className='text-gray-600 hover:text-gray-900'
                    title='Update Status'
                    onClick={() => {
                      setSelectedTransactionIndex(index);
                      setShowPopup(true);
                    }}
                  >
                    {<FaPencilAlt />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Update</h2>
            <p>Are you sure you want to update the status to 'Paid'?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-md"
                onClick={handleUpdateStatus}
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

export default Transactions;