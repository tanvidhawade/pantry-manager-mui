'use client';

import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AddItemForm = ({ userId }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'pantryItems'), {
      item,
      quantity,
      type,
      userId,  // Include userId
    });
    setItem('');
    setQuantity('');
    setType('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" gap={2} mb={2}>
      <TextField
        label="Item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">Add Item</Button>
    </Box>
  );
};

export default AddItemForm;
