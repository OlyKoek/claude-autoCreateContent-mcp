import axios, { AxiosInstance } from "axios";
import { DraftArticleInput, PublishArticleInput} from "../types";
import credentials from "../config/credentials";

const API_BASE_URL = "https://qiita.com/api/v2";


// Create an Axios instance with authentication
const qiitaClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${credentials.qiita.accessToken}`,
        "Content-Type": "application/json",
    },
});


//** Create a draft qiita article **/
export async function createDraftArticle(input: DraftArticleInput): Promise<{ draft_id: string; url: string }> {
    try {
        console.error(`[DEBUG] Creating draft article: ${JSON.stringify(input, null, 2)}`);
        
        const response = await qiitaClient.post("/items", {
            title: input.title,
            body: input.body,
            tags: input.tags?.map(tag => ({ name: tag })) || [],
            private: input.private,
        });
        
        console.error(`[DEBUG] Qiita API response: ${JSON.stringify(response.data, null, 2)}`);
        
        return {
            draft_id: response.data.id,
            url: response.data.url || `https://qiita.com/drafts/${response.data.id}`,
        };
    } catch (error: any) {
        console.error(`[ERROR] Failed to create draft article:`, error.response?.data || error.message);
        throw new Error(`記事作成に失敗しました: ${error.response?.data?.message || error.message}`);
    }
}

//** Publish an existing Qiita draft **/
export async function publishArticle(input: PublishArticleInput): Promise<{ article_url: string }> {
    try {
        console.error(`[DEBUG] Publishing article: ${input.article_id}`);
        
        // まず記事の現在の状態を取得
        const getResponse = await qiitaClient.get(`/items/${input.article_id}`);
        console.error(`[DEBUG] Current article data: ${JSON.stringify(getResponse.data, null, 2)}`);
        
        // 記事を公開するために必要なフィールドを含めて更新
        const updateData = {
            title: getResponse.data.title,
            body: getResponse.data.body,
            tags: getResponse.data.tags,
            private: false,
        };
        
        console.error(`[DEBUG] Update payload: ${JSON.stringify(updateData, null, 2)}`);
        
        const response = await qiitaClient.patch(`/items/${input.article_id}`, updateData);
        
        console.error(`[DEBUG] Publish API response: ${JSON.stringify(response.data, null, 2)}`);
        
        return {
            article_url: response.data.url || `https://qiita.com/${response.data.user.id}/items/${response.data.id}`,
        };
    } catch (error: any) {
        console.error(`[ERROR] Failed to publish article:`, error.response?.data || error.message);
        console.error(`[ERROR] Full error response:`, error.response?.status, error.response?.statusText);
        throw new Error(`記事公開に失敗しました: ${error.response?.data?.message || error.message}`);
    }
}

//** MCP tool definitions for Qiita operations **/
export const qiitaTools = [
  {
    name: 'create_qiita_draft',
    description: 'Qiitaに下書き記事を作成する',
    execute: createDraftArticle,
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        private: { type: 'boolean', default: false },
      },
      required: ['title', 'body'],
    },
  },
  {
    name: 'publish_qiita_article',
    description: 'Qiita下書きを公開する',
    execute: publishArticle,
    inputSchema: {
      type: 'object',
      properties: {
        article_id: { type: 'string' },
      },
      required: ['article_id'],
    },
  },
];