
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePets } from '@/hooks/usePets';

interface EnhancedSearchScreenProps {
  onBack?: () => void;
  onPetSelect: (petId: string) => void;
}

// Real pet images for different breeds
const getRealPetImage = (type: string, breed: string) => {
  const petImages = {
    'Golden Retriever': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=faces',
    'Persian': 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop&crop=faces',
    'Labrador Mix': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces',
    'Domestic Shorthair': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=faces',
    'German Shepherd': 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop&crop=faces',
    'Siamese': 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop&crop=faces',
    'Beagle': 'https://images.unsplash.com/photo-1505628346881-b72b27e84993?w=400&h=300&fit=crop&crop=faces',
    'Maine Coon': 'https://images.unsplash.com/photo-1573824774092-e5b0e9b3d995?w=400&h=300&fit=crop&crop=faces',
    'Bulldog': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces',
    'Ragdoll': 'https://images.unsplash.com/photo-1606214174585-fe31582cd22c?w=400&h=300&fit=crop&crop=faces'
  };

  // Fallback images for dogs and cats
  const fallbackImages = {
    'Dog': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=faces',
    'Cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=faces'
  };

  return petImages[breed as keyof typeof petImages] || fallbackImages[type as keyof typeof fallbackImages] || fallbackImages['Dog'];
};

export function EnhancedSearchScreen({ onBack, onPetSelect }: EnhancedSearchScreenProps) {
  const { pets, loading } = usePets();
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeAgeFilter, setActiveAgeFilter] = useState('all');
  const [activePriceFilter, setActivePriceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const typeFilters = ['All', 'Dogs', 'Cats', 'Birds', 'Fish'];
  const ageFilters = ['All', 'Young', 'Adult', 'Senior'];
  const priceFilters = ['All', 'Free', 'Under $100', '$100-$500', 'Over $500'];

  const filteredPets = pets.filter(pet => {
    const matchesSearch = searchTerm === '' || 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTypeFilter === 'all' || 
      pet.type.toLowerCase() === activeTypeFilter.toLowerCase().replace('s', '');
    
    const matchesAge = activeAgeFilter === 'all' || 
      (activeAgeFilter === 'young' && (pet.age.includes('month') || pet.age.includes('1 year'))) ||
      (activeAgeFilter === 'adult' && (pet.age.includes('2') || pet.age.includes('3') || pet.age.includes('4'))) ||
      (activeAgeFilter === 'senior' && (pet.age.includes('5') || pet.age.includes('6') || pet.age.includes('7')));

    const matchesPrice = activePriceFilter === 'all' ||
      (activePriceFilter === 'free' && pet.adoption_fee === 0) ||
      (activePriceFilter === 'under $100' && pet.adoption_fee > 0 && pet.adoption_fee < 100) ||
      (activePriceFilter === '$100-$500' && pet.adoption_fee >= 100 && pet.adoption_fee <= 500) ||
      (activePriceFilter === 'over $500' && pet.adoption_fee > 500);

    return matchesSearch && matchesType && matchesAge && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray/30">
        <div className="flex items-center gap-4 mb-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-primary flex-1">Find Pets</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search pets by name, breed, location..."
            className="pl-12 py-3 bg-warm-gray/20 border-warm-gray/30 rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 space-y-4 bg-warm-gray/10">
          {/* Type Filters */}
          <div>
            <h3 className="font-semibold text-primary mb-3">Type</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {typeFilters.map((type) => (
                <Badge 
                  key={type}
                  variant={activeTypeFilter === type.toLowerCase() ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                  onClick={() => setActiveTypeFilter(type.toLowerCase())}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Age Filters */}
          <div>
            <h3 className="font-semibold text-primary mb-3">Age</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {ageFilters.map((age) => (
                <Badge 
                  key={age}
                  variant={activeAgeFilter === age.toLowerCase() ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                  onClick={() => setActiveAgeFilter(age.toLowerCase())}
                >
                  {age}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div>
            <h3 className="font-semibold text-primary mb-3">Price</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {priceFilters.map((price) => (
                <Badge 
                  key={price}
                  variant={activePriceFilter === price.toLowerCase() ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                  onClick={() => setActivePriceFilter(price.toLowerCase())}
                >
                  {price}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="px-6 py-2">
        <p className="text-warm-gray-dark text-sm">
          {filteredPets.length} pets found
        </p>
      </div>

      {/* Pet Grid */}
      <div className="px-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-warm-gray/20" />
                <CardContent className="p-3">
                  <div className="h-4 bg-warm-gray/20 rounded mb-2" />
                  <div className="h-3 bg-warm-gray/20 rounded mb-1" />
                  <div className="h-3 bg-warm-gray/20 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredPets.map((pet) => (
              <Card 
                key={pet.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden"
                onClick={() => onPetSelect(pet.id)}
              >
                <div className="aspect-square relative">
                  <img 
                    src={pet.images?.[0] || getRealPetImage(pet.type, pet.breed)} 
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getRealPetImage(pet.type, pet.breed);
                    }}
                  />
                  {pet.adoption_fee === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  )}
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
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warm-gray-dark text-lg mb-2">No pets found</p>
            <p className="text-warm-gray-dark text-sm">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
