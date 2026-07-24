import React, { useState, useEffect } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { adminLogin } from "../../features/actions/authentication";
import { Spinner } from "../../components/Loader/Spinner";
import { resetUserState } from "../../features/slices/authentication";

export const slides = [
  {
    title: "Built for Bulk. Driven by Precision.",
    subtitle: "Accuracy. Speed. Consistency.",
    desc: "Your wholesale supply, handled step by step.",
    imageUrl: "/1.jpg",
  },
  {
    title: "Trust Built Through Timely Deliveries.",
    subtitle: "On time. Every time.",
    desc: "Reliability that keeps your shelves stocked.",
    imageUrl: "/2.jpg",
  },
  {
    title: "Carefully Sorted. Consistently Delivered.",
    subtitle: "No delays. No surprises.",
    desc: "Fresh stock arrives when promised.",
    imageUrl: "/3.jpg",
  },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const dispatch = useDispatch();
  const { isLoading, isAdminLoggedIn } = useSelector(
    (state) => state.authentication,
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(adminLogin(data));
    reset();
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/");
    }
  }, [isAdminLoggedIn]);
  // Auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute w-40 h-40 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] rounded-full left-1/2 -translate-x-1/2 -top-20 shadow-[0_0_180px_60px_rgba(200,160,255,0.55)]"></div>

      <div className="absolute w-60 h-60 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] shadow-[0_0_180px_60px_rgba(200,160,255,0.55)] rounded-full sm:-bottom-18 -bottom-36 right-64 sm:right-25"></div>
      <div className="hidden sm:block  absolute w-36 h-36 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] shadow-[0_0_180px_60px_rgba(200,160,255,0.55)] rounded-full  -left-18"></div>

      <div className="flex w-[90%] md:w-[70%] lg:w-[65%] bg-white rounded-3xl shadow-xl overflow-hidden z-10">
        {/* Left Side - Login */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-1/2 px-10 py-20 flex flex-col justify-center text-center"
        >
          <img src="/logo.png" alt="Logo" className="mx-auto w-40 mb-4" />
          <h2 className="text-3xl font-semibold tracking-tight mb-2 text-gray-800">
            Welcome To PMS
          </h2>
          <p className="text-xl font-medium  mb-6 text-gray-800">
            Please sign-in to your account
          </p>
          <div className="mb-4">
            <label className="block text-sm text-start font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <input
              {...register("email", {
                required: "Email address is required",
              })}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green outline-none"
            />

            {errors.email && (
              <div className="text-start pt-2 text-red-600">
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="relative mb-4">
            <label className="block text-sm text-start font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              {...register("password", {
                required: "Password is required",
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green outline-none"
            />

            <span
              className="absolute right-3 top-[42px] text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </span>

            {errors.password && (
              <div className="text-start pt-2 text-red-600">
                {errors.password.message}
              </div>
            )}
          </div>
          {/* <div className="text-right mb-4">
            <Link
              to={"/forgot-password"}
              className="text-[#EF4444] text-sm hover:underline"
            >
              Forgot Password
            </Link>
          </div> */}

          <button
            disabled={isLoading}
            className="w-full bg-gradient-to-r  from-[#EF4444] to-[#B91C1C] text-white h-14 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            {isLoading ? <Spinner /> : "Log in"}
          </button>

          {/* <div className="flex justify-center gap-4 mt-4 text-sm">
            <a href="#" className="text-black hover:underline">
              Customer Support
            </a>
            <a href="#" className="text-black hover:underline">
              Terms of Service
            </a>
          </div> */}
        </form>

        {/* Right Side - Slider */}
        <div className="hidden md:flex w-1/2  text-white flex-col justify-end px-10 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* Image */}
            <img
              src={slides[current].imageUrl}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          </div>

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-b "></div> */}

          {/* Controls */}
          <div className="absolute bottom-10 right-10 flex gap-3 z-10">
            <button
              onClick={prevSlide}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-white hover:text-black transition"
            >
              <IoArrowBackOutline />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-white hover:text-black transition"
            >
              <IoArrowForwardOutline />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
