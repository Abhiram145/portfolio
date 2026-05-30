'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
        isScrolled ? "py-4 bg-dark-100/80 backdrop-blur-lg border-b border-white/5" : "py-6 bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-2">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-brand-600/20">
            A
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Antigravity<span className="text-brand-500">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin/login" className="btn-primary py-2 px-5 text-sm">
            Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-dark-200 border-b border-white/5 p-6 flex flex-col space-y-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/admin/login" 
              className="btn-primary w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
