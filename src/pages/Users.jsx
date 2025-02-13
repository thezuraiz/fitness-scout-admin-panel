import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Reference the 'users' collection in Firestore
        const querySnapshot = await getDocs(collection(db, "Users"));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() }); // Add document data and ID
        });
        setUsers(usersList); // Update state with fetched data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="justify-items-center content-center h-96">
                <div className="bg-gray-700 rounded-full h-28 content-center p-4 mb-10">
                <img
            src="/assets/logo.png" // Replace with your actual logo path
            alt="Logo"
            className={'w-20 h-12 transition-all duration-300'}
            />
            </div>
      <div className="items-center w-20 h-20 rounded-full border-8 animate-spin border-b-blue-600 border-r-blue-600"></div></div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-semibold mb-4 text-center">Users List</h2>
      <table className="table-auto w-full border border-separate border-gray-400">
        <thead className="bg-gray-200 text-gray-700"> 
          <tr>
            <th className="border border-gray-400 px-3 py-2">Full Name</th>
            <th className="border border-gray-400 px-3 py-2">User Name</th>
            <th className="border border-gray-400 px-3 py-2">Email</th>
            <th className="border border-gray-400 px-3 py-2">Phone</th>
            <th className="border border-gray-400 px-3 py-2">Height</th>
            <th className="border border-gray-400 px-3 py-2">Weight</th>
            <th className="border border-gray-400 px-3 py-2">Image</th>
            <th className="border border-gray-400 px-3 py-2">Current Package</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center  ">
              <td className="border border-gray-300 px-2 py-1">{`${user.firstName} ${ user.lastName}`}</td>
              <td className="border border-gray-300 px-2 py-1">{user.userName}</td>
              <td className="border border-gray-300 px-2 py-1">{user.email}</td>
              <td className="border border-gray-300 px-2 py-1">{user.phoneNumber}</td>
              <td className="border border-gray-300 px-2 py-1">{user.height}</td>
              <td className="border border-gray-300 px-2 py-1">{user.weight}</td>
              <td className="border border-gray-300 px-2 py-1 justify-items-center"><img className="w-12 h-12 rounded-full"  src={user.profilePicture} alt={user.userName} /></td>
              <td className="border border-gray-300 px-2 py-1">{user.currentPackage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
