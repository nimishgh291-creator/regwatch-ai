import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, summary } = await req.json();
    const TAVILY_API_KEY = Deno.env.get("TAVILY_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY is not configured");
    }
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Searching for news related to:", title);

    // Step 1: Search for news using Tavily
    const tavilyResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: `${title} India fintech regulation market impact news`,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5,
        include_domains: ["economictimes.com", "livemint.com", "moneycontrol.com", "businesstoday.in", "reuters.com", "bloomberg.com"],
      }),
    });

    if (!tavilyResponse.ok) {
      const errorText = await tavilyResponse.text();
      console.error("Tavily API error:", tavilyResponse.status, errorText);
      throw new Error(`Tavily search failed: ${tavilyResponse.status}`);
    }

    const tavilyData = await tavilyResponse.json();
    console.log("Tavily results:", tavilyData.results?.length || 0, "articles found");

    // Step 2: Summarize findings using Gemini via Lovable AI Gateway
    const newsContext = tavilyData.results
      ?.map((r: { title: string; content: string; url: string }) => 
        `Article: ${r.title}\nContent: ${r.content}\nSource: ${r.url}`
      )
      .join("\n\n---\n\n") || "No relevant news articles found.";

    const systemPrompt = `You are a financial market analyst specializing in Indian fintech regulations and their market impact.

Analyze the following regulatory update and related news articles to provide a market impact assessment.

Regulatory Update: ${title}
Summary: ${summary || "No summary provided"}

Related News Articles:
${newsContext}

Provide a structured analysis with:
1. Market Sentiment - How is the market reacting to this regulation?
2. Affected Sectors - Which fintech sectors are most impacted?
3. Stock Impact - Any notable stock movements or predictions
4. Industry Response - How are industry players responding?
5. Timeline & Outlook - Expected implementation timeline and future outlook

IMPORTANT FORMATTING RULES:
- Do NOT use markdown formatting like # headers, ** bold **, or * bullets *
- Write in plain text only with natural paragraphs
- Use numbered lists (1. 2. 3.) for structure
- Use dashes (-) for sub-points, but no asterisks
- Keep the analysis professional and data-driven`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please analyze the market impact of this regulatory update based on the news articles provided." },
        ],
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices?.[0]?.message?.content || "Unable to generate analysis.";

    // Return combined results
    return new Response(
      JSON.stringify({
        analysis,
        sources: tavilyData.results?.map((r: { title: string; url: string }) => ({
          title: r.title,
          url: r.url,
        })) || [],
        tavilyAnswer: tavilyData.answer || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("analyze-market-impact error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});