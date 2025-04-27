import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi"; // استيراد أيقونات العين

function EditeEmploye({ isOpen, onClose, employe, onEdit }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState(""); // إضافة حالة جديدة لكلمة السر
  const [selectedCountryCode, setSelectedCountryCode] = useState("+966"); // القيمة الافتراضية
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // حالة لإظهار/إخفاء كلمة السر
  const [image, setImage] = useState(null); // حالة جديدة للصورة

  const countryCodes = [
    { code: "+966", label: "SA (+966)", digits: 9 }, // السعودية
    { code: "+20", label: "EG (+20)", digits: 10 }, // مصر
    { code: "+971", label: "UAE (+971)", digits: 9 }, // الإمارات
    { code: "+965", label: "KW (+965)", digits: 8 }, // الكويت
    { code: "+974", label: "QA (+974)", digits: 8 }, // قطر
    { code: "+968", label: "OM (+968)", digits: 8 }, // عمان
    { code: "+963", label: "SY (+963)", digits: 9 }, // سوريا
  ];

  useEffect(() => {
    if (isOpen && employe) {
      setName(employe.name || "");
      setPhoneNumber(employe.phoneNumber?.replace(/^[+]\d+/, "") || ""); // إزالة رمز الدولة من الرقم
      setSelectedCountryCode(employe.phoneNumber?.match(/^[+]\d+/)?.[0] || "+966"); // استخراج رمز الدولة
      setEmail(employe.email || "");
      setRole(employe.role || "");
      setPassword(employe.password || ""); // تعيين قيمة كلمة السر من بيانات الموظف
    }
  }, [isOpen, employe]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev); // تبديل حالة إظهار/إخفاء كلمة السر
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]); // تحديث الصورة المحددة
    }
  };

  const handleUpdateEmployee = () => {
    // التحقق من إدخال جميع الحقول المطلوبة
    if (!name || !phoneNumber || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    // التحقق من أن الاسم يحتوي على أكثر من حرفين
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    // التحقق من أن الرقم يحتوي على أرقام فقط
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Phone number must contain only digits.");
      return;
    }

    // التحقق من عدد الأرقام المطلوبة للدولة المختارة
    const selectedCountry = countryCodes.find((country) => country.code === selectedCountryCode);
    if (phoneNumber.length !== selectedCountry.digits) {
      setError(`Phone number must be ${selectedCountry.digits} digits for ${selectedCountry.label}.`);
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // تحديث بيانات الموظف
    onEdit({
      ...employe,
      name,
      phoneNumber: `${selectedCountryCode}${phoneNumber}`,
      email,
      role,
      password,
      image: image ? image : null, // إضافة الصورة إذا تم اختيارها
    });

    setError(""); // مسح رسالة الخطأ
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-4 transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl"
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] md:w-[650px] lg:w-[750px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "translate-y-0" : "-translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Employee</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-red-500 ml-4 transition duration-300 ease-in-out"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Flexbox for input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter name"
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
                  style={{ width: "80px" }} // تحديد عرض ثابت للقائمة
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // تبديل نوع الحقل بناءً على الحالة
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword} // تبديل حالة إظهار/إخفاء كلمة السر
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
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

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          {/* Update Button */}
          <button
            onClick={handleUpdateEmployee}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditeEmploye;