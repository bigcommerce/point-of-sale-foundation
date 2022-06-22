interface CreateCouponInput {
    name: string;
    type: string;
    amount: string;
    min_purchase?: string;
    expires?: string;
    enabled?: boolean;
    code: string;
    applies_to: { ids: string[]; entity: string };
    max_uses?: number;
    max_uses_per_customer?: number;
    // restricted_to: { countries: string }[];
    shipping_methods: string[];
  }
  