export interface Article {
  id: number;
  title: string;
  content: string;
  publicationDate: string;
}

export type ArticleInput = Omit<Article, 'id'>;
