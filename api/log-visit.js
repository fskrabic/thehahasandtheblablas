import { createClient } from "@supabase/supabase-js";
import { fetch } from "node-fetch";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get the visitor's IP address
const getIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.connection.remoteAddress;
};

// Function to fetch geolocation from IP using IP Geolocation API
async function getGeolocation(ip) {
  const apiKey = process.env.IPGEOLOCATION_API_KEY; // Your IP Geolocation API key
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.city && data.country_name) {
      return { city: data.city, country: data.country_name };
    }

    return null; // If no valid location found
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Get the visitor's IP address
      const ip = getIp(req);

      // Fetch geolocation data based on the IP address
      const location = await getGeolocation(ip);

      // Destructure body to get user agent, referrer, and page path
      const { userAgent, referrer, pagePath } = req.body;

      // Insert visit data into Supabase database
      const { error } = await supabase.from("page_visits").insert([
        {
          user_agent: userAgent,
          referrer: referrer || null, // Default to null if referrer is empty
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
