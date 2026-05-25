import React, { useState, useRef, useEffect } from "react";

export const OtpGrid = ({
  length = 6,
  onChange,
  autoFocus = true,
  disabled = false,
}) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  // 🔁 Send OTP value to parent
  useEffect(() => {
    onChange?.(otp.join(""));
  }, [otp, onChange]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...otp];

      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      }

      setOtp(next);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();
    if (!/^[0-9]+$/.test(text)) return;

    const digits = text.slice(0, length).split("");
    setOtp(digits.concat(Array(length - digits.length).fill("")));
  };

  return (
    <div className="flex w-full items-center justify-between pb-5">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength="1"
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          className="
            w-14 h-14 text-center text-2xl font-extrabold
            text-slate-900 bg-slate-100
            border border-transparent rounded
            hover:border-slate-200
            focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-lime-100
            outline-none
          "
        />
      ))}
    </div>
  );
};
