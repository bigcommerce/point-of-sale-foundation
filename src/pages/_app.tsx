import "reflect-metadata";
import "../styles/globals.css";
import type { AppProps } from "next/app";

import Layout from "@/frontend/components/base/Layout";

function MyApp({ Component, pageProps }): React.ReactElement {
  return (
    <Layout
      employee={pageProps.employee}
      access_token={pageProps.access_token}
      title={"POS Foundation"}
    >
      <Component {...pageProps} />
    </Layout>
  );
}
export default MyApp;
