export async function Json(req){
  const buffer = []

  for await (const chunk of req){
    buffer.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffer).toString())
  } catch {
    req.body = null
  }
}