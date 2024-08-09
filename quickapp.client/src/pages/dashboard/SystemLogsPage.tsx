// import React from 'react'
import { useEffect, useState } from "react";
import { ILogDto } from "../../types/log.types";
import axiosInstance from "../../utils/axiosInstance";
import { LOGS_URL } from "../../utils/globalConfig";
import toast from "react-hot-toast";
import moment from "moment";
import AuthSpinner from "../../components/general/AuthSpinner";
import { ThemeProvider } from "../../components/ThemeContext";
import ThemeSlider from "../../components/ThemeSlider";


const SystemLogsPage = () => {
  const [logs, setLogs] = useState<ILogDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getLogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ILogDto[]>(LOGS_URL);
      const { data } = response;
      setLogs(data);
      setLoading(false);
    } catch (error) {
      toast.error('An Error occurred. Please Contact admins');
      setLoading(false);
    }
  };
  useEffect(() => {
    getLogs();
  },[]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <AuthSpinner />
      </div>
    );
  }
  return (
    <ThemeProvider>
    <div className="flex flex-col p-4  h-full bg-gray-100 dark:bg-slate-400">
      <ThemeSlider />
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">System Logs</h1>
      <div className="grid grid-cols-6 p-2 text-xl font-bold  text-gray-900 dark:text-black border-2 border-gray-300 rounded-lg mb-2">
        <span className="font-bold ">No</span>
        <span className="font-bold">Date</span>
        <span className="font-bold">Username</span>
        <span className="col-span-3 font-bold">Description</span>
      </div>
      <div className="overflow-y-auto">
        {logs.map((item, index) => (
          <div key={index} className="grid grid-cols-6 p-2 font-semibold  text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-black rounded-lg mb-2">
            <span>{index + 1}</span>
            <span>{moment(item.createdAt).fromNow()}</span>
            <span>{item.userName}</span>
            <span className='col-span-3'>{item.description}</span>
          </div>
        ))}
      </div>
    </div>
    </ThemeProvider>
  );
};

export default SystemLogsPage