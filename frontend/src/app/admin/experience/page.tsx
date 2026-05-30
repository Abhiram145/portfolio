'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Experience } from '@/types';
import { Plus, Edit2, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/experience');
      setExperiences(res.data.data);
    } catch (err) {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await api.delete(`/experience/${id}`);
      toast.success('Experience deleted');
      fetchExperiences();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-gray-400">Manage your professional journey</p>
        </div>
        <Link href="/admin/experience/new" className="btn-primary">
          <Plus size={20} className="mr-2" />
          Add Experience
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {experiences.map((exp) => (
            <div key={exp._id} className="glass-card p-6 flex items-start justify-between group">
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-500 font-bold text-xl">
                    {exp.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-brand-400 font-medium">{exp.company}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {new Date(exp.startDate).toLocaleDateString()} — {exp.isCurrent ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {exp.location}
                  </div>
                </div>

                <ul className="space-y-2">
                  {exp.highlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="text-gray-500 text-sm flex items-start">
                      <span className="text-brand-500 mr-2">▹</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/experience/edit/${exp._id}`} className="p-3 hover:bg-white/5 rounded-xl text-brand-400 transition-colors">
                  <Edit2 size={20} />
                </Link>
                <button 
                  onClick={() => handleDelete(exp._id)}
                  className="p-3 hover:bg-white/5 rounded-xl text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="glass-card p-20 text-center text-gray-500">
              No experiences found. Add your first role!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
