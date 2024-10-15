import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function getOrdinalSuffix(number) {
  const remainderOfTen = number % 10;
  const remainderOfHundred = number % 100;

  if (remainderOfHundred >= 11 && remainderOfHundred <= 13) {
    return `${number}th`;
  }

  switch (remainderOfTen) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error: fetchError } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();

      if (fetchError && fetchError.code === "PGRST116") {
        console.log("Row not found, creating a new entry...");

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

      const { error: updateError } = await supabase
        .from("visit_counter")
        .update({ count: currentCount + 1 })
        .eq("id", 1);

      if (updateError) throw updateError;

      const updated = currentCount + 1;
      res.status(200).json({ visits: getOrdinalSuffix(updated) });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update visit count" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
