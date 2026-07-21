import api from './api';
import type { UploadTemplates } from '@/enums/upload-templates';

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  public_id: string;
  api_key: string;
  cloud_name: string;
  upload_preset: string;
  display_name?: string;
}

export const storageService = {
  getCloudinarySignature: (
    id: string,
    uploadPreset: UploadTemplates,
    displayName?: string,
  ) =>
    api
      .get<CloudinarySignature>('/storage/cloudinary-signature', {
        params: { id, uploadPreset, displayName },
      })
      .then((r) => r.data),

  getPublicCloudinarySignature: (id: string, displayName?: string) =>
    api
      .get<CloudinarySignature>('/storage/cloudinary-signature/public', {
        params: { id, displayName },
      })
      .then((r) => r.data),
};
