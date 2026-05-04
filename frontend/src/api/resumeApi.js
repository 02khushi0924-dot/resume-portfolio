import axios from 'axios'

const BASE = '/api'

export async function parseResume(file, theme = "Modern UI") {
  const form = new FormData()
  form.append('file', file)
  form.append('theme', theme)
  const { data } = await axios.post(`${BASE}/parse-resume`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  return data
}
