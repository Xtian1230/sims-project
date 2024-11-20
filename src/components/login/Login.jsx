// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../Firebase/firebaseConfig.js';
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import loginImg from '../../assets/Login.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        // Attempt to sign in the user
        await signInWithEmailAndPassword(auth, email, password);

        // Check the user's role in the database
        const employeeRef = collection(db, "employees");
        const q = query(employeeRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();

          // Redirect based on role
          switch (employeeData.role) {
            case 'Service Crew':
              navigate('/edashboard');
              break;
            case 'Supervisor':
              navigate('/spdashboard');
              break;
            case 'Admin':
              navigate('/dashboard');
              break;
            default:
              alert("User role is not recognized.");
          }
        } else {
          alert("No account found with this email.");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("Incorrect Username or Password. Please try again.");
      }
    } else {
      alert('Please fill in all fields before logging in.');
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-900/90">
      <img className="absolute w-full h-full object-cover mix-blend-overlay pointer-events-none" src={loginImg} alt="Background" />

      <div className="h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-xl p-10">
          {/* Title Section */}
          <h1 className="text-3xl font-semibold text-center mb-0">
            <span className='text-white text-3xl'>
              <span className='text-red-500'>A</span>
              <span className='text-green-500'>n</span>
              <span className='text-red-800'>g</span>
              <span className='text-blue-500'>e</span>
              <span className='text-orange-500'>l</span>
              <span className='text-purple-500'>&apos;s</span>
              <span className='text-red-500'> Burger</span>
            </span>
          </h1>
          <h2 className="text-gray-700 text-center font-light mb-8">Ang Burger ng Bayan</h2>

          {/* Form Section */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 rounded-lg"
            >
              Login
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              <a
                onClick={() => navigate('/forgotpass')}
                className="text-blue-600 hover:text-blue-700 underline cursor-pointer transition duration-150"
              >
                Forgot Password?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
