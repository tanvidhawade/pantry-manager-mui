'use client';

import { TextField } from '@mui/material';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <TextField
      label="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      fullWidth
      margin="normal"
    />
  );
};

export default SearchBar;
