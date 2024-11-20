// eslint-disable-next-line no-unused-vars
import React from "react";

function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-6">
                The page you are looking for does not exist.
            </p>
        </div>
    );
}

export default PageNotFound;
