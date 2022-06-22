interface ChannelPayload {
    id?: number;
    name: string;
    type: "pos" | "marketplace" | "storefront" | "marketing";
    platform: string;
    status:
      | "active"
      | "prelaunch"
      | "inactive"
      | "connected"
      | "disconnected"
      | "archived";
    is_listable_from_ui: boolean;
    is_visible: boolean;
    is_enabled?: boolean;
    config_meta?: {
      app: {
        id: number;
        sections: Array<{
          title: string;
          query_path: string;
        }>;
      };
    };
  }
  
  interface ChannelUpdatePayload {
    name?: string;
    type?: "pos" | "marketplace" | "storefront" | "marketing";
    platform?: string;
    status?:
      | "active"
      | "prelaunch"
      | "inactive"
      | "connected"
      | "disconnected"
      | "archived";
    is_listable_from_ui?: boolean;
    is_visible?: boolean;
    is_enabled?: boolean;
    config_meta?: {
      app: {
        id: number;
        sections: Array<{
          title: string;
          query_path: string;
        }>;
      };
    };
  }
  