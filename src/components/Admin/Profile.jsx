// Profile.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import BgImage from '../../assets/BgImage.jpg';
import { auth, db } from '../../Firebase/firebaseConfig.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Profile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    gender: '',
    birthday: '',
    address: '',
    phoneNumber: '',
    role: '',
    branch: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const employeesRef = collection(db, "employees");
          const q = query(employeesRef, where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              setUserInfo({
                fullName: data.fullName || '',
                email: data.email || user.email,
                gender: data.gender || user.gender,
                birthday: data.birthday || '',
                address: data.address || '',
                phoneNumber: data.phoneNumber || '',
                role: data.role || '',
                branches: data.branches || [],
              });
            });
          } else {
            console.log(`No document found for UID: ${user.uid}`);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordData((prevData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      alert("Password changed successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please check your current password.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleImageUpload = () => {
    console.log("Image uploaded successfully!", profileImage);
    setPreviewImage(null);
    setProfileImage(null);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 flex items-center justify-center"
      style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="min-h-screen bg-white/70 backdrop-blur-lg p-8 w-full max-w-5xl mx-auto rounded-lg shadow-2xl">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 space-y-6">
          <h1 className="text-3xl font-bold text-yellow-600 text-center mb-4">Profile</h1>

          <div className="flex flex-col items-center mb-6">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-yellow-600 shadow-md mb-3"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm shadow-inner mb-3">
                No Image
              </div>
            )}
            <label
              htmlFor="profileImageInput"
              className="cursor-pointer bg-yellow-600 text-white px-5 py-2 rounded-md hover:bg-yellow-700 transition"
            >
              Choose Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profileImageInput"
            />
            {profileImage && (
              <button
                onClick={handleImageUpload}
                className="mt-3 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
              >
                Upload Image
              </button>
            )}
          </div>

          <div className="space-y-4">
            {[
              { label: "Full Name", value: userInfo.fullName },
              { label: "Email", value: userInfo.email },
              { label: "Gender", value: userInfo.gender },
              { label: "Birthday", value: userInfo.birthday },
              { label: "Address", value: userInfo.address },
              { label: "Phone Number", value: userInfo.phoneNumber },
              { label: "Role", value: userInfo.role },
              { label: "Branches", value: userInfo.branches?.join(", ") || "N/A" },
            ].map((info, index) => (
              <div className="flex flex-col" key={index}>
                <label className="text-gray-700 font-medium">{info.label}:</label>
                <p className="text-gray-900">{info.value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={toggleChangePassword}
            className="mt-6 w-full py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition"
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              {[
                { label: "Current Password", name: "currentPassword", showPassword: passwordData.showCurrentPassword },
                { label: "New Password", name: "newPassword", showPassword: passwordData.showNewPassword },
                { label: "Confirm New Password", name: "confirmPassword", showPassword: passwordData.showConfirmPassword },
              ].map((field, index) => (
                <div className="flex flex-col relative" key={index}>
                  <label className="text-gray-700 font-medium">{field.label}:</label>
                  <input
                    type={field.showPassword ? "text" : "password"}
                    name={field.name}
                    value={passwordData[field.name]}
                    onChange={handleInputChange}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:border-yellow-600 transition pr-10"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition mt-3"
                    onClick={() => togglePasswordVisibility(`show${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`)}
                  >
                    {field.showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              >
                Save Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
