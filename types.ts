export type ImageResolution = '1K' | '2K' | '4K';

export type PhotoStyle = 'Rustic/Dark' | 'Bright/Modern' | 'Social Media';

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  style: PhotoStyle;
  resolution: ImageResolution;
  createdAt: number;
}

export interface GenerationRequest {
  dishDescription: string;
  style: PhotoStyle;
  resolution: ImageResolution;
}
