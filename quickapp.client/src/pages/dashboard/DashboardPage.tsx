// import React from 'react';
import { FaUserCog, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import ThemeSlider from "../../components/ThemeSlider";
import { ThemeProvider } from "../../components/ThemeContext";


const DashboardPage = () => {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-700 p-8">
        <ThemeSlider />
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard Access Levels</h1>

        <div className="bg-slate-300 dark:bg-gray-500 p-6 rounded-lg shadow-lg w-full h-full" >
          <h2 className="text-3xl font-bold text-black dark:text-gray-300 flex justify-center mt-4 mb-4">Available Roles:</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">

            <div className="p-4 bg-gray-200 dark:bg-slate-400 rounded-lg shadow-md transition-transform transform hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105">
              <div className="flex items-center mb-2">
                <FaUserCog className="text-black-500 mr-2 text-2xl" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-black mt-2">Owner</h3>
              </div>
              <p className="font-semibold text-gray-600 dark:text-black">Full access and control over the dashboard.</p>
            </div>

            <div className="p-4 bg-gray-200 dark:bg-slate-400 rounded-lg shadow-md transition-transform transform hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105">
              <div className="flex items-center mb-2">
                <FaUserShield className="text-black-500 mr-2 text-2xl" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-black mb-2">Admin</h3>
              </div>
              <p className="font-semibold text-gray-600 dark:text-black">Manage settings and user roles.</p>
            </div>

            <div className="p-4 bg-gray-200 dark:bg-slate-400 rounded-lg shadow-md transition-transform transform hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105">
              <div className="flex items-center mb-2">
                <FaUserTie className="text-black-500 mr-2 text-2xl" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-black mb-2">Manager</h3>
              </div>
              <p className="font-semibold text-gray-600 dark:text-black">Oversee and manage day-to-day operations.</p>
            </div>
            
            <div className="p-4 bg-gray-200 dark:bg-slate-400 rounded-lg shadow-md transition-transform transform hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105">
              <div className="flex items-center mb-2">
                <FaUser className="text-black-500 mr-2 text-2xl" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-black mb-2">User</h3>
              </div>
              <p className="font-semibold text-gray-600 dark:text-black">Access to basic features and data.</p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardPage;

