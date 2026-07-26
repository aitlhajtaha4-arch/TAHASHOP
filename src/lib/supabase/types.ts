export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: number;
          name: string;
          logo: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          logo?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          brand: string;
          price: number;
          original_price: number | null;
          image: string;
          rating: number;
          review_count: number;
          badge: string | null;
          storage: string;
          ram: string;
          camera: string;
          battery: string;
          screen_size: string;
          processor: string;
          colors: string[];
          category: string;
          condition: "جديد" | "مستعمل" | "مجدد";
          free_shipping: boolean;
          available: boolean;
          monthly_payment: number | null;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          brand: string;
          price: number;
          original_price?: number | null;
          image?: string;
          rating?: number;
          review_count?: number;
          badge?: string | null;
          storage?: string;
          ram?: string;
          camera?: string;
          battery?: string;
          screen_size?: string;
          processor?: string;
          colors?: string[];
          category?: string;
          condition?: "جديد" | "مستعمل" | "مجدد";
          free_shipping?: boolean;
          available?: boolean;
          monthly_payment?: number | null;
          description?: string;
          created_at?: string;
        };
      };
      flash_deals: {
        Row: {
          id: number;
          name: string;
          brand: string;
          price: number;
          original_price: number;
          image: string;
          discount: number;
          ends_at: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          brand: string;
          price: number;
          original_price: number;
          image?: string;
          discount?: number;
          ends_at: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: number;
          name: string;
          rating: number;
          content: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: number;
          name: string;
          rating: number;
          content?: string;
          date?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          city: string;
          address: string;
          postal_code: string;
          payment_method: string;
          delivery_option: string;
          notes: string | null;
          status: string;
          total: number;
          discount: number;
          shipping: number;
          vat: number;
          items: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          city: string;
          address: string;
          postal_code: string;
          payment_method?: string;
          delivery_option?: string;
          notes?: string | null;
          status?: string;
          total: number;
          discount?: number;
          shipping?: number;
          vat?: number;
          items?: unknown;
          created_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
      };
    };
  };
};
