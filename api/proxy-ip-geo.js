export default async function handler(req, res) {
  if (req.method === "GET") {
    const { ip } = req.query;
    const apiKey = process.env.IPGEOLOCATION_API_KEY;

    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      res.status(500).json({ error: "Failed to fetch geolocation data" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
