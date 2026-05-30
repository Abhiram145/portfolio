'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Project } from '@/types';
import { Plus, Edit2, Trash2, ExternalLink, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDate, cn } from '@/lib/utils';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-400">Manage your portfolio showcase</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={20} className="mr-2" />
          Add Project
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="input-field pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} className="mr-2" />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Project</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Stats</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-dark-300 rounded-lg overflow-hidden border border-white/5">
                        {project.coverImage && <img src={project.coverImage} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold">{project.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{project.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      project.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    )}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{project.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-4 text-xs font-mono">
                      <span className="text-blue-400">{project.views}v</span>
                      <span className="text-brand-400">{project.clicks}c</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Link href={`/projects/${project.slug}`} target="_blank" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
                        <ExternalLink size={18} />
                      </Link>
                      <Link href={`/admin/projects/edit/${project._id}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-brand-400">
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="p-20 text-center text-gray-500">No projects found.</div>
          )}
        </div>
      )}
    </div>
  );
}

