'use client';

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/admin/Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoginPage = pathname === '/admin/login';
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  // Allow the login page to render even if no user is present
  const isLoginPage = pathname === '/admin/login';
  if (!user && !isLoginPage) return null;

  return (
    <div className="flex min-h-screen bg-dark-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
