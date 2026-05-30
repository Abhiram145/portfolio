'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Experience } from '@/types';
import { Save, X, Loader2, Plus, Trash2, Calendar, MapPin, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExperienceFormProps {
  initialData?: Experience;
}

export default function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    isCurrent: initialData?.isCurrent || false,
    employmentType: initialData?.employmentType || 'Full-time',
    description: initialData?.description || '',
    highlights: initialData?.highlights || [''],
    companyWebsite: initialData?.companyWebsite || '',
  });

  const handleAddHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Sanitize data
    const payload: {
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate?: string | null;
      isCurrent: boolean;
      employmentType: string;
      description: string;
      highlights: string[];
      companyWebsite: string;
    } = {
      ...formData,
      highlights: formData.highlights.filter(h => h.trim() !== ''),
      endDate: formData.isCurrent ? null : formData.endDate,
    };

    if (payload.endDate === '') delete payload.endDate;

    try {
      if (initialData) {
        await api.put(`/experience/${initialData._id}`, payload);
        toast.success('Experience updated');
      } else {
        await api.post('/experience', payload);
        toast.success('Experience added');
      }
      router.push('/admin/experience');
      router.refresh();
    } catch (err: any) {
      console.error('Submission error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{initialData ? 'Edit Experience' : 'New Experience'}</h1>
        <div className="flex space-x-4">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
            Save Experience
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                <div className="relative">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input 
                    type="text" required className="input-field pl-12"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                <input 
                  type="text" required className="input-field"
                  value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Key Highlights & Responsibilities</label>
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex space-x-2">
                    <input 
                      type="text" className="input-field"
                      value={highlight} onChange={(e) => handleHighlightChange(index, e.target.value)}
                      placeholder="Achieved 40% performance improvement..."
                    />
                    <button 
                      type="button" onClick={() => handleRemoveHighlight(index)}
                      className="p-3 text-gray-500 hover:text-red-400 bg-white/5 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" onClick={handleAddHighlight}
                  className="flex items-center text-sm text-brand-400 hover:text-brand-300 font-medium pt-2"
                >
                  <Plus size={16} className="mr-1" /> Add Highlight
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Description (Optional)</label>
              <textarea 
                rows={4} className="input-field resize-none"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Employment Type</label>
              <select 
                className="input-field"
                value={formData.employmentType}
                onChange={(e) => setFormData({...formData, employmentType: e.target.value as any})}
              >
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                <input 
                  type="date" required className="input-field"
                  value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                   <label className="block text-sm font-medium text-gray-400">End Date</label>
                   <label className="flex items-center text-xs text-brand-400 cursor-pointer">
                      <input 
                        type="checkbox" className="mr-2"
                        checked={formData.isCurrent}
                        onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
                      />
                      I currently work here
                   </label>
                </div>
                {!formData.isCurrent && (
                  <input 
                    type="date" required={!formData.isCurrent} className="input-field"
                    value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" className="input-field pl-12"
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Remote / New York"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Company Website</label>
              <input 
                type="url" className="input-field"
                value={formData.companyWebsite} onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                placeholder="https://company.com"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
