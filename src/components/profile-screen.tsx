import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const user = {
    name: 'Sophia Carter',
    email: 'sophia.carter@email.com',
    avatar: '/lovable-uploads/8eb06a14-cd33-44d7-871d-b5780d546175.png'
  };

  const listedPets = [
    {
      id: '1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      image: '/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png'
    },
    {
      id: '2',
      name: 'Snowball',
      breed: 'Siamese Cat',
      image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png'
    },
    {
      id: '3',
      name: 'Charlie',
      breed: 'Beagle',
      image: '/lovable-uploads/31154413-c1e7-4cb4-81de-7018c48a7b72.png'
    },
    {
      id: '4',
      name: 'Fluffy',
      breed: 'Persian Cat',
      image: '/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png'
    }
  ];

  const adoptionRequests = [
    { id: '1', petName: 'Max', requesterName: 'John Doe', status: 'pending' },
    { id: '2', petName: 'Luna', requesterName: 'Sarah Smith', status: 'approved' }
  ];

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
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
          <p className="text-warm-gray-dark">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs defaultValue="listed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="listed" className="text-primary">Listed Pets</TabsTrigger>
            <TabsTrigger value="requests" className="text-warm-gray-dark">Adoption Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listed" className="space-y-4">
            {listedPets.map((pet) => (
              <Card key={pet.id} className="rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <img 
                      src={pet.image} 
                      alt={pet.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{pet.name}</h3>
                      <p className="text-warm-gray-dark">{pet.breed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            {adoptionRequests.map((request) => (
              <Card key={request.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-primary">{request.petName}</h3>
                      <p className="text-warm-gray-dark">Request from {request.requesterName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-light text-orange-secondary'
                    }`}>
                      {request.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Actions */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-xl font-bold text-primary">Account</h3>
        
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <span className="text-primary">Edit Profile</span>
              <ChevronRight className="w-5 h-5 text-warm-gray-dark" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <span className="text-primary">Logout</span>
              <ChevronRight className="w-5 h-5 text-warm-gray-dark" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}