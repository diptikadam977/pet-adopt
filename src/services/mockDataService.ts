import { mockPets, type MockPet } from '@/data/mockPets';

class MockDataService {
  private pets: MockPet[] = [...mockPets];
  private listeners: ((pets: MockPet[]) => void)[] = [];

  constructor() {
    // Simulate new pets being added every 30 seconds
    setInterval(() => {
      this.addRandomPet();
    }, 30000);
  }

  private addRandomPet() {
    const newPetTemplates = [
      {
        name: 'Daisy',
        type: 'Dog' as const,
        breed: 'Golden Retriever',
        color: 'Golden',
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=faces']
      },
      {
        name: 'Shadow',
        type: 'Cat' as const,
        breed: 'Black Cat',
        color: 'Black',
        images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=faces']
      },
      {
        name: 'Sunny',
        type: 'Bird' as const,
        breed: 'Parakeet',
        color: 'Green and Yellow',
        images: ['https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&crop=faces']
      },
      {
        name: 'Cooper',
        type: 'Dog' as const,
        breed: 'Border Collie',
        color: 'Black and White',
        images: ['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop&crop=faces']
      }
    ];

    const template = newPetTemplates[Math.floor(Math.random() * newPetTemplates.length)];
    const cities = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Miami, FL'];
    
    const newPet: MockPet = {
      id: `new-${Date.now()}`,
      name: template.name,
      type: template.type,
      breed: template.breed,
      age: `${Math.floor(Math.random() * 8) + 1} year${Math.floor(Math.random() * 8) + 1 > 1 ? 's' : ''}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      size: template.type === 'Bird' ? 'Small' : (Math.random() > 0.5 ? 'Medium' : 'Large'),
      color: template.color,
      description: `A wonderful ${template.type.toLowerCase()} looking for a loving home. Very friendly and well-behaved.`,
      health_status: 'Excellent',
      vaccination_status: 'Up to date',
      spayed_neutered: Math.random() > 0.3,
      good_with_kids: Math.random() > 0.2,
      good_with_pets: Math.random() > 0.4,
      energy_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
      location: cities[Math.floor(Math.random() * cities.length)],
      adoption_fee: Math.random() > 0.3 ? Math.floor(Math.random() * 400) + 100 : 0,
      images: template.images,
      status: 'available',
      user_id: `user${Math.floor(Math.random() * 20) + 1}`,
      created_at: new Date().toISOString()
    };

    this.pets.unshift(newPet); // Add to beginning for newest first
    
    // Keep only the 20 most recent pets to avoid memory issues
    if (this.pets.length > 20) {
      this.pets = this.pets.slice(0, 20);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener([...this.pets]));
  }

  subscribe(listener: (pets: MockPet[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getPets(): MockPet[] {
    return [...this.pets];
  }
}

export const mockDataService = new MockDataService();
