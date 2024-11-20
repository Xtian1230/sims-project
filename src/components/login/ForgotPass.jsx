// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import BgImage from '../../assets/BgImage.jpg';

const BgStyle = {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
};

const ForgotPass = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the password reset logic here (e.g., API call)
        console.log('Password reset link sent to:', email);
    };

    return (
        <div style={BgStyle} className='min-h-screen overflow-hidden'>
            <div className='min-h-screen bg-white/50 backdrop-blur-2xl flex items-center justify-center'>
                <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-yellow-600 text-center mb-6">Forgot Password</h1>
                    <p className="text-gray-600 text-center mb-4">Enter your email address to receive a password reset link.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-150 ease-in-out"
                        >
                            Send Reset Link
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Remembered your password? <a href="/login" className="text-yellow-600 font-semibold">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
