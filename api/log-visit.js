import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.connection.remoteAddress;
};

async function getGeolocation(ip) {
  const apiKey = process.env.IPGEOLOCATION_API_KEY;
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.city && data.country_name) {
      return { city: data.city, country: data.country_name };
    }

    return null;
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const ip = getIp(req);
      const location = await getGeolocation(ip);
      const { userAgent, referrer, pagePath } = req.body;
      const { error } = await supabase.from("page_visits").insert([
        {
          user_agent: userAgent,
          referrer: referrer || null,
          page_path: pagePath,
          city: location ? location.city : null,
          country: location ? location.country : null,
        },
      ]);

      if (error) {
        throw error;
      }
      res.status(200).json({ message: "Visit logged successfully" });
    } catch (error) {
      console.error("Error logging visit:", error);
      res.status(500).json({ error: "Failed to log visit" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
