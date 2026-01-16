import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const generateUnsubscribeHtml = (success: boolean, email: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RegWatch AI - Unsubscribe</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: rgba(26, 26, 46, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
    }
    .icon.success {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
      border: 2px solid rgba(34, 197, 94, 0.3);
    }
    .icon.error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
      border: 2px solid rgba(239, 68, 68, 0.3);
    }
    h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    p {
      color: #9ca3af;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .email {
      color: #a5b4fc;
      font-weight: 500;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon ${success ? 'success' : 'error'}">
      ${success ? '✓' : '✗'}
    </div>
    <h1>${success ? 'Successfully Unsubscribed' : 'Unsubscribe Failed'}</h1>
    <p>
      ${success 
        ? `You've been unsubscribed from RegWatch AI alerts. <span class="email">${email}</span> will no longer receive notifications.`
        : 'We couldn\'t process your unsubscribe request. The link may be invalid or expired.'
      }
    </p>
    <a href="https://regwatchai.lovable.app" class="button">
      ${success ? 'Return to RegWatch AI' : 'Try Again'}
    </a>
    <div class="footer">
      © 2026 RegWatch AI. Built by Nimish Kalsi.
    </div>
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");

    if (!email) {
      return new Response(generateUnsubscribeHtml(false, ""), {
        status: 400,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    // Validate token (simple base64 encoded email verification)
    const expectedToken = btoa(email).replace(/[^a-zA-Z0-9]/g, "");
    if (token !== expectedToken) {
      console.error("Invalid unsubscribe token for email:", email);
      return new Response(generateUnsubscribeHtml(false, email), {
        status: 400,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update subscriber to inactive
    const { error } = await supabase
      .from("subscribers")
      .update({ is_active: false })
      .eq("email", email.toLowerCase());

    if (error) {
      console.error("Error unsubscribing:", error);
      return new Response(generateUnsubscribeHtml(false, email), {
        status: 500,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    console.log("Successfully unsubscribed:", email);

    return new Response(generateUnsubscribeHtml(true, email), {
      status: 200,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in unsubscribe function:", error);
    return new Response(generateUnsubscribeHtml(false, ""), {
      status: 500,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  }
};

serve(handler);
