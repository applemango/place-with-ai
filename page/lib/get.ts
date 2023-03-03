import axios from "axios"

import { getUrl } from "./main"

export async function get_data() {
    try {
        const res = await axios.get(getUrl("get/data"))
        return res.data
    } catch (error) {
        console.error(error)
        return false
    }
}