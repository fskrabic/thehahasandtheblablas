import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Fetch the current count
      const { data, error: fetchError } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();

      if (fetchError && fetchError.code === "PGRST116") {
        console.log("Row not found, creating a new entry...");

        // Insert the row if not found
        const { error: insertError } = await supabase
          .from("visit_counter")
          .insert([{ id: 1, count: 0 }]);

        if (insertError) throw insertError;

        return res.status(201).json({ visits: 0 });
      }

      if (fetchError) {
        throw fetchError;
      }

      const currentCount = data.count;

      // Update the visit count
      const { error: updateError } = await supabase
        .from("visit_counter")
        .update({ count: currentCount + 1 })
        .eq("id", 1);

      if (updateError) throw updateError;

      // Return the updated count
      res.status(200).json({ visits: currentCount + 1 });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update visit count" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
