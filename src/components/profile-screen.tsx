
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, LogOut, Edit, Heart, MessageCircle, Settings, User, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [userPets, setUserPets] = useState<any[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    phone: '',
    location: ''
  });

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
    if (data) {
      setEditForm({
        full_name: data.full_name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        location: data.location || ''
      });
    }
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

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: `Request ${action}`,
        description: `The adoption request has been ${action}.`,
      });

      fetchAdoptionRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update request.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-light text-orange-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray/30">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Profile</h1>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-28 h-28 mb-4 bg-gradient-warm rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-primary">{profile?.full_name || 'User'}</h2>
          <p className="text-warm-gray-dark">{profile?.email || user?.email}</p>
          {profile?.location && (
            <p className="text-warm-gray-dark flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </p>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 border-orange-primary text-orange-primary hover:bg-orange-light"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-primary">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="mt-1 min-h-20"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-orange-primary hover:bg-orange-secondary text-white"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Details */}
      {profile?.bio && (
        <div className="px-6 py-4">
          <Card className="rounded-2xl border-warm-gray/30">
            <CardContent className="p-4">
              <p className="text-warm-gray-dark">{profile.bio}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Info */}
      {(profile?.phone || profile?.email) && (
        <div className="px-6 pb-4">
          <Card className="rounded-2xl border-warm-gray/30">
            <CardContent className="p-4 space-y-3">
              {profile?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-primary" />
                  <span className="text-warm-gray-dark">{profile.phone}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-primary" />
                  <span className="text-warm-gray-dark">{profile.email}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6">
        <Tabs defaultValue="listed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-warm-gray/20">
            <TabsTrigger value="listed" className="text-primary data-[state=active]:bg-orange-primary data-[state=active]:text-white">
              My Pets ({userPets.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-primary data-[state=active]:bg-orange-primary data-[state=active]:text-white">
              Requests ({adoptionRequests.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listed" className="space-y-4">
            {userPets.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-orange-primary mx-auto mb-4" />
                <p className="text-warm-gray-dark text-lg">You haven't listed any pets yet.</p>
                <p className="text-warm-gray-dark text-sm mt-2">Start by adding your first pet!</p>
              </div>
            ) : (
              userPets.map((pet) => (
                <Card key={pet.id} className="rounded-2xl overflow-hidden border-warm-gray/30">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <img 
                        src={pet.images?.[0] || '/placeholder.svg'} 
                        alt={pet.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-primary text-lg">{pet.name}</h3>
                        <p className="text-warm-gray-dark">{pet.breed} • {pet.age} • {pet.gender}</p>
                        <p className="text-warm-gray-dark text-sm">{pet.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {pet.adoption_fee === 0 ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Free
                            </span>
                          ) : (
                            <span className="text-orange-primary font-bold">${pet.adoption_fee}</span>
                          )}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pet.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-light text-orange-secondary'
                          }`}>
                            {pet.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            {adoptionRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-orange-primary mx-auto mb-4" />
                <p className="text-warm-gray-dark text-lg">No adoption requests yet.</p>
                <p className="text-warm-gray-dark text-sm mt-2">Requests will appear here when people are interested in your pets.</p>
              </div>
            ) : (
              adoptionRequests.map((request) => (
                <Card key={request.id} className="rounded-2xl border-warm-gray/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-primary text-lg">{request.pets?.name}</h3>
                        <p className="text-warm-gray-dark">Request from {request.profiles?.full_name || 'User'}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </div>
                    </div>
                    <p className="text-sm text-warm-gray-dark bg-warm-gray/10 p-3 rounded-lg mb-4">
                      {request.message}
                    </p>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleRequestAction(request.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Actions */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-xl font-bold text-primary">Account Settings</h3>
        
        <Card className="rounded-2xl border-warm-gray/30">
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto text-destructive hover:text-destructive hover:bg-red-50"
              onClick={signOut}
            >
              <span className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                Sign Out
              </span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
