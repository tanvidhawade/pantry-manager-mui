'use client';

import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box } from '@mui/material';
import axios from 'axios';

const PantryItem = ({ id, item, quantity, type, imageUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState(item);
  const [newQuantity, setNewQuantity] = useState(quantity);
  const [newType, setNewType] = useState(type);
  const [recipe, setRecipe] = useState('');

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'pantryItems', id));
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, 'pantryItems', id), {
      item: newItem,
      quantity: newQuantity,
      type: newType,
    });
    setIsEditing(false);
  };

  const getRecipe = async () => {
    try {
      const { data } = await axios.post('/api/recipe-suggest', { pantryItems: [{ item, quantity, type }] });
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error getting recipe:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              required
            />
            <TextField
              label="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              required
            />
            <TextField
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              required
            />
            <Button onClick={handleUpdate}>Update</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Typography variant="h5">{item}</Typography>
            <Typography variant="body2">Quantity: {quantity}</Typography>
            <Typography variant="body2">Type: {type}</Typography>
            {imageUrl && <img src={imageUrl} alt={item} style={{ width: '100%', maxWidth: '200px' }} />}
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={getRecipe}>Get Recipe</Button>
            {recipe && <Typography variant="body2">Recipe: {recipe}</Typography>}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PantryItem;