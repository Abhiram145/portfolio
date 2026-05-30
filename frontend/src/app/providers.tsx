'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e2535',
            color: '#fff',
            border: '1px border white/10',
          },
        }}
      />
    </AuthProvider>
  );
}
