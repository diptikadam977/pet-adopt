
import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdoptionRequestScreenProps {
  onBack: () => void;
  pet: any;
}

export function AdoptionRequestScreen({ onBack, pet }: AdoptionRequestScreenProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .insert({
          pet_id: pet.id,
          requester_id: user.id,
          owner_id: pet.user_id || null,
          message: message
        });

      if (error) throw error;

      toast({
        title: "Request sent!",
        description: "Your adoption request has been submitted successfully.",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background px-4 pt-12 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Adoption Request</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Pet Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img 
                src={pet.images?.[0] || '/placeholder.svg'} 
                alt={pet.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-primary">{pet.name}</h3>
                <p className="text-warm-gray-dark">{pet.breed} • {pet.age}</p>
                <p className="text-orange-primary font-semibold">
                  ${pet.adoption_fee}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tell us why you'd be perfect for {pet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Share your experience with pets, living situation, and why you're interested in adopting this pet..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32"
                required
              />
              
              <Button
                type="submit"
                className="w-full bg-orange-primary hover:bg-orange-secondary"
                disabled={loading}
              >
                {loading ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Adoption Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
