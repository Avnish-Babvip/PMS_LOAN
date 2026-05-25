import React, { useState, useEffect } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { OtpGrid } from "../../components/OtpGrid";
import { adminLogin, verifyAdmin } from "../../features/actions/authentication";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../components/Loader/Spinner";
import { slides } from "./Login";

const LoginOTP = () => {
  const [current, setCurrent] = useState(0);
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isAdminLoggedIn,
    adminData,
    loginCredentials,
    isLoading,
    isCredentials,
  } = useSelector((state) => state.authentication);
  const [otp, setOtp] = useState("");
  const handleConfirm = () => {
    if (otp.length !== 6) return;
    dispatch(
      verifyAdmin({
        admin_id: adminData?.data?.admin_id,
        otp,
      }),
    );
  };

  const handleResendOtp = () => {
    dispatch(
      adminLogin({
        login: loginCredentials.email,
        password: loginCredentials.password,
      }),
    );
  };

  useEffect(() => {
    if (isAdminLoggedIn || !isCredentials) {
      navigate("/");
    }
  }, [isAdminLoggedIn, isCredentials]);

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
        <div className="w-full md:w-1/2 px-10 py-20 flex flex-col justify-center text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto w-40 mb-4" />
          <h2 className="text-3xl font-semibold tracking-tight mb-6 text-gray-800">
            Enter the Login OTP
          </h2>

          <div className="text-right mb-4">
            {/* OTP GRID */}
            <OtpGrid onChange={setOtp} />
            <button
              onClick={handleResendOtp}
              className="text-[#009220] text-sm hover:underline"
            >
              Resend
            </button>
          </div>
          <button
            onClick={handleConfirm}
            disabled={otp.length !== 6}
            className="
              w-full mt-4 py-4 rounded-lg font-semibold text-white
              bg-gradient-to-r from-[#009220] to-[#549A01]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? <Spinner /> : "Confirm"}
          </button>

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <a href="#" className="text-black hover:underline">
              Customer Support
            </a>
            <a href="#" className="text-black hover:underline">
              Terms of Service
            </a>
          </div>
        </div>

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

export default LoginOTP;
