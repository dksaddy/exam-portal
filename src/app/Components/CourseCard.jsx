// src/app/Components/CourseCard.jsx
"use client"; // Add this at the top of the file
import { useRouter } from 'next/navigation';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

export const CourseCard = ({ image, title, id }) => {
  const router = useRouter();

  const handleClick = () => {
    // Redirect to the exam page with the course id
    router.push(`/exam?id=${id}`);
  };

  return (
    <Card sx={{
      maxWidth: 190,
       maxHeight: 250,
       cursor: "pointer",
      "&:hover": {
        boxShadow: 3, // Adds a shadow effect on hover
      },
    }}
      onClick={handleClick}>
      <CardMedia component="img" image={image} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};
