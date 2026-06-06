// test-ollama.js

async function test() {
  const response = await fetch(
    "http://localhost:11434/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model: "qwen3:4b",
        prompt: "Create a JSON wireflow for a todo app",
        stream: false
      })
    }
  );

  const data = await response.json();

  console.log(data.response);
}

test();
