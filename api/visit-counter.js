import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let { data, error } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();

      if (error) throw error;

      const currentCount = data.count;

      const { data: updatedData, error: updateError } = await supabase
        .from("visit_counter")
        .update({ count: currentCount + 1 })
        .eq("id", 1);

      if (updateError) throw updateError;

      res.status(200).json({ visits: updatedData[0].count });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to retrieve or update visit count" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
