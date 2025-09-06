
export interface Design {
  id: string;
  name: string;
  description: string;
  materials: string;
  image: string; // Base64 encoded image string
  imageMimeType: string;
  pitch?: string; // Optional AI-generated pitch
}
