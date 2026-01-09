import type { EmergencyContact, CommunityReport } from '@/lib/types';

export const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Jane Doe',
    avatarUrl: 'https://picsum.photos/seed/contact1/100/100',
    phone: '555-1234',
    hasApp: true,
  },
  {
    id: '2',
    name: 'John Smith',
    avatarUrl: 'https://picsum.photos/seed/contact2/100/100',
    phone: '555-5678',
    hasApp: false,
  },
  {
    id: '3',
    name: 'Emily White',
    avatarUrl: 'https://picsum.photos/seed/contact3/100/100',
    phone: '555-8765',
    hasApp: true,
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatarUrl: 'https://picsum.photos/seed/contact4/100/100',
    phone: '555-4321',
    hasApp: false,
  },
];

export const communityReports: CommunityReport[] = [
  { id: '1', description: 'Poor lighting on Elm Street near the park entrance.' },
  { id: '2', description: 'Suspicious individual seen loitering around the bus stop on Oak Avenue.' },
  { id: '3', description: 'Street harassment incident reported at the corner of Maple and 1st.' },
  { id: '4', description: 'A group of people were causing a disturbance at the downtown square last night.' },
];
