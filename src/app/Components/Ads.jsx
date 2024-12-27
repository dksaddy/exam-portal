import React from "react";

function Card({ imgSrc, p1, p2 }) {
  return (
    <div
      className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      style={{
        border: "1px solid #e5e7eb",
        marginBottom: "3rem",
      }}
    >
      {/* Image */}
      <img
        src={imgSrc} // Accepts image source as a prop
        alt="Card Image"
        className="w-25 h-25 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">{p1}</h2>
        
        {/* Second Paragraph */}
        <p className="mt-2 text-gray-600">{p2}</p>
      </div>
    </div>
  );
}

export default Card;
