// src/app/courses/page.jsx
"use client"; // Add this at the top of the file

import React, { useEffect, useState } from "react";
import { CourseCard } from "../Components/CourseCard";

function Page() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/getque");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setCourses(data.data);
        } else {
          throw new Error("No data returned");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", padding: "20px" }}>
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course.id}
            image={course.imageUrl || "/default-image.jpg"}
            title={course.name}
            id={course.id} // Pass the course id as a prop
          />
        ))
      ) : (
        <div>No courses available</div>
      )}
    </div>
  );
}

export default Page;
