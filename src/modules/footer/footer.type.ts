export interface FooterTitle {
  id: string;
  key: string;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}

export interface FooterItem {
  id: string;
  footer_title_id: string;
  name: string;
  reference: string;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
}
