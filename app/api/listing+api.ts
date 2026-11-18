export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 10;

  const api = "https://api.coinpaprika.com/v1/tickers";

  const response = await fetch(`${api}`);

  const res = await response.json();
  return Response.json(res.slice(0, limit));
}
