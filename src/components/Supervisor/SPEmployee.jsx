// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import BgImage from '../../assets/BgImage.jpg';

const SPEmployee = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchServiceCrewInSameBranch = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No user is currently logged in.");
          return;
        }

        // Fetch current user's branch and filter employees
        const userDocRef = collection(db, 'employees');
        const userQuery = query(userDocRef, where("uid", "==", currentUser.uid));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          console.error("User data not found.");
          return;
        }

        const currentUserData = userSnapshot.docs[0].data();
        const userBranches = currentUserData.branches;

        const employeesRef = collection(db, 'employees');
        const serviceCrewQuery = query(
          employeesRef,
          where("role", "==", "Service Crew")
        );

        const serviceCrewSnapshot = await getDocs(serviceCrewQuery);
        const serviceCrewData = serviceCrewSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(employee => employee.branches.some(branch => userBranches.includes(branch)));

        setEmployees(serviceCrewData);
      } catch (error) {
        console.error("Error fetching service crew:", error);
      }
    };

    fetchServiceCrewInSameBranch();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="min-h-screen bg-white/70 backdrop-blur-lg p-8 w-full max-w-5xl mx-auto rounded-lg shadow-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-black">
            Employee List
          </h1>
          <div className="overflow-x-auto rounded-lg shadow-lg border border-yellow-400">
            <table className="min-w-full bg-white rounded-lg text-left">
              <thead>
                <tr className="bg-yellow-300">
                  {['ID', 'Full Name', 'Email', 'Birthday', 'Address', 'Phone Number', 'Role', 'Branches'].map((header) => (
                    <th
                      key={header}
                      className="px-3 md:px-4 py-3 text-yellow-800 font-semibold text-xs md:text-sm lg:text-base"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-yellow-50">
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.id}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.fullName}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.email}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {formatDate(employee.birthday)}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.address}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.phoneNumber}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.role}
                      </td>
                      <td className="px-3 md:px-4 py-3 border-b border-yellow-400 text-xs md:text-sm lg:text-base">
                        {employee.branches.join(', ')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-3 text-center border-b border-yellow-400 text-gray-500 text-sm md:text-base"
                    >
                      No service crew found in your branch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default SPEmployee;
