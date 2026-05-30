'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Blog } from '@/types';
import { Plus, Edit2, Trash2, Eye, Calendar, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-gray-400">Share your thoughts and tutorials</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary">
          <Plus size={20} className="mr-2" />
          New Post
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Search blogs..." 
          className="input-field pl-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="glass-card p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-16 h-16 bg-dark-300 rounded-lg overflow-hidden border border-white/5">
                  {blog.coverImage && <img src={blog.coverImage} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{blog.title}</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center"><Eye size={12} className="mr-1" /> {blog.views} views</span>
                    <span className={blog.status === 'published' ? 'text-green-500' : 'text-yellow-500'}>{blog.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link href={`/blog/${blog.slug}`} target="_blank" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
                  <Eye size={18} />
                </Link>
                <Link href={`/admin/blogs/edit/${blog._id}`} className="p-2 hover:bg-white/5 rounded-lg text-brand-400">
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 hover:bg-white/5 rounded-lg text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredBlogs.length === 0 && <div className="text-center py-20 text-gray-500">No blog posts found.</div>}
        </div>
      )}
    </div>
  );
}
