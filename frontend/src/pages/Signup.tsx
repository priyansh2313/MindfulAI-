import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../hooks/axios/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    age: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    setLoading(true);

    // Convert age to number before sending
    const dataToSend = { ...formData, age: Number(formData.age) };

    try {
      const response = await axios.post("/users/register", dataToSend, { withCredentials: true });
      const user = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      if (user.age > 60) {
        navigate("/elder-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Signup failed! " + (err.response?.data?.error || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex max-w-6xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Form Section */}
        <div className="flex-1 p-8 lg:p-12 flex items-center justify-center">
          <div className="max-w-sm w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Account</h1>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Sign up with Google</span>
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Sign up with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth*
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age*
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 items-center justify-center p-12 relative overflow-hidden">
          {/* Large Reflective Sphere */}
          <div className="relative z-20">
            <div className="w-48 h-48 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 rounded-full relative shadow-2xl">
              {/* Reflection highlight */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white opacity-40 rounded-full blur-lg"></div>
              <div className="absolute top-6 left-6 w-8 h-8 bg-white opacity-60 rounded-full blur-sm"></div>
              
              {/* Small inner sphere */}
              <div className="absolute bottom-4 right-6 w-6 h-6 bg-gray-800 rounded-full shadow-lg">
                <div className="absolute top-1 left-1 w-2 h-2 bg-white opacity-50 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Green Leaf Branch */}
          <div className="absolute left-8 top-1/3 z-10">
            <div className="relative">
              {/* Main stem */}
              <div className="w-1 h-32 bg-green-600 rounded-full transform rotate-12"></div>
              
              {/* Leaves */}
              <div className="absolute -top-2 -left-4 w-16 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full transform -rotate-12 shadow-lg"></div>
              <div className="absolute top-4 -left-3 w-14 h-7 bg-gradient-to-r from-green-500 to-green-700 rounded-full transform -rotate-6 shadow-lg"></div>
              <div className="absolute top-10 -left-2 w-12 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full transform rotate-3 shadow-lg"></div>
              <div className="absolute top-16 -left-3 w-10 h-5 bg-gradient-to-r from-green-500 to-green-700 rounded-full transform -rotate-12 shadow-lg"></div>
              <div className="absolute top-22 -left-1 w-8 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transform rotate-6 shadow-lg"></div>
            </div>
          </div>

          {/* Wooden Pencil */}
          <div className="absolute bottom-16 left-20 z-10 transform rotate-45">
            <div className="w-3 h-24 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-lg">
              {/* Pencil tip */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              {/* Metal band */}
              <div className="absolute top-16 w-full h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
            </div>
          </div>

          {/* Cyan Geometric Shape */}
          <div className="absolute top-20 right-16 z-10">
            <div className="w-16 h-32 bg-gradient-to-b from-cyan-300 to-cyan-500 transform rotate-12 shadow-xl" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'}}>
              <div className="absolute top-4 left-2 w-4 h-8 bg-white opacity-20 blur-sm"></div>
            </div>
          </div>

          {/* Dark Purple Cylinder */}
          <div className="absolute bottom-12 right-8 z-10">
            <div className="w-12 h-20 bg-gradient-to-b from-purple-800 to-purple-900 rounded-full shadow-xl transform -rotate-6">
              <div className="absolute top-2 left-2 w-3 h-6 bg-white opacity-15 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Small Orange Sphere */}
          <div className="absolute top-32 left-32 z-15">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white opacity-40 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Background decorative dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white opacity-30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white opacity-40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/6 w-1 h-1 bg-white opacity-25 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;