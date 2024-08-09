// import React from 'react'
import { useEffect, useState } from "react";
import { IAuthUser } from "../../types/auth.types";
import axiosInstance from "../../utils/axiosInstance";
import { USERS_LIST_URL } from "../../utils/globalConfig";
import toast from "react-hot-toast";
import AuthSpinner from "../../components/general/AuthSpinner";
import UsersTableSection from "../../components/users-management/UsersTableSection";
import { ThemeProvider } from "../../components/ThemeContext";
import ThemeSlider from "../../components/ThemeSlider";

const UserManagementPage = () => {
  const [users, setUsers] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsersList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IAuthUser[]>(USERS_LIST_URL);
      const {data} = response;
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error('An Error occurred. Please Contact admins');
      setLoading(false);
    }
  };

  useEffect(() =>{
    getUsersList();
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
      <div className="flex flex-col p-4  h-full bg-gray-100 dark:bg-gray-600">
      <ThemeSlider/>

      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Users Management</h1>
      <div className="overflow-y-auto">
      <UsersTableSection usersList={users} />
      </div>
      
      </div>  
    </ThemeProvider>
  );
};

export default UserManagementPage;