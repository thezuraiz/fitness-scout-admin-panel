import React from 'react';
import moment from "moment"; // For displaying current date

const Navbar = () => {
    const currentDate = moment().format("MMMM Do YYYY");

    return (
        <div className="flex justify-between items-center p-4 border-b border-gray-500 bg-gray-700 text-white">
          <h2 className="text-2xl font-extralight">Fitness Scout Admin</h2>
          <span>{currentDate}</span>
        </div>
    );
};

export default Navbar;