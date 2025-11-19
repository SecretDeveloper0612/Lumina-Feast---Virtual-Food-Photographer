import { AestheticConfig } from './types';
import { 
  Coffee, 
  Sun, 
  Smartphone, 
  UtensilsCrossed,
  Camera
} from 'lucide-react';

export const AESTHETICS: AestheticConfig[] = [
  {
    id: 'RUSTIC',
    label: 'Rustic & Dark',
    description: 'Moody, warm lighting, dark wood textures, cinematic.',
    promptSuffix: 'Professional food photography, rustic aesthetic, dark mood, rich wooden textures, warm cinematic lighting, highly detailed, 8k resolution, shallow depth of field, artisan plating.',
    iconName: 'Coffee'
  },
  {
    id: 'MODERN',
    label: 'Bright & Modern',
    description: 'Clean, airy, white marble, natural light, minimalist.',
    promptSuffix: 'Professional food photography, bright and modern aesthetic, white marble background, soft natural daylight, airy atmosphere, clean composition, minimalist elegance, 8k resolution, sharp focus.',
    iconName: 'Sun'
  },
  {
    id: 'SOCIAL',
    label: 'Social Media',
    description: 'Top-down flat lay, vibrant, high contrast, trendy.',
    promptSuffix: 'Professional food photography, social media flat lay style, direct top-down view, vibrant colors, trendy plating, instagram aesthetic, high contrast, pop colors, 8k resolution, perfectly lit.',
    iconName: 'Smartphone'
  }
];

export const SAMPLE_MENU = `Appetizers:
- Truffle Arancini: Crispy risotto balls infused with black truffle oil, served with garlic aioli.
- Burrata & Peach Salad: Fresh burrata cheese, grilled peaches, arugula, and balsamic glaze.

Main Courses:
- Pan-Seared Scallops: Jumbo scallops with cauliflower purée and crispy pancetta.
- Wild Mushroom Risotto: Arborio rice cooked with porcini mushrooms, parmesan, and fresh herbs.

Desserts:
- Dark Chocolate Fondant: Molten center chocolate cake with vanilla bean ice cream.`;
