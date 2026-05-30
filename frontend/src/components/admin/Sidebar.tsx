'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Code2, 
  Settings, 
  BookOpen, 
  LogOut, 
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Projects', href: '/admin/projects', icon: Code2 },
  { name: 'Skills', href: '/admin/skills', icon: Settings },
  { name: 'Blog Posts', href: '/admin/blogs', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-72 bg-dark-200 border-r border-white/5 h-screen sticky top-0 flex flex-col p-6">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center font-bold text-xl">
          A
        </div>
        <div className="leading-none">
          <div className="font-bold text-lg">Admin</div>
          <div className="text-[10px] text-brand-400 font-mono tracking-widest uppercase">Portfolio CMS</div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight size={16} className={cn("opacity-0 transition-all", isActive ? "opacity-100" : "group-hover:opacity-100")} />
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-4">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <ExternalLink size={20} />
          <span className="font-medium">View Website</span>
        </Link>
        
        <div className="bg-dark-300 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
            <User size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-bold text-sm truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
          <button 
            onClick={logout}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
