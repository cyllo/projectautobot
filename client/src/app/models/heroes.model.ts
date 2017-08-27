export interface Heroes {
  id: number;
  name: string;
  code: string;
}

export interface HeroesSearchResponse {
  heroes: Heroes[];
  loading: boolean;
}
