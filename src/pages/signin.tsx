import { useEffect, useReducer, useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import withAuth, {
  withAuthServerSideProps,
  getRedirectPathAfterSignin
} from "@/frontend/hocs/withAuth";

import Alert from "@/frontend/components/base/Alert";
import Loader from "@/frontend/components/base/Loader";
import PinEntry from "@/frontend/components/modules/PinEntry/PinEntry";
import reducer, {
  ACTION,
  PIN_LENGTH
} from "@/frontend/components/modules/PinEntry/pinInput.reducer";
import { setCookie } from "nookies";

export const getServerSideProps = withAuthServerSideProps();

const LoginPage = ({
  employee
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const router = useRouter();
  // const [cookie, setCookie] = useCookies();
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [{ pin, validation }, dispatch] = useReducer(reducer, {
    pin: new Array(PIN_LENGTH),
    validation: {}
  });

  const onPinChange = (pinEntry: number | undefined, index: number) => {
    const newPin = [...pin];
    newPin[index] = pinEntry;
    dispatch({ type: ACTION.SET_PIN, pin: newPin });
  };

  const clearPinInput = () => {
    dispatch({ type: ACTION.RESET_PIN });
  };

  useEffect(() => {
    const submit = async () => {
      setIsValidating(true);
      try {
        const response = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: pin.join("") })
        });
        const { first_time, access_token } = await response.json();
        const {redirectPath, emp} = await getRedirectPathAfterSignin({
          access_token,
          first_time
        });
        if (redirectPath) {
          router.replace(redirectPath);
        }

        setCookie(null, "employee", JSON.stringify(emp), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          secure: true,
          sameSite: 'None'
        });

        // if(first_time) {
        //   router.push("/setup");
        // } else {
        //   router.push("/");
        // }
        // const { first_time, access_token } = parseCookies();
        // const { exp }:JwtDecode = jwt(access_token);
        // setCookie("jwt", access_token, {
        //   path: "/",
        //   expires: new Date(exp*1000),
        //   sameSite: true,
        // });
        // dispatch({
        //   type: ACTION.SET_VALIDATION,
        //   validation: { message: response.message, isValid: true }
        // });
      } catch (error: any) {
        dispatch({
          type: ACTION.SET_VALIDATION,
          validation: { message: error.message, isValid: false }
        });
      }
      setIsValidating(false);
    };

    if (pin[PIN_LENGTH - 1] !== undefined) {
      submit().then(() => clearPinInput());
    } else if (employee) {
      router.push("/register");
    }
  }, [pin]);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-slate-200">
        <div className="h-screen flex flex-col justify-center items-center w-1/3">
          {validation.isValid !== undefined && (
            <Alert value={validation.isValid} message={validation.message} />
          )}
          {isValidating && <Loader message="SIGNING IN..." />}
          <PinEntry
            pin={pin}
            pinLength={PIN_LENGTH}
            isValidating={isValidating}
            onPinChange={onPinChange}
            clearPinInput={clearPinInput}
          />
        </div>
      </div>
    </>
  );
};

export default withAuth(LoginPage);
