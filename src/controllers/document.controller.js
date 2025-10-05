import ai from '../config/gemini.js';
import { fileToBase64, cleanupFile } from '../utils/fileHelper.js';

export const generateFromDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "Document file is required"
        });
    }

    try {
        // Ambil prompt dari request body
        const { prompt } = req.body;
        const base64Doc = fileToBase64(req.file.path);

        // Gunakan prompt dari user, atau gunakan default jika kosong
        const textPart = { text: prompt || "Please summarize this document briefly." };

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    parts: [
                        textPart, // <-- Gunakan prompt yang sudah dinamis
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: base64Doc
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
            message: 'Document processed successfully'
        });
    } catch (e) {
        console.error(e);
        cleanupFile(req.file.path);
        res.status(500).json({
            success: false,
            data: null,
            message: e.message || 'Error processing document'
        });
    }
};