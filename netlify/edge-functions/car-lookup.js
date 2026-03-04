export default async (request, context) => {
  const url = new URL(request.url);
  const plate = url.searchParams.get('plate');

  if (!plate) {
    return new Response('Mangler nummerplade', { status: 400 });
  }

  const apiKey = Netlify.env.get('MOTORAPI_KEY');
  const res = await fetch(
    `https://api.motorapi.dk/vehicles/${plate}`,
    { headers: { 'X-Api-Key': apiKey } }
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
});
};

export const config = { path: '/api/car-lookup' };
