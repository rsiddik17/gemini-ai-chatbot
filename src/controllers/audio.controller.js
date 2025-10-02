import ai from '../config/gemini.js';
import { fileToBase64, cleanupFile } from '../utils/fileHelper.js';

export const generateFromAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Audio file is required"
    });
  }

  try {
    const base64Audio = fileToBase64(req.file.path);

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            { text: "Please transcribe this audio into text." },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Audio
              }
            }
          ]
        }
      ]
    });

    cleanupFile(req.file.path);

    res.status(200).json({
      success: true,
      data: aiResponse.text,
      message: 'Audio processed successfully'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || 'Error processing audio'
    });
  }
};