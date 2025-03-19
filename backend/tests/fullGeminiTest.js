require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function runTests() {
  console.log("========================================");
  console.log("GEMINI API INTEGRATION TEST");
  console.log("========================================");

  // Test 1: Check environment variable
  console.log("\n📋 TEST 1: Checking environment variables...");
  if (!process.env.GEMINI_KEY_PERSONAL) {
    console.error("❌ GEMINI_KEY_PERSONAL is not defined in environment variables!");
    process.exit(1);
  }

  const partialKey = process.env.GEMINI_KEY_PERSONAL.substring(0, 5) + "...";
  console.log(`✅ GEMINI_KEY_PERSONAL is defined! Key starts with: ${partialKey}`);

  // Test 2: Initialize Google Generative AI client
  console.log("\n📋 TEST 2: Initializing Google Generative AI client...");
  let genAI;
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY_PERSONAL);
    console.log("✅ Google Generative AI client initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize Google Generative AI client:", error.stack || error);
    process.exit(1);
  }

  // Test 3: Generate basic content
  console.log("\n📋 TEST 3: Testing basic content generation...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("- Using model: gemini-2.0");
    
    const result = await model.generateContent("Say hello world");
    const text = result.text();
    
    console.log("\n✅ Received response:");
    console.log("---------------------------------------");
    console.log(text);
    console.log("---------------------------------------");
  } catch (error) {
    console.error("❌ Content generation failed:", error.stack || error);
    process.exit(1);
  }

  // Test 4: Medical chat functionality
  console.log("\n📋 TEST 4: Testing medical chat functionality...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a helpful and concise medical assistant. 
      Context: Current medications: Aspirin (100mg), Lisinopril (10mg). 
      User question: What are possible interactions between my medications?`;

    console.log("- Sending medical chat prompt...");
    
    const result = await model.generateContent(prompt);
    const text = result.text();
    
    console.log("\n✅ Received medical chat response:");
    console.log("---------------------------------------");
    console.log(text);
    console.log("---------------------------------------");
    
    console.log("\n🎉 All tests passed successfully! Your Gemini API integration is working.");
  } catch (error) {
    console.error("❌ Medical chat test failed:", error.stack || error);
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error("❌ Unhandled error during tests:", error.stack || error);
  process.exit(1);
});
