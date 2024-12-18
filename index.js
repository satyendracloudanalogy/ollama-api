const express = require("express");
const axios = require("axios"); // To make API requests to Ollama
const app = express();

app.use(express.json());

const MODEL_ENDPOINT = "http://localhost:11434/api/chat";

// Your custom model name
const MODEL_NAME = "lets-learn";

async function getModelResponse(prompt) {
  try {
    const response = await axios.post(MODEL_ENDPOINT, {
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
    });

    // If the model gives a response, return it
    const dataChunks = response.data.split("\n");
    let finalResponse = "";
    dataChunks.forEach((chunk) => {
      if(chunk.trim()){
        try{
          const parsedChunk = JSON.parse(chunk);
          if (parsedChunk?.message?.content) {
            finalResponse += parsedChunk?.message?.content;
          }
        }catch(err){
          console.error("Failed to parse chunk:", err);
        }
      }
    });
    console.log("finalResponse-->",finalResponse);
    
    return finalResponse.trim() || "No response from model"; 
  } catch (error) {
    // In case of error or if model doesn't return a valid response, return fallback
    console.error("Error querying model:", error);
    return "Prompt does not exist";
  }
}

// Route to query the model with a prompt
// app.post("/query", async (req, res) => {
//   const { prompt } = req.body; // Expecting the prompt in the request body

//   if (!prompt) {
//     return res.status(400).json({ error: "No prompt provided" });
//   }

//   const modelResponse = await getModelResponse(prompt);
//   // console.log("modelResponse-->", modelResponse);
//   res.json({ response: modelResponse });
// });


module.exports = getModelResponse

// Start server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
