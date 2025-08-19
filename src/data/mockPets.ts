
export interface MockPet {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  color: string;
  description: string;
  health_status: string;
  vaccination_status: string;
  spayed_neutered: boolean;
  good_with_kids: boolean;
  good_with_pets: boolean;
  energy_level: 'Low' | 'Medium' | 'High';
  location: string;
  adoption_fee: number;
  images: string[];
  status: string;
  user_id: string;
  created_at: string;
}

export const mockPets: MockPet[] = [
  {
    id: '1',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    size: 'Large',
    color: 'Golden',
    description: 'Friendly and energetic dog who loves to play fetch and go on walks. Great with children and other pets.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'High',
    location: 'New York, NY',
    adoption_fee: 300,
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user1',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Whiskers',
    type: 'Cat',
    breed: 'Persian',
    age: '2 years',
    gender: 'Female',
    size: 'Medium',
    color: 'White',
    description: 'Calm and affectionate cat who loves to cuddle. Perfect indoor companion for a quiet home.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: false,
    energy_level: 'Low',
    location: 'Los Angeles, CA',
    adoption_fee: 200,
    images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user2',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Charlie',
    type: 'Bird',
    breed: 'Cockatiel',
    age: '1 year',
    gender: 'Male',
    size: 'Small',
    color: 'Yellow and Gray',
    description: 'Talkative and intelligent bird who can whistle tunes. Loves interaction and learning new tricks.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: false,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'Medium',
    location: 'Chicago, IL',
    adoption_fee: 150,
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user3',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: '4 years',
    gender: 'Female',
    size: 'Medium',
    color: 'Cream and Brown',
    description: 'Elegant and vocal cat with striking blue eyes. Very social and loves attention from her humans.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'Medium',
    location: 'Miami, FL',
    adoption_fee: 250,
    images: ['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user4',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    name: 'Max',
    type: 'Dog',
    breed: 'German Shepherd',
    age: '5 years',
    gender: 'Male',
    size: 'Large',
    color: 'Black and Tan',
    description: 'Loyal and protective dog, well-trained and obedient. Perfect guard dog and family companion.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: false,
    energy_level: 'High',
    location: 'Austin, TX',
    adoption_fee: 400,
    images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user5',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    name: 'Bella',
    type: 'Dog',
    breed: 'Labrador Mix',
    age: '2 years',
    gender: 'Female',
    size: 'Medium',
    color: 'Black',
    description: 'Sweet and gentle rescue dog who loves swimming and playing with toys. Great for active families.',
    health_status: 'Good',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'Medium',
    location: 'Seattle, WA',
    adoption_fee: 0,
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user6',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    name: 'Milo',
    type: 'Cat',
    breed: 'Maine Coon',
    age: '3 years',
    gender: 'Male',
    size: 'Large',
    color: 'Orange Tabby',
    description: 'Gentle giant with a fluffy coat and sweet personality. Loves being brushed and sitting by windows.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'Low',
    location: 'Portland, OR',
    adoption_fee: 300,
    images: ['https://images.unsplash.com/photo-1573824774092-e5b0e9b3d995?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user7',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    name: 'Ruby',
    type: 'Bird',
    breed: 'Canary',
    age: '6 months',
    gender: 'Female',
    size: 'Small',
    color: 'Yellow',
    description: 'Beautiful singing canary with a melodious voice. Perfect for bird lovers who enjoy morning songs.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: false,
    good_with_kids: true,
    good_with_pets: false,
    energy_level: 'Medium',
    location: 'Boston, MA',
    adoption_fee: 75,
    images: ['https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user8',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '9',
    name: 'Rocky',
    type: 'Dog',
    breed: 'Bulldog',
    age: '4 years',
    gender: 'Male',
    size: 'Medium',
    color: 'Brindle',
    description: 'Laid-back and friendly bulldog who loves naps and gentle walks. Perfect for apartment living.',
    health_status: 'Good',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'Low',
    location: 'Denver, CO',
    adoption_fee: 350,
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user9',
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '10',
    name: 'Sophie',
    type: 'Cat',
    breed: 'Ragdoll',
    age: '1 year',
    gender: 'Female',
    size: 'Large',
    color: 'Blue Point',
    description: 'Docile and sweet-natured cat who goes limp when picked up. Loves being held and petted.',
    health_status: 'Excellent',
    vaccination_status: 'Up to date',
    spayed_neutered: true,
    good_with_kids: true,
    good_with_pets: true,
    energy_level: 'Low',
    location: 'San Francisco, CA',
    adoption_fee: 400,
    images: ['https://images.unsplash.com/photo-1606214174585-fe31582cd22c?w=400&h=300&fit=crop&crop=faces'],
    status: 'available',
    user_id: 'user10',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock conversations data
export interface MockConversation {
  id: string;
  pet_id: string;
  owner_id: string;
  interested_user_id: string;
  last_message_at: string;
  created_at: string;
  pet_name: string;
  pet_image: string;
  owner_name: string;
  interested_user_name: string;
  last_message: string;
}

export const mockConversations: MockConversation[] = [
  {
    id: 'conv1',
    pet_id: '1',
    owner_id: 'user1',
    interested_user_id: 'currentUser',
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    pet_name: 'Buddy',
    pet_image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=faces',
    owner_name: 'Sarah Johnson',
    interested_user_name: 'You',
    last_message: 'Would love to meet Buddy this weekend!'
  },
  {
    id: 'conv2',
    pet_id: '2',
    owner_id: 'user2',
    interested_user_id: 'currentUser',
    last_message_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pet_name: 'Whiskers',
    pet_image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop&crop=faces',
    owner_name: 'Mike Chen',
    interested_user_name: 'You',
    last_message: 'Whiskers seems perfect for my apartment!'
  },
  {
    id: 'conv3',
    pet_id: '5',
    owner_id: 'user5',
    interested_user_id: 'currentUser',
    last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pet_name: 'Max',
    pet_image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop&crop=faces',
    owner_name: 'Emily Davis',
    interested_user_name: 'You',
    last_message: 'Thank you for considering Max for adoption'
  }
];

// Mock messages data
export interface MockMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  pet_id: string;
  content: string;
  created_at: string;
  sender_name: string;
  is_current_user: boolean;
}

export const mockMessages: { [conversationId: string]: MockMessage[] } = {
  'conv1': [
    {
      id: 'msg1',
      sender_id: 'currentUser',
      receiver_id: 'user1',
      pet_id: '1',
      content: 'Hi! I\'m interested in adopting Buddy. He looks like such a sweet dog!',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sender_name: 'You',
      is_current_user: true
    },
    {
      id: 'msg2',
      sender_id: 'user1',
      receiver_id: 'currentUser',
      pet_id: '1',
      content: 'Hello! Thank you for your interest in Buddy. He really is a wonderful dog. Do you have experience with large dogs?',
      created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      sender_name: 'Sarah Johnson',
      is_current_user: false
    },
    {
      id: 'msg3',
      sender_id: 'currentUser',
      receiver_id: 'user1',
      pet_id: '1',
      content: 'Yes, I grew up with Golden Retrievers! I have a big backyard and love taking dogs on hikes.',
      created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      sender_name: 'You',
      is_current_user: true
    },
    {
      id: 'msg4',
      sender_id: 'user1',
      receiver_id: 'currentUser',
      pet_id: '1',
      content: 'That sounds perfect! Buddy loves hiking. Would you like to meet him this weekend?',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      sender_name: 'Sarah Johnson',
      is_current_user: false
    },
    {
      id: 'msg5',
      sender_id: 'currentUser',
      receiver_id: 'user1',
      pet_id: '1',
      content: 'Would love to meet Buddy this weekend!',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sender_name: 'You',
      is_current_user: true
    }
  ],
  'conv2': [
    {
      id: 'msg6',
      sender_id: 'currentUser',
      receiver_id: 'user2',
      pet_id: '2',
      content: 'Hello! I\'m looking for a calm indoor cat. Whiskers seems perfect!',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      sender_name: 'You',
      is_current_user: true
    },
    {
      id: 'msg7',
      sender_id: 'user2',
      receiver_id: 'currentUser',
      pet_id: '2',
      content: 'Hi there! Whiskers is indeed very calm and loves to cuddle. Do you have any other pets?',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      sender_name: 'Mike Chen',
      is_current_user: false
    },
    {
      id: 'msg8',
      sender_id: 'currentUser',
      receiver_id: 'user2',
      pet_id: '2',
      content: 'No other pets, just me in a quiet apartment. Whiskers seems perfect for my apartment!',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sender_name: 'You',
      is_current_user: true
    }
  ],
  'conv3': [
    {
      id: 'msg9',
      sender_id: 'user5',
      receiver_id: 'currentUser',
      pet_id: '5',
      content: 'Thank you for your interest in Max. He\'s a well-trained German Shepherd who would make a great guard dog.',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      sender_name: 'Emily Davis',
      is_current_user: false
    },
    {
      id: 'msg10',
      sender_id: 'currentUser',
      receiver_id: 'user5',
      pet_id: '5',
      content: 'Thank you for considering Max for adoption',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sender_name: 'You',
      is_current_user: true
    }
  ]
};
