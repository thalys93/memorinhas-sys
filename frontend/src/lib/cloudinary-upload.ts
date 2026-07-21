import { storageService } from '@/services/storage.service';
import type { UploadTemplates } from '@/enums/upload-templates';

interface UploadToCloudinaryOptions {
  publicId: string;
  uploadPreset: UploadTemplates;
  displayName?: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
}

export function buildCloudinaryPublicId(name: string, id: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `${slug || 'user'}_${id}`;
}

async function uploadWithSignature(
  file: File,
  signature: Awaited<ReturnType<typeof storageService.getCloudinarySignature>>,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.api_key);
  formData.append('timestamp', String(signature.timestamp));
  formData.append('signature', signature.signature);
  formData.append('public_id', signature.public_id);
  formData.append('upload_preset', signature.upload_preset);
  if (signature.display_name) {
    formData.append('display_name', signature.display_name);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloud_name}/image/upload`,
    { method: 'POST', body: formData },
  );

  if (!response.ok) {
    throw new Error('Falha no upload da imagem');
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  return data.secure_url;
}

export async function uploadToCloudinary(
  file: File,
  { publicId, uploadPreset, displayName }: UploadToCloudinaryOptions,
): Promise<string> {
  const signature = await storageService.getCloudinarySignature(
    publicId,
    uploadPreset,
    displayName,
  );
  return uploadWithSignature(file, signature);
}

export async function uploadToCloudinaryPublic(
  file: File,
  publicId: string,
  displayName?: string,
): Promise<string> {
  const signature = await storageService.getPublicCloudinarySignature(
    publicId,
    displayName,
  );
  return uploadWithSignature(file, signature);
}
