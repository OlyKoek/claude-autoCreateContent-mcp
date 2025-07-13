export interface DraftArticleInput {
    title: string;
    body: string;
    tags?: string[];
    private?: boolean;
}