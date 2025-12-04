// // Follow this setup guide to integrate the Deno language server with your editor:
// // https://deno.land/manual/getting_started/setup_your_environment
// // This enables autocomplete, go to definition, etc.
// import OpenAI from "openai";
// import {createClient} from "@supabase/supabase-js"
// console.log("Hello from Functions!");


// // CORS headers helper
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// Deno.serve(async (req: Request) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }
  
//   try {
//     const supabaseUrl = Deno.env.get("SUPABASE_URL");
//     const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
//     const groqApiKey = Deno.env.get("GROQ_API_KEY");

//     if (!supabaseUrl || !supabaseKey) {
//       throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_KEY");
//     }
//     if (!groqApiKey) {
//       throw new Error("Missing required environment variable: GROQ_API_KEY");
//     }

//     const supabase = createClient(supabaseUrl, supabaseKey);
//     const client = new OpenAI({
//       baseURL: "https://api.groq.com/openai/v1",
//       apiKey: groqApiKey,
//     });

//     // Ask OpenAI to return structured JSON
//     const response = await client.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "user",
//           content: `
//             Create a unique multiple-choice trivia question about software engineering.
//             Do not repeat questions that have already been asked.
//             Return ONLY valid JSON in this structure:
//             {
//               "question": "string",
//               "options": ["A", "B", "C", "D"],
//               "correct_index": 0
//             }

//             Requirements:
//             - Do not repeat questions that have already been asked.
//             - "options" must contain exactly 4 strings
//             - "correct_index" must match the correct answer (0–3)
//             - Do NOT always set correct_index to 0; choose the correct one
//             - Output only JSON. No commentary. No markdown.
//             Make sure the topic varies each time:
//             - System design
//             - DevOps
//             - Algorithms
//             - Databases
//             - APIs
//             - Cloud engineering
//             - Security
//           `,
//         },
//       ],
//       temperature: 0.9,
//     });

       
     
//     const raw = response.choices[0]?.message?.content;

//     if (!raw) {
//       throw new Error("AI model returned no content");
//     }

//     //
//     // 5. Parse JSON safely
//     //
//     let questionJSON;
//     try {
//       questionJSON = JSON.parse(raw);
//     } catch (err) {
//       console.error("Invalid JSON from model:", raw);
//       throw new Error("AI returned invalid JSON");
//     }

//     //
//     // 6. Insert into DB
//     //
//     const { data, error } = await supabase
//       .from("questions")
//       .insert({
//         question: questionJSON.question,
//         options: questionJSON.options,
//         correct_index: questionJSON.correct_index,
//       })
//       .select()
//       .single();
//       console.log("db insert resulsssss", data)
//     if (error) {
//       console.error("DB insert error:", error);
//       throw new Error("Failed to save question to database");
//     }

//     //
//     // 7. Return inserted row
//     //
//     return new Response(
//       JSON.stringify({
//         ok: true,
//       }),
//       { 
//         headers: { 
//           "Content-Type": "application/json",
//           ...corsHeaders,
//         } 
//       }
//     );
//   } catch (err) {
//     console.error("Error generating question:", err);

//     return new Response(
//       JSON.stringify({
//         ok: false,
//         error: err instanceof Error ? err.message : String(err),
//       }),
//       {
//         status: 500,
//         headers: { 
//           "Content-Type": "application/json",
//           ...corsHeaders,
//         },
//       }
//     );
//   }
// });
//     // Extract the JSON string from the model output
// //     const questionJSON = JSON.parse(response.output_text);

// //     return new Response(
// //       JSON.stringify({
// //         ok: true,
// //         question: questionJSON,
// //       }),
// //       {
// //         headers: { "Content-Type": "application/json" },
// //       }
// //     );

// //   } catch (err: unknown) {
// //     console.error("Error generating question:", err);

// //     return new Response(
// //       JSON.stringify({
// //         ok: false,
// //         error: err instanceof Error ? err.message : String(err),
// //       }),
// //       {
// //         status: 500,
// //         headers: { "Content-Type": "application/json" },
// //       }
// //     );
// //   }
// // });

// /* To invoke locally:

//   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
//   2. Make an HTTP request:

//   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-new-question' \
//     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//     --header 'Content-Type: application/json' \
//     --data '{"name":"Functions"}'

// */
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const groqKey = Deno.env.get("GROQ_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      realtime: { params: { eventsPerSecond: 10 } },
    });

    const ai = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
    });

    // Generate question
    const completion = await ai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.9,
      messages: [
        {
          role: "user",
          content: `
            Create a unique multiple-choice trivia question about software engineering.
            Return ONLY valid JSON:
            {
              "question": "text",
              "options": ["A","B","C","D"],
              "correct_index": 0
            }
          `,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("AI model returned no content");
    }
    const q = JSON.parse(raw);

    // Insert into DB
    const { data, error } = await supabase
      .from("questions")
      .insert({
        question: q.question,
        options: q.options,
        correct_index: q.correct_index,
      })
      .select()
      .single();

    if (error) throw error;

    // Broadcast to all listeners
    await supabase.channel("trivia-room").send({
      type: "broadcast",
      event: "new-question",
      payload: data,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: `${err}` }),
      { status: 500, headers: cors }
    );
  }
});