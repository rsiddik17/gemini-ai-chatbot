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
        // Ambil prompt dari request body, yang dikirim bersama file
        const { prompt } = req.body;
        const base64Image = fileToBase64(req.file.path);

        // Gunakan prompt dari user, atau gunakan default jika kosong
        const textPart = { text: prompt || "Please describe this image in detail." };

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    parts: [
                        textPart, // <-- Gunakan prompt yang sudah dinamis
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

        cleanupFile(req.file.path);

        res.status(200).json({
            success: true,
            data: aiResponse.text,
            message: 'Image processed successfully'
        });
    } catch (e) {
        console.error(e);
        cleanupFile(req.file.path); // Pastikan file dihapus bahkan saat error
        res.status(500).json({
            success: false,
            data: null,
            message: e.message || 'Error processing image'
        });
    }
};