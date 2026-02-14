import axios from "axios"

const BASE_URL = "https://api.foodoscope.com"

export const getSimilarEntities = async (ingredient) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/flavordb/food/by-alias`,
      {
        params: { food_pair: ingredient },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FOODOSCOPE_API_KEY}`
        }
      }
    )

    return response.data
  } catch (error) {
    console.error("FlavorDB error:", error.response?.data || error.message)
    throw error
  }
}
