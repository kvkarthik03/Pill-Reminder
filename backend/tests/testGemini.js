require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGeminiAPI() {
    console.log("Testing Gemini API connection...");
    console.log("API Key (first 5 chars):", process.env.GEMINI_KEY_PERSONAL?.substring(0, 5));
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY_PERSONAL);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Attempting to generate content...");
        const result = await model.generateContent("Say hello world");
        const response = await result.response;
        const text = response.text();
        console.log("Response:", text);
        console.log("API test successful!");
        return true;
    } catch (error) {
        console.error("API Test Error:", error.message);
        console.error("Full error:", error);
        return false;
    }
}

testGeminiAPI();
