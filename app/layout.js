import './globals.css';
import { CssBaseline } from '@mui/material';

export const metadata = {
  title: 'My Pantry App',
  description: 'Manage your pantry items efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}

