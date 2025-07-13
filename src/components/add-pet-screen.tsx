
import React, { useState } from 'react';
import { ArrowLeft, Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface AddPetScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function AddPetScreen({ onBack, onSubmit }: AddPetScreenProps) {
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [isFree, setIsFree] = useState(true);

  const sampleImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1574293876203-ec2bd0f60e3d?w=400&h=400&fit=crop&crop=faces'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-4 sm:px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="w-8 h-8">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-primary">List a Pet</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-6">
        {/* Pet's Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-primary font-medium text-sm sm:text-base">Pet's Name</Label>
          <Input 
            id="name"
            placeholder="Enter pet's name"
            className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
          />
        </div>

        {/* Pet Type */}
        <div className="space-y-2">
          <Label className="text-primary font-medium text-sm sm:text-base">Pet Type</Label>
          <Select>
            <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base">
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
          <Label htmlFor="age" className="text-primary font-medium text-sm sm:text-base">Age</Label>
          <Input 
            id="age"
            placeholder="Enter pet's age"
            className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-primary font-medium text-sm sm:text-base">Gender</Label>
          <Select>
            <SelectTrigger className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base">
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
          <Label className="text-primary font-medium text-sm sm:text-base">Photos</Label>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
              <Plus className="w-6 h-6 text-warm-gray-dark" />
            </div>
          </div>
        </div>

        {/* Vaccinated */}
        <div className="flex items-center justify-between">
          <Label htmlFor="vaccinated" className="text-primary font-medium text-sm sm:text-base">Vaccinated</Label>
          <Switch 
            id="vaccinated"
            checked={isVaccinated}
            onCheckedChange={setIsVaccinated}
          />
        </div>

        {/* Short Story */}
        <div className="space-y-2">
          <Label htmlFor="story" className="text-primary font-medium text-sm sm:text-base">Short Story</Label>
          <Textarea 
            id="story"
            placeholder="Tell us about your pet"
            className="min-h-32 rounded-2xl bg-warm-gray/20 border-warm-gray resize-none text-sm sm:text-base"
          />
        </div>

        {/* List for Free */}
        <div className="flex items-center justify-between">
          <Label htmlFor="free" className="text-primary font-medium text-sm sm:text-base">List for Free</Label>
          <Switch 
            id="free"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
        </div>

        {/* Price (Optional) */}
        {!isFree && (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-primary font-medium text-sm sm:text-base">Price (Optional)</Label>
            <Input 
              id="price"
              placeholder="Enter price"
              className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
            />
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-primary font-medium text-sm sm:text-base">Location</Label>
          <Input 
            id="location"
            placeholder="Enter location or auto-detect"
            className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray text-sm sm:text-base"
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
