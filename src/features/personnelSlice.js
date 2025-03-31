import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personnel: {
    // Sample personnel for all factories
    'ADD': [
      {
        id: 'person-1',
        name: 'Emily Chen',
        currentRole: 'Quality Engineer',
        skills: [
          'Quality control procedures',
          'Statistical analysis',
          'Process improvement',
          'Documentation'
        ],
        experience: [
          '5 years in quality engineering',
          'ISO 9001 certification',
          'Six Sigma Green Belt'
        ],
        availability: 'Available' // 'Available', 'Assigned', 'Partially Available'
      },
      {
        id: 'person-2',
        name: 'Michael Rodriguez',
        currentRole: 'Quality Manager',
        skills: [
          'Quality management systems',
          'Team leadership',
          'Process improvement',
          'Regulatory compliance'
        ],
        experience: [
          '8 years in quality management',
          'ISO 13485 certification',
          'Six Sigma Black Belt'
        ],
        availability: 'Assigned'
      },
      {
        id: 'person-3',
        name: 'Sarah Johnson',
        currentRole: 'Quality Director',
        skills: [
          'Strategic planning',
          'Quality systems',
          'Regulatory affairs',
          'Executive leadership'
        ],
        experience: [
          '12 years in quality leadership',
          'FDA compliance expertise',
          'Multiple product launches'
        ],
        availability: 'Assigned'
      }
    ],
    'BBV': [
      {
        id: 'person-4',
        name: 'David Thompson',
        currentRole: 'Quality Analyst',
        skills: [
          'Data analysis',
          'Quality metrics',
          'Reporting',
          'Compliance monitoring'
        ],
        experience: [
          '4 years in quality analysis',
          'Statistical process control',
          'Database management'
        ],
        availability: 'Available'
      },
      {
        id: 'person-5',
        name: 'Lisa Patel',
        currentRole: 'Quality Inspector',
        skills: [
          'Visual inspection',
          'Testing protocols',
          'Documentation',
          'GMP compliance'
        ],
        experience: [
          '6 years in quality inspection',
          'Packaging expertise',
          'Validation experience'
        ],
        availability: 'Available'
      }
    ],
    'SYN': [
      {
        id: 'person-6',
        name: 'James Wilson',
        currentRole: 'Quality Engineer',
        skills: [
          'Sterilization processes',
          'Validation protocols',
          'Clean room operations',
          'Risk assessment'
        ],
        experience: [
          '7 years in sterile manufacturing',
          'Aseptic processing',
          'ISO 14644 expertise'
        ],
        availability: 'Partially Available'
      },
      {
        id: 'person-7',
        name: 'Maria Garcia',
        currentRole: 'Quality Specialist',
        skills: [
          'Syringe manufacturing',
          'Quality testing',
          'Process validation',
          'Technical writing'
        ],
        experience: [
          '5 years in medical device quality',
          'Injection molding expertise',
          'Complaint handling'
        ],
        availability: 'Available'
      }
    ]
  }
};

export const personnelSlice = createSlice({
  name: 'personnel',
  initialState,
  reducers: {
    addPersonnel: (state, action) => {
      const { factory, person } = action.payload;
      state.personnel[factory].push(person);
    },
    updatePersonnel: (state, action) => {
      const { factory, personId, updatedPerson } = action.payload;
      const index = state.personnel[factory].findIndex(person => person.id === personId);
      if (index !== -1) {
        state.personnel[factory][index] = { ...state.personnel[factory][index], ...updatedPerson };
      }
    },
    updatePersonnelAvailability: (state, action) => {
      const { factory, personId, availability } = action.payload;
      const index = state.personnel[factory].findIndex(person => person.id === personId);
      if (index !== -1) {
        state.personnel[factory][index].availability = availability;
      }
    },
    removePersonnel: (state, action) => {
      const { factory, personId } = action.payload;
      state.personnel[factory] = state.personnel[factory].filter(person => person.id !== personId);
    }
  },
});

export const { addPersonnel, updatePersonnel, updatePersonnelAvailability, removePersonnel } = personnelSlice.actions;

export default personnelSlice.reducer;
