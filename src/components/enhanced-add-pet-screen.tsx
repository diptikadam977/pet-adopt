
import React, { useState } from 'react';
import { X, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedAddPetScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function EnhancedAddPetScreen({ onBack, onSubmit }: EnhancedAddPetScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    images: [] as string[]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!formData.name || !formData.breed || !formData.age) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pets')
        .insert([{
          ...formData,
          user_id: user?.id,
          type: 'dog', // Default
          gender: 'unknown',
          size: 'medium',
          color: 'mixed',
          health_status: 'healthy',
          vaccination_status: 'unknown',
          spayed_neutered: false,
          good_with_kids: false,
          good_with_pets: false,
          energy_level: 'medium',
          location: 'Unknown',
          adoption_fee: 0,
          status: 'available'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your pet has been listed successfully!"
      });

      onSubmit();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const PreviewCard = () => (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center">
          <p className="text-white">Pet Photo Preview</p>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-primary">{formData.name || 'Pet Name'}</h3>
          <p className="text-warm-gray-dark">{formData.breed || 'Breed'}, {formData.age || 'Age'}</p>
          <p className="text-sm text-warm-gray-dark mt-2">{formData.description || 'Pet description will appear here...'}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">New Listing</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            placeholder="Pet's Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
          />
          
          <Input
            placeholder="Breed"
            value={formData.breed}
            onChange={(e) => setFormData({...formData, breed: e.target.value})}
            className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
          />
          
          <Input
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
          />
          
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="min-h-32 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark resize-none"
          />
        </div>

        {/* Upload Photos Section */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">Upload Photos</h3>
          <Card className="rounded-2xl border-2 border-dashed border-warm-gray/50">
            <CardContent className="p-8 text-center">
              <h4 className="text-xl font-bold text-primary mb-2">Add Photos</h4>
              <p className="text-warm-gray-dark mb-4">Upload photos of your pet to attract potential adopters.</p>
              <Button variant="outline" className="rounded-xl">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        {(formData.name || formData.breed || formData.age) && (
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Preview</h3>
            <PreviewCard />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 py-3 rounded-2xl"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
}
