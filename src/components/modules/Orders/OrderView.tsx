import { useOrderContext } from "@/frontend/providers/OrderProvider";
import React, { useEffect } from "react";
import Table from "@/frontend/components/base/Table";
import ReactCountryFlag from "react-country-flag";
import { getColorFromStatus } from "@/frontend/utils/constants";

const columns = [
  {
    field: "date_created",
    headerName: "Date",
    type: "date",
    sorting: true
  },
  {
    field: "id",
    headerName: "Order ID",
    sorting: true
  },
  {
    field: "customer",
    headerName: "Customer",
    sorting: true,
    renderRow: rowData => {
      const customer = `${rowData.billing_address.first_name} ${rowData.billing_address.last_name}`;
      return (
        <div className="inline-flex items-center">
          <ReactCountryFlag
            className="mr-2"
            countryCode={rowData.geoip_country_iso2 ? rowData.geoip_country_iso2 : "us"}
            svg
          />
          {customer}
        </div>
      );
    }
  },
  {
    field: "status",
    headerName: "Status",
    sorting: true,
    renderRow: rowData => (
      <div className="inline-flex items-center">
        <div
          className="w-4 h-8 mr-2"
          style={{ backgroundColor: getColorFromStatus(rowData.status) }}
        />
        {rowData.status}
      </div>
    )
  },
  {
    field: "total_ex_tax",
    headerName: "Total",
    sorting: true,
    renderRow: rowData => {
      return new Intl.NumberFormat(rowData.geoip_country_iso2 ? rowData.geoip_country_iso2 : "us", {
        style: "currency",
        currency: rowData.currency_code ? rowData.currency_code : "USD",
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: 6
      }).format(rowData.total_ex_tax);
    }
  }
];

export default function OrderView() {
  const { state, actions } = useOrderContext();

  useEffect(() => {
    actions.getOrders();
  }, []);

  return (
    <div className="mx-12 mt-18">
      <Table columns={columns} dataSource={state.orders} loading={state.loaders.getOrders} />
    </div>
  );
}
