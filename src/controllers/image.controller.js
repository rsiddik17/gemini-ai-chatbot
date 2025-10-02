import ai from '../config/gemini.js';
import { fileToBase64, cleanupFile } from '../utils/fileHelper.js';

export const generateFromImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Image file is required"
    });
  }

  try {
    const base64Image = fileToBase64(req.file.path);

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            { text: "Please describe this image in detail." },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    // cleanup file
    cleanupFile(req.file.path);

    res.status(200).json({
      success: true,
      data: aiResponse.text,
      message: 'Image processed successfully'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || 'Error processing image'
    });
  }
};