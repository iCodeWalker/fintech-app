export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "btc-bitcoin";
  const days = Number(url.searchParams.get("days")) || 30;

  // Calculate start date (e.g. 30 days ago)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const start = startDate.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"

  const response = await fetch(
    `https://api.coinpaprika.com/v1/tickers/${id}/historical?start=${start}&interval=1d`,
  );

  if (!response.ok) {
    return Response.json(
      { error: "Failed to fetch historical data" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return Response.json(data);
}
