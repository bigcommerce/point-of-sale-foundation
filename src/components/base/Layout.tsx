import Head from "next/head";
import Navigation from "@/frontend/components/modules/Base/Navigation";
import EmployeeProvider from "@/frontend/providers/EmployeeProvider";
import ProductProvider from "@/frontend/providers/ProductProvider";

type LayoutProps = {
  employee: any;
  title: string;
  access_token: string;
  children: React.ReactElement;
};

const Layout = ({ title = "POS Foundation", employee, access_token, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="BigCommerce Point of Sale Foundation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-between w-full bg-gray-100">
        <div className="w-full">
          {employee && <Navigation employee={employee} />}
          <EmployeeProvider access_token={access_token}>
            <ProductProvider access_token={access_token}>{children}</ProductProvider>
          </EmployeeProvider>
        </div>
      </main>
    </>
  );
};

export default Layout;
