// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/firebaseConfig.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig.js";
import BgImage from '../../assets/BgImage.jpg';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    password: "",
    birthday: "",
    address: "",
    phoneNumber: "",
    role: "",
    gender: "",
    branches: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [message, setMessage] = useState(""); // State for success/error messages

  const branchOptions = [
    "San Pablo", "Nagcarlan", "Rizal", "Alaminos", "Bay", "Calauan", "Los Baños", "Pagsanjan", "Santa Cruz",
    "Laguna" // For Admin role only
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeCollection = collection(db, "employees");
      const employeeSnapshot = await getDocs(employeeCollection);
      const employeeList = employeeSnapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
      setEmployees(employeeList);
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("branch")) {
      const branchIndex = parseInt(name.replace("branch", ""), 10) - 1;
      const newBranches = [...formData.branches];
      newBranches[branchIndex] = value;
      setFormData({ ...formData, branches: newBranches });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message

    if (!validatePassword(formData.password)) {
      alert("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    try {
      if (isEditing) {
        const updateData = { ...formData };
        if (!formData.password) delete updateData.password;

        await updateDoc(doc(db, "employees", selectedEmployeeId), updateData);
        const employee = employees.find(emp => emp.docId === selectedEmployeeId);

        if (formData.email !== employee.email) {
          await updateEmail(auth.currentUser, formData.email);
        }
        if (formData.password) {
          await updatePassword(auth.currentUser, formData.password);
        }

        setEmployees(
          employees.map((emp) => (emp.docId === selectedEmployeeId ? { ...formData, docId: selectedEmployeeId } : emp))
        );
        setMessage("Employee updated successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const newEmployeeData = { ...formData, uid: userCredential.user.uid };
        delete newEmployeeData.password;
        const newEmployeeDoc = await addDoc(collection(db, "employees"), newEmployeeData);

        setEmployees([...employees, { ...newEmployeeData, docId: newEmployeeDoc.id }]);
        setMessage("Employee added successfully!");
      }

      setFormData({
        id: "",
        fullName: "",
        email: "",
        password: "",
        birthday: "",
        address: "",
        phoneNumber: "",
        role: "",
        gender: "",
        branches: [],
      });
      setIsEditing(false);
      setSelectedEmployeeId(null);
    } catch (error) {
      console.error("Error adding/updating employee: ", error);
      setMessage("Error: Could not add/update employee.");
    }
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setIsEditing(true);
    setSelectedEmployeeId(employee.docId);
  };

  const handleDelete = async (docId) => {
    const confirmation = window.confirm("Are you sure you want to delete this account?");
    if (confirmation) {
      await deleteDoc(doc(db, "employees", docId));
      setEmployees(employees.filter((employee) => employee.docId !== docId));
      ("Employee deleted successfully.");
    }
  };

  const formatBirthday = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredEmployees = selectedRole
    ? employees.filter((employee) => employee.role === selectedRole)
    : employees;


  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-5xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-black">Employee Form</h1>

        {/* Display message */}
        {message && (
          <p className="text-center text-lg font-medium text-green-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 border border-yellow-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">ID</label>
              <input type="text" name="id" value={formData.id} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Birthday</label>
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Address</label>
              <input name="address" value={formData.address} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Role</label>
              <select name="role" value={formData.role} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="Service Crew">Service Crew</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Admin">Area Manager</option>
              </select>
            </div>
            {/* Branch Selection */}
            {formData.role === "Admin" ? (
              <div>
                <label className="block text-gray-700 font-medium">Branch</label>
                <select name="branch1" value="Laguna" readOnly
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                  <option value="Laguna">Laguna</option>
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-gray-700 font-medium">Branch 1</label>
                  <select name="branch1" value={formData.branches[0] || ""} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                    <option value="" disabled>Select Branch</option>
                    {branchOptions.filter(branch => branch !== "Laguna").map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Branch 2</label>
                  <select name="branch2" value={formData.branches[1] || ""} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                    <option value="" disabled>Select Branch</option>
                    {branchOptions.filter(branch => branch !== "Laguna").map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Branch 3</label>
                  <select name="branch3" value={formData.branches[2] || ""} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                    <option value="" disabled>Select Branch</option>
                    {branchOptions.filter(branch => branch !== "Laguna").map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-2 rounded-lg font-bold hover:bg-yellow-700 transition duration-200"
          >
            {isEditing ? "Save Changes" : "Add Employee"}
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-black text-center">Employee List</h2>

        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-2">Filter by Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
          >
            <option value="">All</option>
            <option value="Service Crew">Service Crew</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Admin">Area Manager</option>
          </select>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-yellow-500 rounded-lg overflow-hidden">
            <thead>
              <tr className=" bg-yellow-300">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Full Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Gender</th>
                <th className="px-4 py-2 border-b">Birthday</th>
                <th className="px-4 py-2 border-b">Address</th>
                <th className="px-4 py-2 border-b">Phone Number</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Branches</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.docId}>
                  <td className="px-4 py-2 border-b">{employee.id}</td>
                  <td className="px-4 py-2 border-b">{employee.fullName}</td>
                  <td className="px-4 py-2 border-b">{employee.email}</td>
                  <td className="px-4 py-2 border-b">{employee.gender}</td>
                  <td className="px-4 py-2 border-b">{formatBirthday(employee.birthday)}</td>
                  <td className="px-4 py-2 border-b">{employee.address}</td>
                  <td className="px-4 py-2 border-b">{employee.phoneNumber}</td>
                  <td className="px-4 py-2 border-b">{employee.role}</td>
                  <td className="px-4 py-2 border-b">{employee.branches?.join(", ")}</td>
                  <td className="px-4 py-2 border-b">

                    <button onClick={() => handleEdit(employee)} className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(employee.docId)} className="text-red-500 hover:underline ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;