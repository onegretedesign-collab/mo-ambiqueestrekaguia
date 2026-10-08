export interface ParsedDriveUrl {
  id: string;
  isFolder: boolean;
  previewUrl: string;
  downloadUrl: string;
  viewUrl: string;
}

export function parseDriveUrl(url: string): ParsedDriveUrl | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Match folder URLs: /folders/ID
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    const id = folderMatch[1];
    return {
      id,
      isFolder: true,
      previewUrl: `https://drive.google.com/drive/folders/${id}`,
      downloadUrl: `https://drive.google.com/drive/folders/${id}`,
      viewUrl: `https://drive.google.com/drive/folders/${id}`
    };
  }

  // Match files: /file/d/ID, /document/d/ID, /spreadsheets/d/ID, /presentation/d/ID, or ?id=ID
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const docMatch = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  const sheetMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  const presMatch = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  const id = fileMatch?.[1] || docMatch?.[1] || sheetMatch?.[1] || presMatch?.[1] || queryMatch?.[1];
  if (!id) return null;

  return {
    id,
    isFolder: false,
    previewUrl: `https://drive.google.com/file/d/${id}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
    viewUrl: `https://drive.google.com/file/d/${id}/view?usp=sharing`
  };
}

export function isDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
