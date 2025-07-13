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
    const response = await qiitaClient.post("/items", {
        title: input.title,
        body: input.body,
        tags: input.tags?.map(tag => ({ name: tag })) || [],
        private: input.private,
    });
    return {
        draft_id: response.data.id,
        url: response.data.rendered_body
          ? `https://qiita.com/drafts/${response.data.id}`
          : `https://qiita.com/${response.data.user.id}/items/${response.data.id}`,
    };
}

//** Publish an existing Qiita draft **/
export async function publishArticle(input: PublishArticleInput): Promise<{ article_url: string }> {
  const response = await qiitaClient.patch(`/items/${input.article_id}`, {
    private: false,
  });
  return {
    article_url: `https://qiita.com/${response.data.user.id}/items/${response.data.id}`,
  };
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