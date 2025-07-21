
import React, { useState } from 'react';
import { ArrowLeft, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to send adoption requests.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please write a message about why you want to adopt this pet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending adoption request for pet:', pet.id, 'from user:', user.id);
      
      const { error } = await supabase
        .from('adoption_requests')
        .insert({
          pet_id: pet.id,
          requester_id: user.id,
          owner_id: pet.user_id,
          message: message.trim(),
          status: 'pending'
        });

      if (error) {
        console.error('Adoption request error:', error);
        throw error;
      }

      toast({
        title: "Request Sent Successfully!",
        description: "Your adoption request has been submitted. The pet owner will review it soon.",
      });
      
      setMessage('');
      onBack();
    } catch (error: any) {
      console.error('Error sending adoption request:', error);
      toast({
        title: "Error Sending Request",
        description: error.message || "Failed to send adoption request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-orange-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">Pet Not Found</h2>
          <p className="text-warm-gray-dark mb-4">The pet you're looking for doesn't exist.</p>
          <Button onClick={onBack} className="bg-orange-primary hover:bg-orange-secondary text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background px-4 pt-12 pb-4 border-b sticky top-0 z-10 border-warm-gray/30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Adoption Request</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Pet Info Card */}
        <Card className="rounded-2xl overflow-hidden border-warm-gray/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img 
                src={pet.images?.[0] || '/placeholder.svg'} 
                alt={pet.name}
                className="w-24 h-24 rounded-2xl object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">{pet.name}</h3>
                <p className="text-warm-gray-dark text-sm">{pet.breed} • {pet.age} • {pet.gender}</p>
                <p className="text-warm-gray-dark text-sm">{pet.location}</p>
                <div className="mt-2">
                  {pet.adoption_fee === 0 ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Free Adoption
                    </span>
                  ) : (
                    <span className="text-orange-primary font-bold text-lg">
                      ${pet.adoption_fee}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card className="rounded-2xl border-warm-gray/30">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              Why are you perfect for {pet.name}?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                  Your Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Share your experience with pets, living situation, and why you're interested in adopting this pet. Include details about your home, family, and how you plan to care for your new companion..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-40 resize-none rounded-2xl bg-warm-gray/20 border-warm-gray"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-warm-gray-dark mt-2">
                  Please provide detailed information to help the owner make their decision.
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-orange-primary hover:bg-orange-secondary text-white font-semibold py-3 rounded-2xl"
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Request...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Adoption Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="rounded-2xl bg-orange-light border-orange-secondary/30">
          <CardContent className="p-6">
            <h3 className="font-bold text-orange-secondary mb-3 text-lg">
              What happens next?
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-primary rounded-full"></div>
                <p className="text-sm text-warm-gray-dark">Your request will be sent to the pet owner</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-primary rounded-full"></div>
                <p className="text-sm text-warm-gray-dark">They will review your message and profile</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-primary rounded-full"></div>
                <p className="text-sm text-warm-gray-dark">You'll be notified of their decision</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-primary rounded-full"></div>
                <p className="text-sm text-warm-gray-dark">If approved, you can arrange to meet the pet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
