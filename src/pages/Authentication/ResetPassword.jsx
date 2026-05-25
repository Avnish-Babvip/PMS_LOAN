import React, { useState, useEffect } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetForgotPassword } from "../../features/actions/authentication";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import { slides } from "./Login";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isPasswordChanged } = useSelector(
    (state) => state.authentication,
  );
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(resetForgotPassword({ token, email, ...data }));
  };
  const password = watch("password");

  useEffect(() => {
    if (!token || !email || isPasswordChanged) {
      navigate("/");
    }
  }, [isPasswordChanged]);
  // Auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute w-40 h-40 bg-gradient-to-r from-[#009220] to-[#549A01] rounded-full left-1/2 -translate-x-1/2 -top-20 shadow-[0_0_180px_60px_rgba(200,160,255,0.55)]"></div>

      <div className="absolute w-60 h-60 bg-gradient-to-r from-[#009220] to-[#549A01] shadow-[0_0_180px_60px_rgba(200,160,255,0.55)] rounded-full sm:-bottom-18 -bottom-36 right-64 sm:right-25"></div>
      <div className="hidden sm:block  absolute w-36 h-36 bg-gradient-to-r from-[#009220] to-[#549A01] shadow-[0_0_180px_60px_rgba(200,160,255,0.55)] rounded-full  -left-18"></div>

      <div className="flex w-[90%] md:w-[70%] lg:w-[65%] bg-white rounded-3xl shadow-xl overflow-hidden z-10">
        {/* Left Side - Login */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-1/2 px-10 py-20 flex flex-col justify-center text-center"
        >
          <img src="/logo.png" alt="Logo" className="mx-auto w-40 mb-4" />
          <h2 className="text-3xl font-semibold tracking-tight mb-6 text-gray-800">
            Reset Password
          </h2>

          <div className="relative mb-4">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                  message:
                    "Password must contain at least 1 uppercase letter and 1 special character",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green outline-none"
            />

            <span
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </span>

            {errors.password && (
              <p className="text-left text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <input
              {...register("password_confirmation", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green outline-none"
            />
            <span
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </span>

            {errors.password_confirmation && (
              <p className="text-left text-sm text-red-600 mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <button className="w-full bg-gradient-to-r  from-[#009220] to-[#549A01] text-white py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition">
            {isLoading ? <Spinner /> : "Reset Password"}
          </button>

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <Link to="/login" className="text-black hover:underline">
              Back to Login
            </Link>
          </div>
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

          <div className="transition-all duration-700 absolute bottom-10 z-10">
            <h2 className="text-3xl font-bold mb-2">{slides[current].title}</h2>
            <h4 className="font-semibold">{slides[current].subtitle}</h4>
            <p className="text-gray-200">{slides[current].desc}</p>
            <p className="text-sm mt-6 opacity-70">
              {current + 1} of {slides.length}
            </p>
          </div>

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

export default ResetPassword;
