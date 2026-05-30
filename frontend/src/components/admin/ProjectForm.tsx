'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Project } from '@/types';
import { Save, X, Image as ImageIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface ProjectFormProps {
  initialData?: Project;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    coverImage: initialData?.coverImage || '',
    technologies: initialData?.technologies || [] as string[],
    category: initialData?.category || 'Web',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    featured: initialData?.featured || false,
    status: initialData?.status || 'published',
  });

  const [techInput, setTechInput] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setIsUploading(true);
    try {
      const res = await api.post('/upload/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, coverImage: res.data.data.url });
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const addTech = () => {
    if (techInput && !formData.technologies.includes(techInput)) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput]
      });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await api.put(`/projects/${initialData._id}`, formData);
        toast.success('Project updated');
      } else {
        await api.post('/projects', formData);
        toast.success('Project created');
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{initialData ? 'Edit Project' : 'New Project'}</h1>
        <div className="flex space-x-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
            Save Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
              <input 
                type="text" 
                required
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Short Description</label>
              <textarea 
                required
                rows={2}
                className="input-field resize-none"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              />
            </div>
            <div data-color-mode="dark">
              <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Description (Markdown)</label>
              <MDEditor
                value={formData.description}
                onChange={(val) => setFormData({...formData, description: val || ''})}
                preview="edit"
                height={400}
                className="border border-white/10 rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
              <div className="aspect-video bg-dark-300 rounded-xl border-2 border-dashed border-white/10 relative overflow-hidden flex items-center justify-center group">
                {formData.coverImage ? (
                  <>
                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer btn-secondary py-2 px-4">
                         Change Image
                         <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                       </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-white transition-colors">
                    {isUploading ? <Loader2 className="animate-spin mb-2" /> : <ImageIcon className="mb-2" />}
                    <span>Upload Image</span>
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select 
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              >
                {['Web', 'Mobile', 'AI/ML', 'DevOps', 'API', 'Open Source', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Technologies</label>
              <div className="flex space-x-2 mb-3">
                <input 
                  type="text" 
                  className="input-field"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="e.g. Next.js"
                />
                <button type="button" onClick={addTech} className="btn-secondary px-4">
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full text-xs flex items-center border border-brand-500/20">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="ml-2 hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-sm font-medium">Featured Project</span>
              <input 
                type="checkbox" 
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 accent-brand-500"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                <input 
                  type="url" 
                  className="input-field"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Live URL</label>
                <input 
                  type="url" 
                  className="input-field"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
