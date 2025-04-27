import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";

function EditCinemaHall() {
  const { state } = useLocation();
  const hallDataFromState = state || {};
  const { hallNumber, hallType, rows, columns, aisles } = hallDataFromState;
  const navigate = useNavigate();

  // const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeats] = useState([]);

  const [reservedSeats] = useState(["A1", "B3", "C5"]);
  const [hallData, setHallData] = useState({
    hallNumber: hallNumber || "",
    hallType: hallType || "Standard",
    rows: rows || 10,
    columns: columns || 15,
    aisles: Array.isArray(aisles) ? aisles : [],
  });

  const totalSeats =
    hallData.rows && hallData.columns
      ? hallData.rows * hallData.columns -
        (Array.isArray(hallData.aisles) ? hallData.aisles.length : 0)
      : 0;

  useEffect(() => {
    setHallData({
      hallNumber: hallNumber || "",
      hallType: hallType || "Standard",
      rows: rows || 10,
      columns: columns || 15,
      aisles: Array.isArray(aisles) ? aisles : [],
    });
  }, [hallNumber, hallType, rows, columns, aisles]);

  const generateRowLabels = (count) => {
    const labels = [];
    for (let i = 0; i < count; i++) {
      let label = "";
      let num = i;
      while (num >= 0) {
        label = String.fromCharCode(65 + (num % 26)) + label;
        num = Math.floor(num / 26) - 1;
      }
      labels.push(label);
    }
    return labels;
  };

  const addAisle = (seat) => {
    if (hallData.aisles.includes(seat)) {
      setHallData((prevData) => ({
        ...prevData,
        aisles: prevData.aisles.filter((s) => s !== seat),
      }));
    } else {
      setHallData((prevData) => ({
        ...prevData,
        aisles: [...prevData.aisles, seat],
      }));
    }
  };

  const renderSeats = () => {
    const rowLabels = generateRowLabels(hallData.rows);

    return rowLabels.map((label, i) => {
      const row = [];
      for (let j = 1; j <= hallData.columns; j++) {
        const seat = `${label}${j}`;
        const isAisle = hallData.aisles.includes(seat);
        const isReserved = reservedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);

        // إذا كان الكرسي مدرجًا كممر
        if (isAisle) {
          row.push(
            <div
              key={seat}
              onClick={() => addAisle(seat)}
              className="inline-flex items-center justify-center"
              style={{
                width: "50px",
                height: "50px",
                margin: "0 4px",
                border: "1px dashed gray",
              }}
            ></div>
          );
          continue;
        }

        // إذا لم يكن الكرسي مدرجًا كممر
        row.push(
          <div
            key={seat}
            onClick={() => addAisle(seat)}
            className={`inline-flex items-center justify-center cursor-pointer transition-all relative ${
              isReserved
                ? "bg-dry cursor-not-allowed"
                : isSelected
                ? "bg-green-500"
                : ""
            }`}
            style={{
              width: "50px",
              height: "50px",
              backgroundImage: `url(/images/cinema.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "4px",
              margin: "0 4px",
            }}
            title={seat}
          >
            {/* الرقم الخاص بالكرسي مع الشفافية */}
            <span
              className="absolute text-gray-400 font-bold text-xs opacity-30"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {seat}
            </span>
          </div>
        );
      }

      return (
        <div key={label} className="flex items-center gap-4">
          {/* Row Label */}
          <div className="w-[50px] flex items-center justify-center font-bold text-gray-700">
            {label}
          </div>
          {/* Seats */}
          <div
            className="flex gap-2"
            style={{ minWidth: `${hallData.columns * 58}px` }}
          >
            {row}
          </div>
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `Hall Number: ${hallData.hallNumber}, Type: ${hallData.hallType}, Total Seats: ${totalSeats}`
    );
    console.log(`Aisles: ${hallData.aisles}`);
  };

  const handleClose = () => {
    navigate("/halls");
  };

  return (
    <SideBar>
      <div className="p-6 bg-lightGray rounded-lg shadow-md">
        <div className="absolute top-2 right-2">
          <button
            onClick={handleClose}
            className="text-xl font-bold text-gray-500 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">Edit Cinema Hall</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label
                htmlFor="hallNumber"
                className="text-sm font-medium text-border"
              >
                Hall Number
              </label>
              <input
                id="hallNumber"
                type="text"
                value={hallData.hallNumber}
                onChange={(e) =>
                  setHallData({ ...hallData, hallNumber: e.target.value })
                }
                placeholder="Enter hall number"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label
                htmlFor="hallType"
                className="text-sm font-medium text-border"
              >
                Hall Type
              </label>
              <select
                id="hallType"
                value={hallData.hallType}
                onChange={(e) =>
                  setHallData({ ...hallData, hallType: e.target.value })
                }
                className="text-sm p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              >
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
                <option value="4K">4K</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="rows" className="text-sm font-medium text-border">
                Rows
              </label>
              <input
                id="rows"
                type="text"
                value={hallData.rows}
                onChange={(e) =>
                  setHallData({ ...hallData, rows: Number(e.target.value) })
                }
                placeholder="Number of rows"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label
                htmlFor="columns"
                className="text-sm font-medium text-border"
              >
                Columns
              </label>
              <input
                id="columns"
                type="text"
                value={hallData.columns}
                onChange={(e) =>
                  setHallData({ ...hallData, columns: Number(e.target.value) })
                }
                placeholder="Number of columns"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-500 font-medium text-sm">
            <span>Total Seats:</span>
            <span className="text-lg font-bold">{totalSeats}</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-beige3 text-white text-sm font-medium rounded-2xl hover:bg-dry border border-beige3 transition duration-300"
          >
            Edit Hall
          </button>
        </form>

        {/* Legend Section */}
        <div className="mt-6 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 bg-cover bg-center"
              style={{
                backgroundImage: `url(/images/cinema.png)`,
              }}
            ></div>
            <span className="text-base text-gray-700">Seat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-transparent border border-gray-700 rounded-full"></div>
            <span className="text-base text-gray-700">Aisle (Hidden)</span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="mt-10">
          <h2 className="text-base font-semibold text-beige3 mb-4 p-3">
            Seat Layout
          </h2>
          <div
            className="flex flex-col gap-4"
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            {renderSeats()}
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default EditCinemaHall;
