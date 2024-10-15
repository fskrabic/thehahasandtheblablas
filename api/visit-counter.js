import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error: fetchError } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();

      console.log("Data from Supabase:", data);
      console.log("Fetch error (if any):", fetchError);

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        return res.status(404).json({ error: "Visit count not found" });
      }

      const currentCount = data.count;

      const { error: updateError } = await supabase
        .from("visit_counter")
        .update({ count: currentCount + 1 })
        .eq("id", 1);

      if (updateError) {
        throw updateError;
      }

      res.status(200).json({ visits: currentCount + 1 });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update visit count" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
