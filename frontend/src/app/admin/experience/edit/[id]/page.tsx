'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import ExperienceForm from '@/components/admin/ExperienceForm';
import { Experience } from '@/types';
import { Loader2 } from 'lucide-react';

export default function EditExperiencePage() {
  const { id } = useParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await api.get(`/experience/${id}`);
        setExperience(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExperience();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>;
  if (!experience) return <div>Experience not found</div>;

  return <ExperienceForm initialData={experience} />;
}
