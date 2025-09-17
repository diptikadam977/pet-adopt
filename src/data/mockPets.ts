import pet1 from '@/assets/pet-1.jpg';
import pet2 from '@/assets/pet-2.jpg';
import pet3 from '@/assets/pet-3.jpg';
import pet4 from '@/assets/pet-4.jpg';
import pet5 from '@/assets/pet-5.jpg';
import pet6 from '@/assets/pet-6.jpg';
import pet7 from '@/assets/pet-7.jpg';

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

export const mockPets: MockPet[] = [];

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
    pet_image: pet1,
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
    pet_image: pet2,
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
    pet_image: pet5,
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
