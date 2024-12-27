"use client"; // Add this at the top of the file

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Radio, FormControlLabel, RadioGroup, Button, Box } from "@mui/material";

const ExamPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the id from query string

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers
  const [score, setScore] = useState(null); // Track the score
  const [submitted, setSubmitted] = useState(false); // Track if the exam is submitted
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!id) return;

    async function fetchCourseData() {
      try {
        const response = await fetch(`/api/exam?id=${id}`); // Fetch the course data based on the id
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setCourse(data.data); // Set course data to state
        } else {
          throw new Error("Course data not found");
        }
      } catch (error) {
        setError(error.message); // Handle any errors during the fetch
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    fetchCourseData(); // Fetch the course data when id is available
  }, [id]);

  useEffect(() => {
    if (submitted) return; // Stop the timer once the exam is submitted

    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup the timer on unmount or when timeLeft changes
    } else {
      // Stop the timer when it reaches 0 and submit the exam automatically
      calculateScore();
    }
  }, [timeLeft, submitted]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    if (submitted) return; // Prevent any changes after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex.toString(), // Store value as a string for consistency
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;

    const results = course.questions.map((question, index) => {
      const correctAnswer = question.correctAns; // Correct answer for the current question
      const selectedAnswer = question.options[parseInt(selectedAnswers[index], 10)]; // Get the selected option text
      const isCorrect = selectedAnswer === correctAnswer; // Check if the selected answer is correct

      if (isCorrect) {
        totalScore += 1; // Increment the score if the answer is correct
      }

      return {
        questionText: question.text,
        selectedAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    setScore(totalScore); // Update the score state
    setSubmitted(true); // Set exam as submitted
    console.log(results); // Log the detailed results
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!course) {
    return <div>No course found</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h1 className="text-3xl font-bold text-gray-800">{course.name} </h1>
      <h1 className="text-1xl">Time Remaining: {formatTime(timeLeft)}</h1>
      <ul>
        {course.questions.map((question, index) => (
          <li key={index} style={{ marginBottom: "20px" }}>
            <Card sx={{ width: 600 }}>
              <CardContent>
                <Typography variant="h6" className="font-bold">{question.text}</Typography>
                <RadioGroup
                  value={selectedAnswers[index] || ""}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  disabled={submitted} // Disable the radio buttons after submission
                >
                  {question.options.map((option, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      value={optIndex.toString()} // Ensure value is a string
                      control={<Radio />}
                      label={option}
                      disabled={submitted} // Disable the individual radio button after submission
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <Button
        variant="contained"
        onClick={calculateScore}
        style={{ marginTop: "20px" }}
        disabled={submitted} // Disable the button after submission
      >
        Submit
      </Button>

      {submitted && (
        <Box sx={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <Typography variant="h5">Detailed Results</Typography>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Your Score: {score}/{course.questions.length}
          </Typography>
          {course.questions.map((question, index) => {
            const selectedAnswer = question.options[parseInt(selectedAnswers[index], 10)];
            const isCorrect = selectedAnswer === question.correctAns;
            return (
              <Box key={index} sx={{ marginBottom: "15px" }}>
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  Question: {question.text}
                </Typography>
                <Typography variant="body2">Your Answer: {selectedAnswer}</Typography>
                <Typography variant="body2" style={{ color: isCorrect ? "green" : "red" }}>
                  {isCorrect ? "Correct!" : `Incorrect. Correct answer: ${question.correctAns}`}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </div>
  );
};

export default ExamPage;
