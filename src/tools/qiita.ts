import axios, { AxiosInstance } from "axios";
import { DraftArticleInput } from "../types/index.js";
import credentials from "../config/credentials.js";

const API_BASE_URL = "https://qiita.com/api/v2";

// Create an Axios instance with authentication
const qiitaClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${credentials.qiita.accessToken}`,
        "Content-Type": "application/json",
    },
});

//** Create a Qiita article **/
export async function createDraftArticle(input: DraftArticleInput): Promise<{ draft_id: string; url: string }> {
    try {
        console.error(`[DEBUG] Creating article: ${JSON.stringify(input, null, 2)}`);
        
        const response = await qiitaClient.post("/items", {
            title: input.title,
            body: input.body,
            tags: input.tags?.map(tag => ({ name: tag })) || [],
            private: input.private !== undefined ? input.private : true, // デフォルトで非公開
        });
        
        console.error(`[DEBUG] Qiita API response: ${JSON.stringify(response.data, null, 2)}`);
        
        return {
            draft_id: response.data.id,
            url: response.data.url || `https://qiita.com/drafts/${response.data.id}`,
        };
    } catch (error: any) {
        console.error(`[ERROR] Failed to create article:`, error.response?.data || error.message);
        throw new Error(`記事作成に失敗しました: ${error.response?.data?.message || error.message}`);
    }
}

//** MCP tool definitions for Qiita operations **/
export const qiitaTools = [
  {
    name: 'create_qiita_article',
    description: 'Qiita記事を作成する（private: trueで非公開記事として作成）',
    execute: createDraftArticle,
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        private: { type: 'boolean', default: true },
      },
      required: ['title', 'body'],
    },
  },
];