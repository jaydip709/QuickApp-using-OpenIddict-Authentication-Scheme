import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hooks";
import { IAuthUser, RolesEnum } from "../../types/auth.types";
import Button from "../general/Button";
import { isAuthorizedForDeleteRole, isAuthorizedForUpdateRole } from "../../auth/auth.utils";
import { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { PATH_PUBLIC } from "../../routes/paths";
import axiosInstance from "../../utils/axiosInstance";
import { DELETE_ROLE_URL } from "../../utils/globalConfig";
import toast from "react-hot-toast";
import moment from "moment";


interface IProps {
    usersList: IAuthUser[];
}

const UsersTableSection = ({ usersList }: IProps) => {
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const roleClassNameCreator = (roles: string[]) => {
    let className = "px-3 py-1 text-white rounded-3xl";
    if (roles.includes(RolesEnum.OWNER)) {
        className += " bg-gray-600 ";
    } else if (roles.includes(RolesEnum.ADMIN)) {
        className += " bg-green-500";
    } else if (roles.includes(RolesEnum.MANAGER)) {
        className += " bg-yellow-500";
    } else if (roles.includes(RolesEnum.USER)) {
        className += " bg-indigo-500";
    }
    return className;
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`${DELETE_ROLE_URL}`+`${id}`);
      navigate("/dashboard/users-management");
      toast.success("User has been deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = usersList.filter((user) =>
    search.toLowerCase() === ""
      ? user
      : user.userName.toLowerCase().includes(search.toLowerCase()|| search.toUpperCase())
  );

  return (
    <div className="bg-slate-300 dark:bg-slate-400 p-4 rounded-lg shadow-lg" >
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            className="text-gray-700 dark:bg-slate-300 border border-gray-300  hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 w-96 h-10 pl-10 pr-2 rounded-2xl transition duration-200"
            placeholder="Search Username..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute top-0 bottom-0 flex items-center pl-3 ">
            <FaSearch className="text-gray-500 dark:text-black" />
          </div>
        </div>
        <Link
          className="text-black  bg-gray-400 dark:bg-slate-300 hover:bg-blue-300 dark:hover:bg-blue-400 px-4 py-2 rounded-2xl transition duration-200"
          to={PATH_PUBLIC.register}
        >
          <div className="flex items-center text-lg font-bold">
            <FaUserPlus className="mr-2" />
            <span>New User</span>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-2 text-lg font-bold text-black  border-b border-gray-300  py-2">
        <div className=" text-center">No</div>
        <div>Username</div>
        <div>CreationTime</div>
        <div className="text-center">Roles</div>
        <div className="text-center">Operations</div>
        <div className="text-center">Actions</div>
      </div>
      {filteredUsers.map((user, index) => (
        <div key={user.id} className="grid grid-cols-6 gap-2 font-bold text-black border-b border-gray-200 py-2 hover:bg-gray-100 transition duration-200">
          <div className="flex items-center justify-center m-2">{index + 1}</div>
          <div className="flex items-center font-semibold">{user.userName}</div>
          <div className="flex items-center font-semibold">{moment(user.createdAt).format('YYYY-MM-DD|HH:mm')}</div>

          <div className="flex justify-center items-center ">
            <span className={roleClassNameCreator(user.roles)}>{user.roles.join(", ")}</span>
          </div>
          <div className="flex justify-center items-center text-black  ">
            <Button
              type="button"
              label="Update"
              variant="secondary"
              onClick={() => navigate(`/dashboard/update-role/${user.userName}`)}
              disabled={!isAuthorizedForUpdateRole(loggedInUser!.roles[0], user.roles[0])}
            />
          </div>
          <div className="flex justify-center items-center text-black ">
            <Button
              type="button"
              label="Delete"
              variant="secondary"
              onClick={() => handleDelete(user.id)}
              disabled={!isAuthorizedForDeleteRole(loggedInUser!.roles[0], user.roles[0])}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersTableSection;
