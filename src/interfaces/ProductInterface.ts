export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  mode: "view" | "edit" | "add" | null;
  onSave?: (newProduct: Product) => void;
}