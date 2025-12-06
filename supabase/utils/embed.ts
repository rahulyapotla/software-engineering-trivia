export async function embedQuestion(text: string) {
  const res = await fetch("https://embedding-service-an8koxm1q-rahulya-potlas-projects.vercel.app/api/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Vercel embedding API error:", err);
    throw new Error("embedding_failed");
  }

  const json = await res.json();

  if (!json.embedding) {
    console.error("Missing embedding:", json);
    throw new Error("embedding_failed");
  }
  return json.embedding; 
}