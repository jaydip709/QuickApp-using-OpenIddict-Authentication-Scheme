import { useState } from "react";
import { useForm } from "react-hook-form";
import { IRegisterDto } from "../../types/auth.types";
import { PATH_PUBLIC } from "../../routes/paths";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/general/Button";
import axiosInstance from "../../utils/axiosInstance";
import { REGISTER_URL } from "../../utils/globalConfig";
import toast from "react-hot-toast";
import backgroundImage from  "../../assets/img/5.jpg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IRegisterDto>({
    mode: "onChange",
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: IRegisterDto) => {
    try {
      setLoading(true);
      await axiosInstance.post(REGISTER_URL, data);
      toast.success("Registration was successful");
      navigate(PATH_PUBLIC.login);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status, data } = err;
      if (status === 400 || status === 409) {
        toast.error(data);
      } else {
        toast.error("An error occurred. Please contact admins");
      }
    }
  };

  return (
    <div className="justify-content-center bg-cover d-flex " style={{ backgroundImage: `url(${backgroundImage})` , opacity:"0.9"}}>
      <div className="mb-3 ml-9 mr-9 form " >
          <h2 className="text-5xl font-bold text-center mb-2 h2 display-2 text-gray-800" >Sign Up!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 " >

          <div className="row">
            <div className="col">
              <div className="mb-1">
                <label className="block text-lg font-bold text-black-900" >First Name</label>
                <input
                  type="text"
                  {...register("firstName", { required: "First name is required", minLength: { value: 4, message: "Minimum length is 4" } })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              {errors.firstName && <span className="text-red-600 text-sm font-semibold">{errors.firstName.message}</span>}
            </div>
            <div className="col">
              <div className="mb-1">
                <label className="block text-lg font-bold text-black-900">Last Name</label>
                <input
                  type="text"
                  {...register("lastName", { required: "Last name is required", minLength: { value: 4, message: "Minimum length is 4" } })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              {errors.lastName && <span className="text-red-600 text-sm font-semibold">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="mb-1">
            <label className="block text-lg font-bold text-black-900">Username</label>
            <input
              type="text"
              {...register("userName", { required: "Username is required", minLength: { value: 4, message: "Minimum length is 4" } })}
              className="mt-1 p-2 border rounded w-full"
            />
            {errors.userName && <span className="text-red-600 text-sm font-semibold">{errors.userName.message}</span>}
          </div>

          <div className="mb-1">
            <label className="block text-lg font-bold text-black-900">Email</label>
            <input
              type="text"
              {...register("email", { required: "Email is required", pattern: { value: /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/, message: 'Enter a valid email...' } })}
              className="mt-1 p-2 border rounded w-full"
            />
            {errors.email && <span className="text-red-600 text-sm font-semibold" >{errors.email.message}</span>}
          </div>
          <div className="mb-1 relative">
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

          <div className="mb-1 relative">
            <label className="block text-lg font-bold text-black-900">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", { required: "Confirm password is required", minLength: { value: 6, message: "Minimum length is 6" }, validate: (value: string) => {
                if (watch('password') != value) {
                  return "Passwords do not match";
                }
              } })}
              className="mt-1 p-2 border rounded w-full"
            />
            <div className="absolute right-3 top-11 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.confirmPassword && <span className="text-red-600 text-sm font-semibold">{errors.confirmPassword.message}</span>}
          </div>

          <div className="flex justify-between items-center gap-2 mb-4 mt-3">
            <h1 className="text-lg font-semibold text-pretty text-black">Already have an account?&nbsp;
              <Link to={PATH_PUBLIC.login} className="text-black-500 hover:underline">
                SignIn
              </Link>
            </h1>
          </div>
          <div className="flex justify-center items-center gap-6 mt-1">
            <Button variant='light' type='button' label='Reset' onClick={() => reset()} />
            <Button variant='light' type='submit' label='Sign Up' loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
