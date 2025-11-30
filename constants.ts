import { PhotoStyle } from "./types";

export const STYLE_PROMPTS: Record<PhotoStyle, string> = {
  'Rustic/Dark': 'rustic, moody lighting, dark wood background, warm tones, artisan plating, dramatic shadows, cinematic, 85mm lens',
  'Bright/Modern': 'bright, high key lighting, white marble background, clean minimalistic plating, sharp focus, airy, commercial photography, 50mm lens',
  'Social Media': 'top-down flat lay, vibrant colors, high contrast, trendy plating, soft natural lighting, instagram aesthetic, shot on iPhone 15 Pro Max style'
};

export const MODEL_GENERATION = 'gemini-3-pro-image-preview';
export const MODEL_EDITING = 'gemini-2.5-flash-image';
