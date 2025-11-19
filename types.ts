
export type AestheticType = 'RUSTIC' | 'MODERN' | 'SOCIAL';
export type AspectRatioType = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Base64 data URI
  isGenerating: boolean;
  aspectRatio?: AspectRatioType;
}

export interface AestheticConfig {
  id: AestheticType;
  label: string;
  description: string;
  promptSuffix: string;
  iconName: string;
}

export interface AspectRatioConfig {
  id: AspectRatioType;
  label: string;
  iconName: string;
}

export interface GeneratedImage {
  imageBytes: string; // Base64 string
}
