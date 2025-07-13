
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userPets, setUserPets] = useState<any[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserPets();
      fetchAdoptionRequests();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setProfile(data);
  };

  const fetchUserPets = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setUserPets(data || []);
  };

  const fetchAdoptionRequests = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('adoption_requests')
      .select(`
        *,
        pets:pet_id (name, images),
        profiles:requester_id (full_name)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    
    setAdoptionRequests(data || []);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Profile</h1>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 mb-4 bg-orange-light rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-orange-primary">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-primary">{profile?.full_name || 'User'}</h2>
          <p className="text-warm-gray-dark">{profile?.email || user?.email}</p>
          {profile?.location && (
            <p className="text-warm-gray-dark">{profile.location}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs defaultValue="listed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="listed" className="text-primary">My Pets ({userPets.length})</TabsTrigger>
            <TabsTrigger value="requests" className="text-warm-gray-dark">Requests ({adoptionRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listed" className="space-y-4">
            {userPets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-warm-gray-dark">You haven't listed any pets yet.</p>
              </div>
            ) : (
              userPets.map((pet) => (
                <Card key={pet.id} className="rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <img 
                        src={pet.images?.[0] || '/placeholder.svg'} 
                        alt={pet.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">{pet.name}</h3>
                        <p className="text-warm-gray-dark">{pet.breed} · {pet.age}</p>
                        <p className="text-orange-primary font-semibold">${pet.adoption_fee}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        pet.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-light text-orange-secondary'
                      }`}>
                        {pet.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            {adoptionRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-warm-gray-dark">No adoption requests yet.</p>
              </div>
            ) : (
              adoptionRequests.map((request) => (
                <Card key={request.id} className="rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">{request.pets?.name}</h3>
                        <p className="text-warm-gray-dark">Request from {request.profiles?.full_name || 'User'}</p>
                        <p className="text-sm text-warm-gray-dark mt-1">{request.message}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ml-4 ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-light text-orange-secondary'
                      }`}>
                        {request.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Actions */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-xl font-bold text-primary">Account</h3>
        
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto text-destructive hover:text-destructive"
              onClick={signOut}
            >
              <span>Logout</span>
              <LogOut className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
