import axios from 'axios'

const BASE = 'https://resume-portfolio-g2hy.onrender.com'
export async function parseResume(file, theme = "Modern UI") {
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('theme', theme)

    const response = await axios.post(
      `${BASE}/parse-resume`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      }
    )

    console.log("SUCCESS:", response.data)   // 👈 add this
    return response.data

  } catch (error) {
    console.log("ERROR FULL:", error)        // 👈 VERY IMPORTANT

    if (error.response) {
      console.log("Backend Error:", error.response.data)
    } else if (error.request) {
      console.log("No response received")
    } else {
      console.log("Axios setup error:", error.message)
    }

    throw error
  }
}