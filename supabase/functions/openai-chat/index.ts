import { serve } from "https://deno.land/std/http/server.ts";
const today = new Date().toISOString().split("T")[0];
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { message , categories} = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
 const prompt = `
Bạn là hệ thống AI phân tích giao dịch tài chính cá nhân.

NHIỆM VỤ:
Trích xuất thông tin giao dịch từ câu người dùng.

QUY TẮC QUAN TRỌNG:
- CHỈ trả về JSON hợp lệ
- KHÔNG giải thích
- KHÔNG markdown
- KHÔNG thêm text bên ngoài JSON

FORMAT OUTPUT (bắt buộc đúng):
{
  "amount": number,
  "type": "income" | "expense",
  "category_id": string,
  "note": string | null,
  "transaction_date": "YYYY-MM-DD"
}

DANH MỤC HỢP LỆ (chỉ được chọn trong danh sách này):
${JSON.stringify(categories)}

QUY TẮC CATEGORY:
- Chỉ được chọn category_id từ danh sách trên
- Nếu không xác định được → dùng category có name = "khác"

QUY TẮC NGÀY:
- "hôm nay" = ${today}
- "hôm qua" = ngày hôm trước
- nếu không có ngày → mặc định ${today}

INPUT:
${message}
`;
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),



      }
    );

    const data = await geminiRes.json();

    return new Response(
      JSON.stringify({
        result:
          data.candidates?.[0]?.content?.parts?.[0]?.text,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: String(err),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});