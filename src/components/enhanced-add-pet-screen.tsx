
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

interface FormData {
  name: string;
  breed: string;
  age: string;
  description: string;
  type: string;
  gender: string;
  size: string;
  color: string;
  health_status: string;
  vaccination_status: string;
  spayed_neutered: boolean;
  good_with_kids: boolean;
  good_with_pets: boolean;
  energy_level: string;
  location: string;
  adoption_fee: number;
  images: string[];
}

export function EnhancedAddPetScreen({ onBack, onSubmit }: EnhancedAddPetScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    breed: '',
    age: '',
    description: '',
    type: 'dog',
    gender: 'unknown',
    size: 'medium',
    color: '',
    health_status: 'healthy',
    vaccination_status: 'up_to_date',
    spayed_neutered: false,
    good_with_kids: false,
    good_with_pets: false,
    energy_level: 'medium',
    location: '',
    adoption_fee: 0,
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('pet-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));

    setUploading(false);
    
    if (uploadedUrls.length > 0) {
      toast({
        title: "Images Uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully`
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.breed || !formData.age || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (name, breed, age, location)",
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
          {formData.images.length > 0 ? (
            <img
              src={formData.images[0]}
              alt="Pet preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-white">No photos uploaded yet</p>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-primary">{formData.name || 'Pet Name'}</h3>
            <span className="text-lg font-bold text-orange-primary">${formData.adoption_fee}</span>
          </div>
          <p className="text-warm-gray-dark">{formData.breed || 'Breed'} • {formData.age || 'Age'} • {formData.gender}</p>
          <p className="text-sm text-warm-gray-dark mt-1">{formData.location || 'Location'}</p>
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
            placeholder="Pet's Name *"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="py-4 px-4 rounded-2xl bg-warm-gray/20 border-0 text-primary"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
            
            <Input
              placeholder="Breed *"
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
              className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Age *"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
            />
            
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="py-4 px-4 rounded-2xl bg-warm-gray/20 border-0 text-primary"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="py-4 px-4 rounded-2xl bg-warm-gray/20 border-0 text-primary"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            
            <Input
              placeholder="Color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
            />
          </div>
          
          <Input
            placeholder="Location *"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
          />
          
          <Input
            type="number"
            placeholder="Adoption Fee ($)"
            value={formData.adoption_fee || ''}
            onChange={(e) => setFormData({...formData, adoption_fee: parseInt(e.target.value) || 0})}
            className="py-4 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark"
          />
          
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="min-h-32 rounded-2xl bg-warm-gray/20 border-0 placeholder:text-warm-gray-dark resize-none"
          />
          
          {/* Health & Behavior */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary">Health & Behavior</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.health_status}
                onChange={(e) => setFormData({...formData, health_status: e.target.value})}
                className="py-3 px-4 rounded-2xl bg-warm-gray/20 border-0 text-primary"
              >
                <option value="excellent">Excellent Health</option>
                <option value="good">Good Health</option>
                <option value="fair">Fair Health</option>
                <option value="needs_care">Needs Medical Care</option>
              </select>
              
              <select
                value={formData.vaccination_status}
                onChange={(e) => setFormData({...formData, vaccination_status: e.target.value})}
                className="py-3 px-4 rounded-2xl bg-warm-gray/20 border-0 text-primary"
              >
                <option value="up_to_date">Up to Date</option>
                <option value="partial">Partially Vaccinated</option>
                <option value="unknown">Unknown</option>
                <option value="none">No Vaccinations</option>
              </select>
            </div>
            
            <select
              value={formData.energy_level}
              onChange={(e) => setFormData({...formData, energy_level: e.target.value})}
              className="py-3 px-4 rounded-2xl bg-warm-gray/20 border-0 text-primary w-full"
            >
              <option value="low">Low Energy</option>
              <option value="medium">Medium Energy</option>
              <option value="high">High Energy</option>
            </select>
            
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.spayed_neutered}
                  onChange={(e) => setFormData({...formData, spayed_neutered: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-primary">Spayed/Neutered</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.good_with_kids}
                  onChange={(e) => setFormData({...formData, good_with_kids: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-primary">Good with Kids</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.good_with_pets}
                  onChange={(e) => setFormData({...formData, good_with_pets: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-primary">Good with Pets</span>
              </label>
            </div>
          </div>
        </div>

        {/* Upload Photos Section */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">Upload Photos</h3>
          
          {/* Uploaded Images Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Pet ${index + 1}`}
                    className="w-full h-20 object-cover rounded-xl"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <Card className="rounded-2xl border-2 border-dashed border-warm-gray/50">
            <CardContent className="p-8 text-center">
              <h4 className="text-xl font-bold text-primary mb-2">Add Photos</h4>
              <p className="text-warm-gray-dark mb-4">Upload photos of your pet to attract potential adopters.</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" className="rounded-xl" disabled={uploading} asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                  </span>
                </Button>
              </label>
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
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
          >
            {loading ? 'Creating...' : uploading ? 'Uploading...' : 'Create Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
}
