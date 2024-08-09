// import React from 'react'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ILoginDto } from "../../types/auth.types";
import { PATH_PUBLIC } from "../../routes/paths";
import { Link } from "react-router-dom";
import Button from "../../components/general/Button";
import useAuth from "../../hooks/useAuth.hooks";
import toast from "react-hot-toast";
import backgroundImage from  "../../assets/img/5.jpg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ILoginDto>({ mode:"onChange",
    defaultValues: {
      userName:'',
      password:'',
    },
  });

  const onSubmit = async(data:ILoginDto) => {
    try {
      setLoading(true);
      await login(data.userName, data.password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 401) {
        toast.error('User not found');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
    }
  }
  
  return (
    
    <div className="justify-content-center bg-cover d-flex h-screen " style={{ backgroundImage: `url(${backgroundImage})` ,  opacity:"0.9"}}>
      <div className="mb-3 ml-9 mr-9 form ">
        <form onSubmit={handleSubmit(onSubmit)} className="p-16">

        <h2 className="text-5xl font-bold text-center mb-2 h2 display-2 text-gray-800 ">Sign In!</h2>

        <div className="mb-1 mt-4">
            <label className="block text-lg font-bold text-black-900">Username</label>
            <input
              type="text"
              {...register("userName", { required: "Username is required", minLength: { value: 4, message: "Minimum length is 4" } })}
              className="mt-1 p-2 border rounded w-full"
            />
            {errors.userName && <span className="text-red-600 text-sm font-semibold">{errors.userName.message}</span>}
          </div>

          <div className="mb-1 relative mt-4">
            <label className="block text-lg font-bold text-black-900">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum length is 6" } })}
              className="mt-1 p-2 border rounded w-full"
            />
            <div className="absolute right-3 top-11 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && <span className="text-red-600 text-sm font-semibold">{errors.password.message}</span>}
          </div>

          <div className="flex justify-between items-center gap-2 mb-4 mt-3">
            <h1 className="text-lg font-semibold text-pretty text-black">Already have an account?&nbsp;
              <Link to={PATH_PUBLIC.register} className="text-black-500 hover:underline">
              SignUp
              </Link>
            </h1>
          </div>
          
          <div className="flex justify-center items-center gap-6 mt-1">
            <Button variant='light' type='button' label='Reset' onClick={() => reset()} />
            <Button variant='light' type='submit' label='Sign In' loading={loading} />
          </div>

        
        </form>
        </div>
    </div>
  );
};

export default LoginPage;