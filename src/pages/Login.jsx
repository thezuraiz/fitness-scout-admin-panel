import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../utils/FirebaseConfig"; // Import the Firebase auth instance
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate =useNavigate();
  const { login } = useContext(AuthContext);
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      localStorage.setItem("adminToken",user.accessToken);
      login();
      toast.success(`Welcome, Admin`);
      navigate('/dashboard')
    } catch (error) {
      toast.error("Invalid Credentials! Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="hidden lg:flex flex-col py-10 w-4/6 space-y-40 bg-gray-700 h-screen">
      <div className="text-center mb-4">
          <img
            src="assets/logo.png"
            alt="HydrateHub Logo"
            className="w-16 h-16 mx-auto"
          /> 
        </div>
        <div className="w-7/12 self-center">
        <h1 className="text-white font-bold text-3xl text-center">Welcome Admin!</h1>
        <h1 className="text-white font-bold text-3xl text-center">Manage Users, Gyms, Diet Plans and much more.</h1>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-screen content-center lg:justify-items-start justify-items-center lg:bg-white bg-gray-700">

      <div className="p-8 w-8/12 lg:w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="text-center mb-4 lg:hidden">
          <img
            src="assets/logo.png"
            alt="HydrateHub Logo"
            className="w-16 h-16 mx-auto"
          /> 
        </div>

        <h2 className="text-2xl  lg:text-black text-white font-bold">Welcome 👋</h2>
        <h2 className="text-lg  lg:text-gray-600 text-gray-400 mb-6">Please login here</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white lg:text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                errors.email ? "border-red-500" : "focus:border-[#94b9ff]"
              }`}
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-white lg:text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              className={`w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none ${
                errors.password ? "border-red-500" : "focus:border-[#94b9ff]"
              }`}
              {...register("password")}
            />
            <div
              className="absolute right-3 top-8 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full hover:cursor-pointer bg-white lg:bg-gray-700 font-semibold mt-10 lg:text-white py-2 rounded-md focus:outline-none hover:transition-all hover:scale-105 transition-transform duration-300 ease-in-out"
            >
            Login
          </button>
        </form>
      </div>
            </div>
    </div>
  );
};

export default Login;
