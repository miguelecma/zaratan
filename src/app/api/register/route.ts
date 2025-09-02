export async function POST(request: Request) {
  const data = await request.json();

  await fetch("https://firstqstashmessage.requestcatcher.com/test", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Response.json({ success: true });
}

