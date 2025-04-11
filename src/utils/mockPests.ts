
import { Pest } from './types';

// Mock pests data
export const pests: Pest[] = [
  {
    id: 'p1',
    name: 'Aphid',
    scientificName: 'Aphidoidea',
    description: 'Small sap-sucking insects that cause stunted growth and leaf curl in many plants.',
    threat: 'medium',
    affectedCrops: ['tomatoes', 'peppers', 'cucumbers', 'lettuce'],
    recommendedTreatments: ['Neem oil', 'Insecticidal soap', 'Ladybugs (biological control)'],
    imageUrl: '/lovable-uploads/aphid.png',
    isBeneficial: false
  },
  {
    id: 'p2',
    name: 'Whitefly',
    scientificName: 'Aleyrodidae',
    description: 'Small winged insects that feed on plant sap and excrete honeydew, leading to sooty mold.',
    threat: 'high',
    affectedCrops: ['tomatoes', 'cucumbers', 'eggplants', 'peppers'],
    recommendedTreatments: ['Yellow sticky traps', 'Neem oil', 'Insecticidal soap', 'Encarsia formosa (parasitic wasp)'],
    imageUrl: '/lovable-uploads/whitefly.png',
    isBeneficial: false
  },
  {
    id: 'p3',
    name: 'Spider Mite',
    scientificName: 'Tetranychus urticae',
    description: 'Tiny pests that cause stippling on leaves and create fine webbing on plants.',
    threat: 'high',
    affectedCrops: ['beans', 'strawberries', 'cucumbers', 'tomatoes'],
    recommendedTreatments: ['Increasing humidity', 'Neem oil', 'Insecticidal soap', 'Predatory mites'],
    imageUrl: '/lovable-uploads/spider-mite.png',
    isBeneficial: false
  },
  {
    id: 'p4',
    name: 'Thrips',
    scientificName: 'Thysanoptera',
    description: 'Slender insects that feed on plant tissues, causing silvery speckling and distorted growth.',
    threat: 'medium',
    affectedCrops: ['onions', 'beans', 'carrots', 'flowers'],
    recommendedTreatments: ['Blue sticky traps', 'Spinosad', 'Neem oil', 'Predatory mites'],
    imageUrl: '/lovable-uploads/thrips.png',
    isBeneficial: false
  },
  {
    id: 'p5',
    name: 'Ladybug',
    scientificName: 'Coccinellidae',
    description: 'Beneficial insects that prey on aphids, mites, and other soft-bodied pests, providing natural pest control.',
    threat: 'low',
    affectedCrops: ['all crops'],
    recommendedTreatments: ['Conservation', 'Habitat creation', 'Avoid broad-spectrum insecticides'],
    imageUrl: '/lovable-uploads/ladybug.png',
    isBeneficial: true
  },
  {
    id: 'p6',
    name: 'Lacewing',
    scientificName: 'Chrysopidae',
    description: 'Beneficial insects whose larvae are voracious predators of aphids, mites, and small caterpillars.',
    threat: 'low',
    affectedCrops: ['all crops'],
    recommendedTreatments: ['Conservation', 'Habitat creation', 'Avoid broad-spectrum insecticides'],
    imageUrl: '/lovable-uploads/lacewing.png',
    isBeneficial: true
  }
];

// Pest utility functions
export const getPestById = (id: string): Pest | undefined => {
  return pests.find(pest => pest.id === id);
};

export const getBeneficialPests = (): Pest[] => {
  return pests.filter(pest => pest.isBeneficial);
};

export const getHarmfulPests = (): Pest[] => {
  return pests.filter(pest => !pest.isBeneficial);
};
