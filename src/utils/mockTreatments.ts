
import { Treatment } from './types';

// Mock treatments data
export const treatments: Treatment[] = [
  {
    id: 't1',
    fieldId: 'f1',
    pestId: 'p1',
    method: 'Neem oil spray',
    dateApplied: '2025-04-04',
    status: 'completed',
    notes: 'Applied in the evening as recommended',
    effectivenessRating: 4
  },
  {
    id: 't2',
    fieldId: 'f2',
    pestId: 'p2',
    method: 'Yellow sticky traps',
    dateApplied: '2025-04-04',
    status: 'completed',
    notes: 'Placed 10 traps throughout the field',
    effectivenessRating: 3
  },
  {
    id: 't3',
    fieldId: 'f3',
    pestId: 'p3',
    method: 'Release of predatory mites',
    dateApplied: '2025-04-06',
    status: 'scheduled'
  }
];

// Treatment utility functions
export const getTreatmentsByFieldId = (fieldId: string): Treatment[] => {
  return treatments.filter(treatment => treatment.fieldId === fieldId);
};

export const getTreatmentsByPestId = (pestId: string): Treatment[] => {
  return treatments.filter(treatment => treatment.pestId === pestId);
};
