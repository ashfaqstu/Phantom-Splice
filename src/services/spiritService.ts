import { BackendConfig } from "../types";

const mockSeverSpirit = async (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(file);
    }, 2000);
  });
};

const realSeverSpirit = async (file: File, url: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`The spirits refused: ${response.statusText}`);
  }

  return await response.blob();
};

export const severSpirit = async (file: File, config: BackendConfig): Promise<Blob> => {
  if (config.useMock) {
    return mockSeverSpirit(file);
  }
  return realSeverSpirit(file, config.serverUrl);
};
