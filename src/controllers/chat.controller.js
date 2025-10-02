import ai from '../config/gemini.js';

export const chatController = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      message: "prompt must be filled in and is a string",
      data: null,
      success: false
    });
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }]
    });

    res.status(200).json({
      success: true,
      data: aiResponse.text,
      message: 'successfully responded to by Google Gemini'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || 'there is a problem on the server'
    });
  }
};
