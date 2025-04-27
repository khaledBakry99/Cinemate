import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function CreatEmploye({ isOpen, onClose, employes = [], setEmployes }) {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+963"); // القيمة الافتراضية

  const countryCodes = [
    { code: "+966", label: "SA (+966)", digits: 9 }, // السعودية
    { code: "+20", label: "EG (+20)", digits: 10 }, // مصر
    { code: "+971", label: "UAE (+971)", digits: 9 }, // الإمارات
    { code: "+965", label: "KW (+965)", digits: 8 }, // الكويت
    { code: "+974", label: "QA (+974)", digits: 8 }, // قطر
    { code: "+968", label: "OM (+968)", digits: 8 }, // عمان
    { code: "+963", label: "SY (+963)", digits: 9 }, // سوريا
  ];

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddEmployee = async () => {
    // التحقق من إدخال جميع الحقول المطلوبة
    if (!userName || !phoneNumber || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    // التحقق من أن الاسم يحتوي على أكثر من حرفين
    if (userName.trim().length < 2) {
      setError("User name must be at least 2 characters long.");
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // التحقق من عدد الأرقام المطلوبة للدولة المختارة
    const selectedCountry = countryCodes.find((country) => country.code === selectedCountryCode);
    if (phoneNumber.length !== selectedCountry.digits) {
      setError(`Phone number must be ${selectedCountry.digits} digits for ${selectedCountry.label}.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("UserName", userName);
      formData.append("Email", email);
      formData.append("Password", password);
      formData.append("PhoneNumber", `${selectedCountryCode}${phoneNumber}`);
      if (image) {
        formData.append("Image", image);
      }

      const response = await axios.post(
        "http://cinemate-001-site1.jtempurl.com/api/Auth/add-scanner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const newEmployeeId = response.data.data;

        if (!newEmployeeId || typeof newEmployeeId !== "number") {
          setError("Invalid data received from the server.");
          toast.error("Invalid data received from the server.");
          return;
        }

        const newEmployee = {
          id: newEmployeeId,
          userName: userName.trim(),
          phoneNumber: `${selectedCountryCode}${phoneNumber}`,
          email: email.trim(),
          role: role.trim(),
        };

        setEmployes((prevEmployees) => [...prevEmployees, newEmployee]);

        setUserName("");
        setPhoneNumber("");
        setEmail("");
        setRole("");
        setPassword("");
        setImage(null);

        toast.success(`Employee "${newEmployee.userName}" added successfully`);
        onClose();
      } else {
        setError(response.data.message || "Failed to add employee.");
        toast.error(response.data.message || "Failed to add employee.");
      }
    } catch (err) {
      console.error("Error adding employee:", err);

      const errorMessage =
        err.response?.data?.message || "An error occurred while adding the employee.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-4 transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] md:w-[650px] lg:w-[750px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${isOpen ? "translate-y-0" : "-translate-y-10"
          }`}
      >
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Create Employee</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out ml-4"
          >
            X
          </button>
        </div>

        <div className="space-y-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* UserName Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                User Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Combined Phone Number Input with Country Code */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-main">
                {/* Country Code Dropdown */}
                <select
                  value={selectedCountryCode}
                  onChange={(e) => {
                    setSelectedCountryCode(e.target.value);
                    setPhoneNumber(""); // إفراغ الحقل عند تغيير رمز الدولة
                  }}
                  className="p-3 bg-gray-800 text-sm border-r border-gray-700 rounded-l-xl appearance-none focus:outline-none"
                  style={{ width: "100px" }} // تحديد عرض ثابت للقائمة
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label} {/* يظهر الاسم الكامل عند فتح القائمة */}
                    </option>
                  ))}
                </select>

                {/* Phone Number Input */}
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded-r-xl focus:outline-none text-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter email"
                required
              />
            </div>

            {/* Role Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter role"
              />
            </div>

            {/* Password Input */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Profile Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-beige3 file:text-white hover:file:bg-main"
                accept="image/*"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            onClick={handleAddEmployee}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Adding...</span>
            ) : (
              <>
                Add Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatEmploye;