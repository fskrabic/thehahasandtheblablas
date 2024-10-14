import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

      const { data, error } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching visit count:", error);
        throw error;
      }

      const currentCount = data.count;

      const { data: updatedData, error: updateError } = await supabase
        .from("visit_counter")
        .update({ count: currentCount + 1 })
        .eq("id", 1);

      if (updateError) {
        console.error("Error updating visit count:", updateError);
        throw updateError;
      }

      res.status(200).json({ visits: updatedData[0].count });
    } catch (error) {
      console.error("Unexpected server error:", error);
      res.status(500).json({
        error: "Server Error: Failed to retrieve or update visit count",
      });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
