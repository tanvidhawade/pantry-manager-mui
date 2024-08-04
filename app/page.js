'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AddItemForm from './components/AddItemForm';
import PantryItem from './components/PantryItem';
import SearchBar from './components/SearchBar';
import ImageCapture from './components/ImageCapture';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { Container, Typography, Box, Button } from '@mui/material';

export default function Home() {
  const [pantryItems, setPantryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userPantryQuery = query(collection(db, 'pantryItems'), where('userId', '==', currentUser.uid));
        onSnapshot(userPantryQuery, (snapshot) => {
          setPantryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        setUser(null);
        setPantryItems([]);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const filteredItems = pantryItems.filter(item =>
    item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <Container>
        <Typography variant="h3" gutterBottom>My Pantry</Typography>
        {isRegistering ? (
          <>
            <RegisterForm setUser={setUser} />
            <Button onClick={() => setIsRegistering(false)}>Already have an account? Login</Button>
          </>
        ) : (
          <>
            <LoginForm setUser={setUser} />
            <Button onClick={() => setIsRegistering(true)}>Don&apos;t have an account? Register</Button>
          </>
        )}
      </Container>
    );
  }

  return (
    <Layout>
      <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AddItemForm userId={user.uid} />
      <Box display="flex" flexDirection="column" gap={2}>
        {filteredItems.map(({ id, item, quantity, type, imageUrl }) => (
          <PantryItem key={id} id={id} item={item} quantity={quantity} type={type} imageUrl={imageUrl} />
        ))}
      </Box>
      <ImageCapture />
    </Layout>
  );
}
