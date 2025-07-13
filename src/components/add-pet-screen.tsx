import React, { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

interface AddPetScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function AddPetScreen({ onBack, onSubmit }: AddPetScreenProps) {
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [isFree, setIsFree] = useState(true);

  const sampleImages = [
    '/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png',
    '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
    '/lovable-uploads/31154413-c1e7-4cb4-81de-7018c48a7b72.png'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">List a Pet</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Pet's Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-primary font-medium">Pet's Name</Label>
          <Input 
            id="name"
            placeholder="Enter pet's name"
            className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
          />
        </div>

        {/* Pet Type */}
        <div className="space-y-2">
          <Label className="text-primary font-medium">Pet Type</Label>
          <Select>
            <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray">
              <SelectValue placeholder="Select pet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="rabbit">Rabbit</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="reptile">Reptile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-primary font-medium">Age</Label>
          <Input 
            id="age"
            placeholder="Enter pet's age"
            className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-primary font-medium">Gender</Label>
          <Select>
            <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Photos */}
        <div className="space-y-2">
          <Label className="text-primary font-medium">Photos</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-warm-gray/20 rounded-2xl border-2 border-dashed border-warm-gray flex items-center justify-center">
              <img 
                src={sampleImages[0]} 
                alt="Pet" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="aspect-square bg-warm-gray/20 rounded-2xl border-2 border-dashed border-warm-gray flex items-center justify-center">
              <img 
                src={sampleImages[1]} 
                alt="Pet" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="aspect-square bg-warm-gray/20 rounded-2xl border-2 border-dashed border-warm-gray flex items-center justify-center">
              <img 
                src={sampleImages[2]} 
                alt="Pet" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Vaccinated */}
        <div className="flex items-center justify-between">
          <Label htmlFor="vaccinated" className="text-primary font-medium">Vaccinated</Label>
          <Switch 
            id="vaccinated"
            checked={isVaccinated}
            onCheckedChange={setIsVaccinated}
          />
        </div>

        {/* Short Story */}
        <div className="space-y-2">
          <Label htmlFor="story" className="text-primary font-medium">Short Story</Label>
          <Textarea 
            id="story"
            placeholder="Tell us about your pet"
            className="min-h-32 rounded-2xl bg-warm-gray/20 border-warm-gray resize-none"
          />
        </div>

        {/* List for Free */}
        <div className="flex items-center justify-between">
          <Label htmlFor="free" className="text-primary font-medium">List for Free</Label>
          <Switch 
            id="free"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
        </div>

        {/* Price (Optional) */}
        {!isFree && (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-primary font-medium">Price (Optional)</Label>
            <Input 
              id="price"
              placeholder="Enter price"
              className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
            />
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-primary font-medium">Location</Label>
          <Input 
            id="location"
            placeholder="Enter location or auto-detect"
            className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-4 rounded-2xl font-semibold text-lg"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}