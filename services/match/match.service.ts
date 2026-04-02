import { api } from "../axios";

export class MatchService {
  static async getMatches(date?: string) {
    const url = date ? `/matches?date=${date}` : `/matches`;
    const response = await api.get(url);
    return response.data.data; // The array of matches from NestJS
  }
}