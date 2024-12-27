"use client";
import React, { useEffect, useState } from "react";


function Poster() {
  const [animationDone, setAnimationDone] = useState(false);

  // Trigger the animation done state after typing animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true); // Mark the animation as done after typing
    }, 3000); // Adjust this time based on your animation duration (3 seconds here)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex justify-center items-center h-[70vh] bg-white shadow-lg"
      style={{
        backgroundImage: "url('/poster.avif')", // Replace with the correct path to your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        
        position: "relative", // For child elements' positioning
      }}
    >
      <h1 className="text-6xl font-bold text-gray-800">
        <span
          className={`inline-block overflow-hidden whitespace-nowrap ${
            animationDone ? "" : "animate-typing"
          }`}
          style={{
            borderRight: "2px solid",
            paddingRight: "5px",
            fontFamily: "'Pacifico', cursive",
        }}
        >
          Test Your Knowledge 
          & 
          Skills To Score ...
        </span>
      </h1>

      <style jsx>{`
        @keyframes typing {
          0% {
            width: 0;
          }
          100% {
            width: 28em; /* Adjust width to match the length of your text */
          }
        }

        .animate-typing {
          animation: typing 3s steps(30) 1s forwards; /* Steps(30) for each character */
        }
      `}</style>
    </div>
  );
}

export default Poster;
