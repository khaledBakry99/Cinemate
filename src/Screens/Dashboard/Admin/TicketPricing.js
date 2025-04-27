import React, { useState } from "react";
import SideBar from "../SideBar";
import { Input } from "../../../Components/UsedInputs";
import { MdSave, MdCancel } from "react-icons/md";

function TicketPricing() {
  const [formData, setFormData] = useState({
    regular2D: "",
    regular3D: "",
    vip2D: "",
    vip3D: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ticket Pricing Data:", formData);
    alert("Prices Saved Successfully!");
  };

  const handleCancel = () => {
    setFormData({
      regular2D: "",
      regular3D: "",
      vip2D: "",
      vip3D: "",
    });
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Ticket Pricing</h2>

        {/* حقول الأسعار */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          {/* Regular 2D */}
          <Input
            label="Standard Quality 2D
 Price"
            placeholder="Enter price for Standard 2D"
            type="number"
            bg={true}
            name="regular2D"
            value={formData.regular2D}
            onChange={handleChange}
          />

          {/* Regular 3D */}
          <Input
            label="Standard Quality
 3D Price"
            placeholder="Enter price for Standard 3D"
            type="number"
            bg={true}
            name="regular3D"
            value={formData.regular3D}
            onChange={handleChange}
          />
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          {/* VIP 2D */}
          <Input
            label="VIP Quality 2D Price"
            placeholder="Enter price for VIP 2D"
            type="number"
            bg={true}
            name="vip2D"
            value={formData.vip2D}
            onChange={handleChange}
          />

          {/* VIP 3D */}
          <Input
            label="VIP Quality 3D Price"
            placeholder="Enter price for VIP 3D"
            type="number"
            bg={true}
            name="vip3D"
            value={formData.vip3D}
            onChange={handleChange}
          />
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex gap-2 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4">
          {/* زر الإلغاء */}
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 font-medium transitions hover:bg-red-900 border border-red-400 flex-rows gap-4 text-white py-3 px-24 rounded-2xl w-full sm:w-auto"
          >
            <MdCancel size={20} /> Cancel
          </button>

          {/* زر الحفظ */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-main font-medium transitions hover:bg-beige3 border border-beige3 flex-rows gap-4 text-white py-3 px-20 rounded-2xl w-full sm:w-auto"
          >
            <MdSave size={20} /> Save
          </button>
        </div>
      </div>
    </SideBar>
  );
}

export default TicketPricing;
