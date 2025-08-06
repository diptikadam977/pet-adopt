
import React from 'react';
import { ArrowLeft, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdoptionHistoryScreenProps {
  onBack: () => void;
}

interface AdoptedPet {
  id: string;
  pet_id: string;
  created_at: string;
  pets: {
    name: string;
    images: string[];
    type: string;
    breed: string;
    adoption_fee: number;
  };
}

export function AdoptionHistoryScreen({ onBack }: AdoptionHistoryScreenProps) {
  const { user } = useAuth();
  const [adoptedPets, setAdoptedPets] = useState<AdoptedPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptionHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('adoption_requests')
          .select(`
            id,
            pet_id,
            created_at,
            pets!inner(name, images, type, breed, adoption_fee)
          `)
          .eq('requester_id', user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAdoptedPets(data || []);
      } catch (error) {
        console.error('Error fetching adoption history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Adoption History</h1>
        </div>
      </div>

      {/* Adoption History List */}
      <div className="px-6 py-4">
        {adoptedPets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-warm-gray-dark mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No adoptions yet</h3>
            <p className="text-warm-gray-dark">Your adopted pets will appear here once applications are approved!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {adoptedPets.map((adoption) => (
              <Card key={adoption.id} className="rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={adoption.pets.images?.[0] || '/placeholder.svg'}
                      alt={adoption.pets.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-primary">{adoption.pets.name}</h3>
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      </div>
                      <p className="text-sm text-warm-gray-dark mb-2">
                        {adoption.pets.breed} • {adoption.pets.type}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">
                          Adopted
                        </Badge>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-warm-gray-dark">
                            <Calendar className="w-3 h-3" />
                            {new Date(adoption.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            ${adoption.pets.adoption_fee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
