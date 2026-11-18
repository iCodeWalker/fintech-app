export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const api = "https://api.coinpaprika.com/v1/coins";

  const response = await fetch(`${api}/${id}`);

  const res = await response.json();
  return Response.json(res);
}
