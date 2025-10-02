import fs from 'fs';

export const fileToBase64 = (filePath) => {
  const file = fs.readFileSync(filePath);
  return file.toString('base64');
};

// delete setelah dipakai
export const cleanupFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};
