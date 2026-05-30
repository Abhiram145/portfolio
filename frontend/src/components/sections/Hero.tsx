'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
              <Terminal size={16} />
              <span>Available for new opportunities</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Building the future with <br />
              <span className="text-gradient">Scalable Code.</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              Hi, I'm <span className="text-white font-semibold">Antigravity</span>. I'm a Senior Full Stack Engineer 
              specializing in building high-performance web applications with Next.js, 
              Node.js, and Distributed Systems.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="#projects" className="btn-primary group">
                View My Projects
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#contact" className="btn-secondary">
                Get in touch
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              {[
                { icon: <Github />, href: '#' },
                { icon: <Linkedin />, href: '#' },
                { icon: <Mail />, href: '#' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 glass-card p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-dark-300 rounded-xl aspect-square flex items-center justify-center p-8 border border-white/5 overflow-hidden">
                <div className="w-full h-full relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-full grid grid-cols-6 grid-rows-6 gap-4 opacity-20">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="bg-brand-500 rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-brand-600 rounded-full blur-[60px] opacity-50 animate-pulse" />
                    <div className="text-9xl font-black text-white/5 select-none uppercase tracking-tighter italic">
                      Code
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 glass-card p-4 animate-float z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500">
                  JS
                </div>
                <div>
                  <div className="text-xs text-gray-400">Total Experience</div>
                  <div className="font-bold">5+ Years</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card p-4 animate-float [animation-delay:1.5s] z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-500">
                  &lt;/&gt;
                </div>
                <div>
                  <div className="text-xs text-gray-400">Projects Built</div>
                  <div className="font-bold">50+ Completed</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
