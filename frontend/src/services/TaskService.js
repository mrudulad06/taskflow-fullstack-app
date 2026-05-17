import axios from "axios";

const API_URL = "http://localhost:8080/tasks";

export const getTasks = async () => {
    return await axios.get(API_URL);
};