import React from 'react';
import { Search, Plus, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePets } from '@/hooks/usePets';
import { PetAdsCarousel } from '@/components/pet-ads/pet-ads-carousel';
interface EnhancedHomeScreenProps {
  onPetSelect: (petId: string) => void;
  onSearch?: () => void;
}
export function EnhancedHomeScreen({
  onPetSelect,
  onSearch
}: EnhancedHomeScreenProps) {
  const {
    pets,
    loading
  } = usePets();

  // Get recent pets (limit to 6)
  const recentPets = pets.slice(0, 6);
  return <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Find your pew</h1>
            <p className="text-warm-gray-dark">Discover loving companions near you</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-primary" />
            <span className="text-sm text-warm-gray-dark">San Francisco</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
          <Input placeholder="Search pets by name, breed, location..." className="pl-12 py-3 bg-warm-gray/20 border-warm-gray/30 rounded-2xl cursor-pointer" onClick={onSearch} readOnly />
        </div>

        {/* Pet Ads Carousel */}
        <PetAdsCarousel onPetSelect={onPetSelect} />

        {/* Quick Actions */}
        

        {/* Categories */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {['All', 'Dogs', 'Cats', 'Birds', 'Fish', 'Others'].map(category => <Badge key={category} variant={category === 'All' ? "default" : "secondary"} className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2">
              {category}
            </Badge>)}
        </div>
      </div>

      {/* Recent Pets */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Recent Pets</h2>
          <Button variant="ghost" size="sm" className="text-orange-primary">
            View All
          </Button>
        </div>

        {loading ? <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Card key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-warm-gray/20" />
                <CardContent className="p-3">
                  <div className="h-4 bg-warm-gray/20 rounded mb-2" />
                  <div className="h-3 bg-warm-gray/20 rounded mb-1" />
                  <div className="h-3 bg-warm-gray/20 rounded" />
                </CardContent>
              </Card>)}
          </div> : <div className="grid grid-cols-2 gap-4">
            {recentPets.map(pet => <Card key={pet.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden" onClick={() => onPetSelect(pet.id)}>
                <div className="aspect-square relative">
                  <img src={pet.images?.[0] || '/placeholder.svg'} alt={pet.name} className="w-full h-full object-cover" />
                  {pet.adoption_fee === 0 && <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>}
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white" onClick={e => {
              e.stopPropagation();
              console.log('Add to favorites:', pet.id);
            }}>
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-bold text-primary text-sm mb-1">{pet.name}</h3>
                  <p className="text-xs text-warm-gray-dark mb-1">{pet.breed}</p>
                  <p className="text-xs text-warm-gray-dark mb-2">{pet.age}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-orange-primary">
                      {pet.adoption_fee === 0 ? 'FREE' : `$${pet.adoption_fee}`}
                    </span>
                    <span className="text-xs text-warm-gray-dark">{pet.location}</span>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
    </div>;
}