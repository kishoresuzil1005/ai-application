async function askOllama(
  systemPrompt,
  userPrompt,
  model = "qwen3:4b"
) {
  const prompt = `
${systemPrompt}

${userPrompt}
`;

  const response = await fetch(
    "http://localhost:11434/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ollama Error: ${response.status}`
    );
  }

  const data =
    await response.json();

  return data.response;
}

module.exports = {
  askOllama
};
