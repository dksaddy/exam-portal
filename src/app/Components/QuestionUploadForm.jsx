'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Container,
  Typography,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const QuestionUploadForm = () => {
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAns: '' },
  ]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (index, field, value, optIndex = null) => {
    const updatedQuestions = [...questions];
    if (field === 'text' || field === 'correctAns') {
      updatedQuestions[index][field] = value;
    } else if (field === 'options') {
      updatedQuestions[index].options[optIndex] = value; // Use optIndex for options
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAns: '' },
    ]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('questions', JSON.stringify(questions));
    formData.append('options', JSON.stringify(questions.map(q => q.options)));
    formData.append('correctAns', JSON.stringify(questions.map(q => q.correctAns)));
  
    console.log('Submitting the following form data:', {
      name,
      questions
    });
  
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        setSuccess('Questions uploaded successfully!');
        setName('');
        setImage(null);
        setImagePreview(null);
        setQuestions([{ text: '', options: ['', '', '', ''], correctAns: '' }]);
      } else {
        setError(data.error || 'Failed to upload questions');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    }
  };
  
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Upload Questions
      </Typography>

      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <Typography variant="body1" gutterBottom>
          Upload Image:
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: '10px' }}
        />

        {imagePreview && (
          <Box
            sx={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          </Box>
        )}

        {questions.map((question, index) => (
          <Box
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '5px',
            }}
          >
            <TextField
              label={`Question ${index + 1}`}
              variant="outlined"
              fullWidth
              multiline
              value={question.text}
              onChange={(e) =>
                handleInputChange(index, 'text', e.target.value)
              }
              style={{ marginBottom: '10px' }}
            />
            {question.options.map((option, optIndex) => (
              <TextField
                key={optIndex}
                label={`Option ${optIndex + 1}`}
                variant="outlined"
                fullWidth
                value={option}
                onChange={(e) =>
                  handleInputChange(index, 'options', e.target.value, optIndex)
                }
                style={{ marginBottom: '10px' }}
              />
            ))}
            <TextField
              label="Correct Answer"
              variant="outlined"
              fullWidth
              value={question.correctAns}
              onChange={(e) =>
                handleInputChange(index, 'correctAns', e.target.value)
              }
              style={{ marginBottom: '10px' }}
            />
          </Box>
        ))}

        <IconButton
          color="primary"
          onClick={addQuestion}
          style={{ marginBottom: '20px' }}
        >
          <AddIcon />
        </IconButton>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default QuestionUploadForm;
