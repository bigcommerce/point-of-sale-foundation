import { CustomerAddresses } from "./customer-addresses";

interface Customer {
  id?: number;
  last_name: string;
  first_name: string;
  email: string;
  addresses: CustomerAdresses
}

