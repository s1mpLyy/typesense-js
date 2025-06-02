const { Client } = require("./lib/Typesense.js");

// Test the Arabic query interceptor
async function testArabicQuery() {
  console.log("🧪 Testing Arabic Query Interceptor...\n");

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

    // Test the Arabic query
    console.log("📝 Testing Arabic query interceptor...");
    const arabicQuery = "شامبو ضد التساقط";
    console.log("Original Arabic query:", arabicQuery);

    // Call the interceptor method directly
    console.log("🚀 Calling interceptSearchQuery...");
    const processedQuery = await documents.interceptSearchQuery(arabicQuery);
    console.log("Processed query:", processedQuery);

    console.log("\n✅ Arabic query interceptor test completed!");
    console.log("📊 Results:");
    console.log("  - Original:", arabicQuery);
    console.log("  - Processed:", processedQuery);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Full error:", error);
  }
}

// Run the test
testArabicQuery();
