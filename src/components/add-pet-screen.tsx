
import React, { useState } from 'react';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddPetScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function AddPetScreen({ onBack, onSubmit }: AddPetScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    description: '',
    location: '',
    adoption_fee: 0,
    vaccination_status: '',
    health_status: '',
    energy_level: ''
  });
  
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [isSpayedNeutered, setIsSpayedNeutered] = useState(false);
  const [goodWithKids, setGoodWithKids] = useState(false);
  const [goodWithPets, setGoodWithPets] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const sampleImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1574293876203-ec2bd0f60e3d?w=400&h=400&fit=crop&crop=faces'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to list a pet.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in the pet's name and type.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const petData = {
        ...formData,
        user_id: user.id,
        spayed_neutered: isSpayedNeutered,
        good_with_kids: goodWithKids,
        good_with_pets: goodWithPets,
        vaccination_status: isVaccinated ? 'vaccinated' : 'not_vaccinated',
        adoption_fee: isFree ? 0 : formData.adoption_fee,
        images: images.length > 0 ? images : sampleImages.slice(0, 2),
        status: 'available'
      };

      const { error } = await supabase
        .from('pets')
        .insert(petData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your pet has been listed successfully.",
      });
      
      onSubmit();
    } catch (error: any) {
      console.error('Error listing pet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to list pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSampleImage = () => {
    if (images.length < 3) {
      setImages([...images, sampleImages[images.length]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-4 sm:px-6 pt-12 pb-4 border-b border-warm-gray sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="w-8 h-8">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-primary">List Your Pet</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-6">
        {/* Basic Information Card */}
        <Card className="rounded-2xl border-warm-gray/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary font-medium text-sm sm:text-base">Pet's Name *</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your pet's name"
                className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-primary font-medium text-sm sm:text-base">Pet Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="reptile">Reptile</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed" className="text-primary font-medium text-sm sm:text-base">Breed</Label>
                <Input 
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => handleInputChange('breed', e.target.value)}
                  placeholder="Enter breed"
                  className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-primary font-medium text-sm sm:text-base">Age</Label>
                <Input 
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="e.g., 2 years"
                  className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium text-sm sm:text-base">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-medium text-sm sm:text-base">Size</Label>
                <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                  <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-primary font-medium text-sm sm:text-base">Color</Label>
              <Input 
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="e.g., Brown, Black, White"
                className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos Card */}
        <Card className="rounded-2xl border-warm-gray/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-primary">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img 
                    src={image} 
                    alt={`Pet ${index + 1}`} 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {images.length < 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addSampleImage}
                  className="aspect-square bg-warm-gray/20 rounded-2xl border-2 border-dashed border-warm-gray hover:bg-warm-gray/30"
                >
                  <Plus className="w-6 h-6 text-warm-gray-dark" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health & Behavior Card */}
        <Card className="rounded-2xl border-warm-gray/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-primary">Health & Behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vaccinated" className="text-primary font-medium text-sm sm:text-base">Vaccinated</Label>
                <Switch 
                  id="vaccinated"
                  checked={isVaccinated}
                  onCheckedChange={setIsVaccinated}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="spayed" className="text-primary font-medium text-sm sm:text-base">Spayed/Neutered</Label>
                <Switch 
                  id="spayed"
                  checked={isSpayedNeutered}
                  onCheckedChange={setIsSpayedNeutered}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="kids" className="text-primary font-medium text-sm sm:text-base">Good with Kids</Label>
                <Switch 
                  id="kids"
                  checked={goodWithKids}
                  onCheckedChange={setGoodWithKids}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="pets" className="text-primary font-medium text-sm sm:text-base">Good with Other Pets</Label>
                <Switch 
                  id="pets"
                  checked={goodWithPets}
                  onCheckedChange={setGoodWithPets}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-primary font-medium text-sm sm:text-base">Energy Level</Label>
              <Select value={formData.energy_level} onValueChange={(value) => handleInputChange('energy_level', value)}>
                <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base">
                  <SelectValue placeholder="Select energy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card className="rounded-2xl border-warm-gray/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-primary">About Your Pet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-primary font-medium text-sm sm:text-base">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your pet's personality, habits, and what makes them special..."
                className="min-h-32 rounded-2xl bg-warm-gray/20 border-warm-gray resize-none text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Adoption Fee Card */}
        <Card className="rounded-2xl border-warm-gray/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-primary">Adoption Fee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="free" className="text-primary font-medium text-sm sm:text-base">List for Free</Label>
              <Switch 
                id="free"
                checked={isFree}
                onCheckedChange={setIsFree}
              />
            </div>

            {!isFree && (
              <div className="space-y-2">
                <Label htmlFor="fee" className="text-primary font-medium text-sm sm:text-base">Adoption Fee ($)</Label>
                <Input 
                  id="fee"
                  type="number"
                  value={formData.adoption_fee}
                  onChange={(e) => handleInputChange('adoption_fee', parseInt(e.target.value) || 0)}
                  placeholder="Enter adoption fee"
                  className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location" className="text-primary font-medium text-sm sm:text-base">Location</Label>
              <Input 
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your city or area"
                className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-orange-primary hover:bg-orange-secondary text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Listing Pet...
            </div>
          ) : (
            "List My Pet"
          )}
        </Button>
      </form>
    </div>
  );
}
