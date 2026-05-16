export async function POST(request) {
  return Response.json({ success: true, message: 'Message received' }, { status: 200 })
}