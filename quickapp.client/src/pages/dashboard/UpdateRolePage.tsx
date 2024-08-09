// import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/general/Spinner';
import { IAuthUser, IUpdateRoleDto } from '../../types/auth.types';
import axiosInstance from '../../utils/axiosInstance';
import { BLOCK_URL, UPDATE_PAGE_DATA, UPDATE_ROLE_URL} from '../../utils/globalConfig';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.hooks';
import { allowedRolesForUpdateArray, isAuthorizedForUpdateRole } from '../../auth/auth.utils';
import Button from '../../components/general/Button';

const UpdateRolePage = () => {
  const { user: loggedInUser } = useAuth();
  const { userName } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [role, setRole] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(user?.isBlocked);

  const getUserByUserName = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IAuthUser>(`${UPDATE_PAGE_DATA}`+`${userName}`);
      const { data } = response;
      if (!isAuthorizedForUpdateRole(loggedInUser!.roles[0], data.roles[0])) {
        setLoading(false);
        toast.error('You are not allowed to change the role of this user');
        navigate('/dashboard/users-management');
      } else {
        setUser(data);
        setRole(data?.roles[0]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 404) {
        toast.error('UserName not Found!!!');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate('/dashboard/users-management');
    }
  };

  const handleCheckboxChange = async (id: any) => {
    try {
      await axiosInstance.post<IAuthUser>(`${BLOCK_URL}`+`${id}`);
      toast.success(`User ${user?.isBlocked ? 'UnBlocked' : 'Blocked'}`);
    } catch (error) {
      const err = error as { data: string; status: number };
      toast.error(err.data);
    }
  };

  const updateRole = async () => {
    try {
      if (!role || !userName) return;
      setPostLoading(true);
      const updateData: IUpdateRoleDto = {
        newRole: role,
        userName,
      };
      await axiosInstance.post(UPDATE_ROLE_URL, updateData);
      setPostLoading(false);
      toast.success('Role updated Successfully.');
      navigate('/dashboard/users-management');
    } catch (error) {
      setPostLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error('You are not allowed to change the role of this user');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate('/dashboard/users-management');
    }
  };

  useEffect(() => {
    getUserByUserName();
  }, [checked]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className='p-4 w-4/5 mx-auto flex flex-col gap-6 bg-gray-100 rounded-md shadow-lg mt-10'>
      <div className='bg-gray-200 p-6 rounded-md flex flex-col gap-6 border border-gray-300'>
        <h1 className='text-3xl font-bold text-purple-700 text-center'>Update Role</h1>

        <div className='border border-black rounded-md p-4'>
          <h4 className='text-xl font-semibold '>
            User Name:
            <span className='text-xl ml-2 px-2 py-1 text-black  rounded-md'>{userName}</span>
          </h4>
          <h4 className='text-xl font-semibold'>
            Current Role:
            <span className='text-xl ml-2 px-2 py-1 text-black rounded-md'>{user?.roles[0]}</span>
          </h4>
        </div>
      
       
        <div className='flex items-center space-x-4'>
            <h4 className='text-xl font-bold'>New Role:</h4>
            <select
              value={role}
              className='w-60 p-2 border border-gray-300 rounded-md'
              onChange={(e) => setRole(e.target.value)}
            >
              {allowedRolesForUpdateArray(loggedInUser).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
        </div>


        <div className='mt-2'>
          <label className='font-bold flex items-center'>
            <input
              type='checkbox'
              className='w-5 h-5 mr-2'
              checked={user?.isBlocked}
              onClick={async () => {
                await handleCheckboxChange(user?.id);
                setChecked(!checked);
              }}
            />
            Block User
          </label>
        </div>

        <div className='grid grid-cols-2 gap-4 mt-2 '>
          <Button
            label='Cancel'
            onClick={() => navigate('/dashboard/users-management')}
            type='button'
            variant='secondary'
          />
          <Button
            label='Update'
            onClick={updateRole}
            type='button'
            variant='secondary'
            loading={postLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateRolePage;


