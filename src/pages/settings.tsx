import React from "react";
import { GetServerSideProps } from "next";
import withAuth, { withAuthServerSideProps } from "@/frontend/hocs/withAuth";
import GlobalProvider from "@/frontend/providers/GlobalProvider";
import SettingsProvider from "@/frontend/providers/SettingsProvider";
import SettingsView from "@/frontend/components/modules/Settings/SettingsView";

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(async context => {
  return {
    props: {}
  };
});

const SettingsPage = (props): JSX.Element => {
  return (
    <GlobalProvider>
      <SettingsProvider access_token={props.access_token}>
        <div className="flex justify-between h-14 w-screen mb-0.5 bg-gray-50 shadow">
          <div className="font-bold px-5 py-4">
            <div className="flex text-gray-700 pl-10"></div>
          </div>
        </div>
        <SettingsView />
      </SettingsProvider>
    </GlobalProvider>
  );
};

export default withAuth(SettingsPage);
