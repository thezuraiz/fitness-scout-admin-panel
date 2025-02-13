import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; // Import your Firestore instance
import { FaUserAlt } from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import { LuCupSoda } from "react-icons/lu";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [plans, setPlans] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersList);

        const querySnapshot1 = await getDocs(collection(db, "Gyms"));
        const gymsList = [];
        querySnapshot1.forEach((doc) => {
          gymsList.push({ id: doc.id, ...doc.data() });
        });
        setGyms(gymsList);

        const querySnapshot2 = await getDocs(collection(db, "dietPlans"));
        const plansList = [];
        querySnapshot2.forEach((doc) => {
          plansList.push({ id: doc.id, ...doc.data() });
        });
        setPlans(plansList);

        const querySnapshot3 = await getDocs(collection(db, "upcoming_events"));
        const eventsList = [];
        querySnapshot3.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() });
        });
        setEvents(eventsList);

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

  const chartData = {
    labels: ["Users", "Gyms", "Diet Plans", "Events"],
    datasets: [
      {
        data: [users.length, gyms.length, plans.length, events.length],
        backgroundColor: ["#16A34A", "#FACC15", "#EC4899", "#3B82F6"],
        hoverBackgroundColor: ["#15803D", "#EAB308", "#DB2777", "#2563EB"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold m-2 text-center">Dashboard</h2>
      <div className="px-4 flex flex-row space-x-4">
        <div className="pb-4 hover:scale-95 duration-300 transition-all font-bold justify-items-center text-white text-2xl bg-green-600 w-3/12 rounded-md text-center">
          <p className="text-green-700 text-3xl bg-green-500 rounded-t-md mb-3 w-full justify-items-center p-3">
            <FaUserAlt />
          </p>
          <p>Users</p>
          <p className='text-4xl'>{users.length}</p>
        </div>
        <div className="pb-4 hover:scale-95 duration-300 transition-all font-bold justify-items-center text-white text-2xl bg-yellow-600 w-3/12 rounded-md text-center">
          <p className="text-yellow-700 text-3xl bg-yellow-500 rounded-t-md mb-3 w-full justify-items-center p-3">
            <CgGym />
          </p>
          <p>Gyms</p>
          <p className='text-4xl'>{gyms.length}</p>
        </div>
        <div className="pb-4 hover:scale-95 duration-300 transition-all font-bold justify-items-center text-white text-2xl bg-pink-600 w-3/12 rounded-md text-center">
          <p className="text-pink-700 text-3xl bg-pink-500 rounded-t-md mb-3 w-full justify-items-center p-3">
            <LuCupSoda />
          </p>
          <p>Diet Plans</p>
          <p className='text-4xl'>{plans.length}</p>
        </div>
        <div className="pb-4 hover:scale-95 duration-300 transition-all font-bold justify-items-center text-white text-2xl bg-blue-600 w-3/12 rounded-md text-center">
          <p className="text-blue-700 text-3xl bg-blue-500 rounded-t-md mb-3 w-full justify-items-center p-3">
            <IoCalendarNumberOutline />
          </p>
          <p>Events</p>
          <p className='text-4xl'>{events.length}</p>
        </div>
      </div>
      {/* Chart Section */}
      <div className="p-4 !w-2/5 content-center mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">Overview</h3>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
      <div className="justify-center w-full bottom-0 p-4 border-t flex flex-row">
        <p className="text-gray-400 font-bold">
          Copyright &copy; 2024-{new Date().getFullYear()}{" "}
          <span className="text-blue-600">Fitness Scout</span>. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
