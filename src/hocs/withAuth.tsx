import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { RoleType } from "@/shared/enums/RoleType";
import { setCookie } from "nookies";

const config = {
  defaultPath: "/",
  signinPath: "/signin",
  firstTimePath: "/register",
  defaultRolesPath: {
    [RoleType.Admin]: "/employees",
    [RoleType.Manager]: "/register",
    [RoleType.Cashier]: "/register"
  },
  restrictedPaths: {
    "/setup": [RoleType.Admin, RoleType.Manager, RoleType.Cashier],
    "/register": [RoleType.Admin, RoleType.Manager, RoleType.Cashier],
    "/employees": [RoleType.Admin, RoleType.Manager],
    "/settings": [RoleType.Admin, RoleType.Manager, RoleType.Cashier]
  }
};

const getEmployee = async ({ access_token }) => {
  try {
    const res = await fetch("/api/employees/current", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    if (res.status !== 200) {
      return null;
    }
    const employee = await res.json();
    return employee;
  } catch (e) {
    return null;
  }
};

export const getRedirectPath = ({ employee, first_time, pathname }) => {
  if (!employee) {
    // if employee object does not exist, we assume there is no valid session
    return config.signinPath;
  } else if (first_time && !pathname.includes(config.firstTimePath)) {
    // If we have got here, then employee object exists, check if first timer and check if they are on the right path
    return config.firstTimePath;
  } else if (pathname.includes(config.signinPath)) {
    // We assume employee object exists, if they are on the signin path, redirect them to their default path
    return (employee.roleId && config.defaultRolesPath[employee.roleId]) || config.defaultPath;
  } else if (config.restrictedPaths[pathname]) {
    // The current path have a restrictedPaths config, check if employee is allowed here
    if (!employee.roleId || !config.restrictedPaths[pathname].includes(employee.roleId)) {
      // If employee doesn't have a roleId or if the roleId is not allowed in the given path redirect to defaultPath
      return (employee.roleId && config.defaultRolesPath[employee.roleId]) || config.defaultPath;
    }
  }
  return false;
};

// Needed to do this for processing hmr paths
const nextHmrPathExtract = /^\/_next\/data\/[a-zA-Z0-9]+(\/[a-zA-Z0-9_\-\/]+)\.json$/;
const handleHmrPath = pathname => {
  const matches = pathname.match(nextHmrPathExtract);
  if (matches && matches.length) {
    return matches[1];
  }
  return null;
};

// Server side redirects using getServerSideProps
export const withAuthServerSideProps = (getServerSidePropsFunc?: GetServerSideProps) => {
  return async context => {
    const { req, res, resolvedUrl } = context;

    const handler = await import("@/frontend/pages/api/employees/current");
    const getFakeResponse = new Promise((resolve, reject) => {
      let statusCode = 0;
      const fakeRes = {
        ...res,
        status: function (status) {
          statusCode = status;
          return this;
        },
        json: function (data) {
          if (statusCode >= 200 && statusCode < 300) {
            resolve(JSON.parse(JSON.stringify(data)));
          } else {
            reject(JSON.parse(JSON.stringify(data)));
          }
          return data;
        }
      };
      handler.default(req, fakeRes);
    });
    const pathname = resolvedUrl;
    const { access_token, employee } = req.cookies;
    let employee_value = {};
    if (employee) {
      employee_value = JSON.parse(employee);
    } else {
      employee_value = await getFakeResponse.then(data => data).catch(error => null);

      setCookie(null, "employee", JSON.stringify(employee_value), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: true,
        sameSite: "None"
      });
    }
    const first_time = false;

    const redirectPath = getRedirectPath({
      employee: employee_value,
      first_time,
      pathname
    });

    if (redirectPath) {
      if (redirectPath === pathname) {
        return {
          props: {}
        };
      }
      return {
        redirect: {
          destination: redirectPath,
          permanent: false
        }
      };
    }

    if (getServerSidePropsFunc) {
      const serverSidePropsResult = await getServerSidePropsFunc(context);
      if ("props" in serverSidePropsResult) {
        return {
          props: {
            ...serverSidePropsResult.props,
            employee: employee_value,
            access_token
          }
        };
      }
      return serverSidePropsResult;
    }

    return {
      props: {
        employee: employee_value,
        access_token
      }
    };
  };
};

// Special use case after signin successful, redirect user to appropriate path
export const getRedirectPathAfterSignin = async ({ access_token, first_time }) => {
  const employee = access_token ? await getEmployee({ access_token }) : null;
  const redirectPath = getRedirectPath({
    employee,
    first_time,
    pathname: config.signinPath
  });
  return { redirectPath, emp: employee };
};

// Client side redirects based on next router
const withAuth = Page => {
  function AuthComponent(props) {
    // const router = useRouter();
    // const { employee } = props;
    // useEffect(() => {
    //     const first_time = false;
    //     const redirectPath = getRedirectPath({
    //         employee,
    //         first_time,
    //         pathname: router.pathname,
    //     });
    //     if(redirectPath) {
    //         router.replace(redirectPath);
    //     }
    // }, [router.pathname]);
    return <Page {...props} />;
  }
  return AuthComponent;
};

export default withAuth;
