export interface Banner {
  id: number;
  created_at: string;
  end_date: string | null;
  image_url: string;
  is_active: boolean;
  link_url: string | null;
  sort_order: number;
}

export interface BannerFilter {
  sort?: "asc" | "desc";
  is_active?: boolean;
}
