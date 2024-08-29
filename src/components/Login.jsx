import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {children}
    </label>
  );

  const Input = ({ id, type, placeholder, required = false }) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );

  const Button = ({ type, className, children }) => (
    <button type={type} className={className}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen  from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-cover bg-center p-12 text-white flex flex-col justify-between relative overflow-hidden" style={{ backgroundImage: "url('./logo.jpg')" }}>


            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-900 to-transparent opacity-50"></div>
            <motion.div 
              className="absolute -bottom-16 -left-16 w-64 h-64 border-4 border-bg-black rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </div>
          <div className="md:w-1/2 p-12">
            <h3 className="text-3xl font-semibold text-gray-800 mb-8">Login to Your Account</h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Forgot password?</a>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-green-600 text-white py-2 rounded-md hover:from-green-700 hover:to-black transition-all duration-300 flex items-center justify-center group">
                <span>Sign In</span>
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}