const { Client } = require("./lib/Typesense.js");

// Mock the axios module to simulate the Lambda response
const axios = require("axios");

// Create a simple test
async function testQueryInterceptor() {
  console.log("🧪 Testing Query Interceptor...\n");

  // Create a client instance
  const client = new Client({
    nodes: [
      {
        host: "localhost",
        port: 8108,
        protocol: "http",
      },
    ],
    apiKey: "test-api-key",
  });

  try {
    // Get the documents instance
    const documents = client.collections("test-collection").documents();

    // Test the interceptor directly
    console.log("📝 Testing interceptSearchQuery method...");
    const originalQuery = "head";
    console.log("Original query:", originalQuery);

    // Call the interceptor method directly
    const processedQuery = await documents.interceptSearchQuery(originalQuery);
    console.log("Processed query:", processedQuery);

    console.log("\n✅ Query interceptor test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Full error:", error);
  }
}

// Run the test
testQueryInterceptor();
