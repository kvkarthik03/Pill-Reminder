const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_KEY_PERSONAL) {
    throw new Error("GEMINI_KEY_PERSONAL is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY_PERSONAL);

const chatResponse = async (req, res) => {
    try {
        const { message, prescriptions, isFirstMessage } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: "Message is required",
                success: false 
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `You are a helpful and concise medical assistant. Follow these rules:

1. Keep responses short and focused (2-3 paragraphs max)
2. Use simple, clear language
3. Format information in easy-to-read chunks
4. Include safety warnings only when critical
${isFirstMessage ? '5. Add this disclaimer at the end: "Note: This is for informational purposes only. Consult a healthcare provider for medical advice."' : ''}

${prescriptions?.length > 0 
    ? `Context: Current medications: ${prescriptions.map(p => 
        p.medicines.map(m => `${m.drugName} (${m.dosage})`).join(", ")
      ).join("; ")}. ` 
    : ""}

User question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.json({ 
            response: text,
            success: true
        });
    } catch (error) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({ 
            error: "Error processing query", 
            details: error.message,
            success: false
        });
    }
};

module.exports = { chatResponse };
