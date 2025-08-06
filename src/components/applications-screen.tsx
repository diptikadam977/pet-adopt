
import React from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationsScreenProps {
  onBack: () => void;
}

interface Application {
  id: string;
  pet_id: string;
  status: string;
  message: string;
  created_at: string;
  pets: {
    name: string;
    images: string[];
    type: string;
    breed: string;
  };
}

export function ApplicationsScreen({ onBack }: ApplicationsScreenProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('adoption_requests')
          .select(`
            id,
            pet_id,
            status,
            message,
            created_at,
            pets!inner(name, images, type, breed)
          `)
          .eq('requester_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

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
          <h1 className="text-xl font-bold text-primary">My Applications</h1>
        </div>
      </div>

      {/* Applications List */}
      <div className="px-6 py-4">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-warm-gray-dark mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No applications yet</h3>
            <p className="text-warm-gray-dark">Apply for pets you're interested in to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={application.pets.images?.[0] || '/placeholder.svg'}
                      alt={application.pets.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-primary">{application.pets.name}</h3>
                        {getStatusIcon(application.status)}
                      </div>
                      <p className="text-sm text-warm-gray-dark mb-2">
                        {application.pets.breed} • {application.pets.type}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-warm-gray-dark">
                          {new Date(application.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {application.message && (
                        <p className="text-sm text-warm-gray-dark mt-2 italic">
                          "{application.message}"
                        </p>
                      )}
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
