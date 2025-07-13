
export interface DraftArticleInput {
    title: string;
    body: string;
    tags?: string[];
    private?: boolean;
}

export interface PublishArticleInput {
  article_id: string;
}

export interface MCPRequest<T> {
    name: string;
    args: T;
}

export interface MCPResponse<R> {
    name: string;
    result: R;
}