'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Skill } from '@/types';
import { Plus, Trash2, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80,
    icon: ''
  });

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data.data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/skills', newSkill);
      toast.success('Skill added');
      setNewSkill({ name: '', category: 'Frontend', proficiency: 80, icon: '' });
      fetchSkills();
    } catch (err) {
      toast.error('Failed to add skill');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      fetchSkills();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const categories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Design', 'Other'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Technical Skills</h1>
        <p className="text-gray-400">Manage your tech stack and proficiency levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Skill Form */}
        <div className="glass-card p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Plus size={20} className="mr-2 text-brand-500" />
            Add New Skill
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Skill Name</label>
              <input 
                type="text" 
                required
                className="input-field"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder="e.g. React"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select 
                className="input-field"
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex justify-between">
                Proficiency <span>{newSkill.proficiency}%</span>
              </label>
              <input 
                type="range" 
                min="0" max="100"
                className="w-full accent-brand-500 h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer"
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({...newSkill, proficiency: parseInt(e.target.value)})}
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              Add Skill
            </button>
          </form>
        </div>

        {/* Skills List */}
        <div className="lg:col-span-2 space-y-8">
          {categories.map(category => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-sm font-mono text-brand-400 mb-4 uppercase tracking-widest">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill._id} className="glass-card p-4 flex items-center justify-between group">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold">{skill.name}</span>
                          <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-500 rounded-full transition-all duration-500" 
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {loading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
        </div>
      </div>
    </div>
  );
}
