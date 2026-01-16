import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegulatoryUpdate {
  id: number;
  title: string;
  summary: string | null;
  risk_level: string | null;
  dev_action: string | null;
  source_url: string | null;
  category: string | null;
}

const getRiskColor = (riskLevel: string | null): string => {
  switch (riskLevel) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#eab308";
    case "low":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

const generateEmailHtml = (update: RegulatoryUpdate): string => {
  const riskColor = getRiskColor(update.risk_level);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RegWatch AI Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding: 30px 40px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 10px; text-align: center; vertical-align: middle;">
                    <span style="font-size: 20px;">🛡️</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: bold;">RegWatch AI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Alert Badge -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-top: 24px; padding-bottom: 16px;">
              <span style="display: inline-block; padding: 6px 16px; background-color: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 20px; color: #a5b4fc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                🔔 New Regulatory Alert
              </span>
            </td>
          </tr>
        </table>
        
        <!-- Title -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 16px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; line-height: 1.4;">
                ${update.title}
              </h1>
            </td>
          </tr>
        </table>
        
        <!-- Risk Level & Category -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 20px;">
              <span style="display: inline-block; padding: 4px 12px; background-color: ${riskColor}20; border: 1px solid ${riskColor}40; border-radius: 16px; color: ${riskColor}; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-right: 8px;">
                ${update.risk_level?.toUpperCase() || 'N/A'} RISK
              </span>
              ${update.category ? `
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255,255,255,0.1); border-radius: 16px; color: #9ca3af; font-size: 12px;">
                ${update.category}
              </span>
              ` : ''}
            </td>
          </tr>
        </table>
        
        <!-- Summary -->
        ${update.summary ? `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 20px; background-color: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 20px;">
              <p style="margin: 0; color: #d1d5db; font-size: 15px; line-height: 1.6;">
                ${update.summary}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}
        
        <!-- Dev Action -->
        ${update.dev_action ? `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; margin-top: 20px;">
              <p style="margin: 0 0 8px 0; color: #a5b4fc; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ⚡ Developer Action Required
              </p>
              <p style="margin: 0; color: #e5e7eb; font-size: 14px; line-height: 1.5;">
                ${update.dev_action}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}
        
        <!-- CTA Button -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-top: 28px; text-align: center;">
              <a href="https://regwatchai.lovable.app/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 10px; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);">
                View Full Details →
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center; line-height: 1.6;">
                You're receiving this because you subscribed to RegWatch AI regulatory alerts.
                <br>
                © 2025 RegWatch AI. Built by Nimish Kalsi.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const update: RegulatoryUpdate = await req.json();

    console.log("Sending notification for update:", update.title);

    // Fetch all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("subscribers")
      .select("email")
      .eq("is_active", true);

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found");
      return new Response(
        JSON.stringify({ message: "No active subscribers" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${subscribers.length} active subscribers`);

    const emailHtml = generateEmailHtml(update);
    const riskEmoji = update.risk_level === "high" ? "🚨" : update.risk_level === "medium" ? "⚠️" : "ℹ️";

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const results = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const batchEmails = batch.map((s) => s.email);

      try {
        const emailResponse = await resend.emails.send({
          from: "RegWatch AI <alerts@resend.dev>",
          to: batchEmails,
          subject: `${riskEmoji} ${update.title} - RegWatch AI Alert`,
          html: emailHtml,
        });

        console.log(`Batch ${i / batchSize + 1} sent successfully:`, emailResponse);
        results.push({ batch: i / batchSize + 1, status: "success", response: emailResponse });
      } catch (batchError) {
        console.error(`Batch ${i / batchSize + 1} failed:`, batchError);
        results.push({ batch: i / batchSize + 1, status: "error", error: batchError });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Notifications sent to ${subscribers.length} subscribers`,
        results 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
