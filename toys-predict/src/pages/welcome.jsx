import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Welcome() {
  const [formData, setFormData] = useState({
    Category: "",
    Brand: "",
    AgeGroup: "",
    Size: "",
    Weight: "",
    Material: "",
    Condition: "",
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send a POST request to the Flask backend
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error("Error predicting toy price:", error);
      setError("Error predicting toy price. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const chartData = {
    labels: ["Predicted Price"],
    datasets: [
      {
        label: "Price (Frw)",
        data: [predictedPrice || 0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-screen bg-cover bg-center relative flex items-center justify-center p-3" style={{ backgroundImage: "url('/house.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative grid grid-cols-2 items-center justify-around space-x-12 px-6">
        <div className="text-white w-2/3 m-6">
          <p className="text-6xl font-bold">
            <span className="text-[#E08543]">Discover</span> Your Toy’s True{" "}
            <span className="text-[#E08543]">Value</span> !
          </p>
          <p className="text-2xl text-gray-300 mt-2">
            Whether you're buying, selling, or simply curious, predict your toy's
            worth in just a few clicks!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative p-6 rounded-lg backdrop-blur-md bg-white bg-opacity-5 shadow-lg w-full max-w-2xl text-white"
        >
          {error && <div className="text-red-500 text-xl mb-4 text-center">🌋 {error} 🌋</div>}

          <div className="m-3 p-2 flex flex-col gap-y-4">
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                type={["Size", "Weight"].includes(key) ? "number" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, " $1").trim().toUpperCase()}
                className="p-2 border border-white border-opacity-30 bg-transparent rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            ))}
          </div>

          <button
            type="submit"
            className="mt-2 bg-[#E08543] font-semibold text-lg text-white p-2 rounded-lg hover:bg-opacity-80 w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Predict"}
          </button>
        </form>

        {/* Display Predicted Price and Chart */}
        {predictedPrice && (
          <div className="mt-4 text-center text-2xl text-white backdrop-blur-md bg-white bg-opacity-5 shadow-lg p-3 rounded-md w-2/3">
            <p>🎉 Your predicted toy price is: 🎉</p>
            <p className="font-bold text-green-500">{predictedPrice} Frw</p>
            <div className="w-full h-64 mt-4">
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;


