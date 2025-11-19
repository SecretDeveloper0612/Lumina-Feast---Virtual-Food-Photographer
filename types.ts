export type AestheticType = 'RUSTIC' | 'MODERN' | 'SOCIAL';

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Base64 data URI
  isGenerating: boolean;
}

export interface AestheticConfig {
  id: AestheticType;
  label: string;
  description: string;
  promptSuffix: string;
  iconName: string;
}

export interface GeneratedImage {
  imageBytes: string; // Base64 string
}
