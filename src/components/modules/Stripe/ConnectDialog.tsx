import React, { useEffect } from "react";
import { useCartContext } from "@/frontend/providers/CartProvider";
import { XIcon } from "@heroicons/react/outline";

const getDeviceTypeImageUrl = (deviceType: string) => {
  switch (deviceType) {
    case "stripe_m2":
      return "/images/Stripe-M2-Thumb.png";
    case "verifone_p400":
      return "/images/Terminal-P400-Thumb.png";
    case "bbpos_chipper_2x":
      return "/images/BBPOS-Thumb.png";
    case "bbpos_wisepos_e":
      return "/images/WisePOS-E-Thumb.png";
    case "bbpos_wisepad_3":
      return "/images/WisePad-3-Thumb.png";
    default:
      return "";
  }
};

const ConnectDialogWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-opaque-400">
      <div className="absolute z-40 top-0 left-0 h-screen bg-gray-100 shadow">
        <a className="flex flex-nowrap items-center min-w-fit w-full" onClick={() => onClose()}>
          <XIcon className="h-8 w-8 mx-4 my-3 inline-block" />
        </a>
        {children}
      </div>
    </div>
  );
};

const ConnectDialog = ({ onConnect, onDisconnect, onClose }) => {
  const { state, actions } = useCartContext();

  useEffect(() => {
    actions.getLocations();
    actions.getReaders("some_location");
  }, []);

  const getLocationDisplayName = locationId => {
    const location = state.locations.find(location => location.id === locationId);
    return location ? location.display_name : "(None)";
  };

  const connectReader = async reader => {
    await actions.setReader(reader);
    // await actions.setReaderDisplay({
    //     type: 'cart',
    //     cart: {
    //         line_items: [
    //             {
    //                 description: "Caramel latte",
    //                 amount: 659,
    //                 quantity: 1,
    //             },
    //             {
    //                 description: "Dozen doughnuts",
    //                 amount: 1239,
    //                 quantity: 1,
    //             }
    //         ],
    //         // modifiers:[{
    //         //     description: "Modifier",
    //         //     amount: 199,
    //         // }],
    //         // discounts:[{
    //         //     description: "Discount",
    //         //     amount: 350,
    //         // }],
    //         // tenders:[{
    //         //     description: "Cash",
    //         //     amount: 700,
    //         // }],
    //         tax: 100,
    //         total: 1998,
    //         currency: 'usd',
    //     },
    // });
    onConnect(reader);
  };

  const disconnectReader = async () => {
    await actions.clearReader();
    onDisconnect();
  };

  if (!state.locations.length || !state.readers.length) {
    return (
      <ConnectDialogWrapper onClose={onClose}>
        <div className="relative w-96 m-6 p-4 text-center">Finding terminals...</div>
      </ConnectDialogWrapper>
    );
  }
  return (
    <ConnectDialogWrapper onClose={onClose}>
      <>
        {state.readers.map(reader => (
          <div
            className="relative w-96 m-6 p-4 flex flex-1 justify-between items-center rounded shadow"
            key={reader.id}
          >
            <div
              className="relative w-16 h-16 bg-contain"
              style={{
                backgroundImage: `url(${getDeviceTypeImageUrl(reader.device_type)})`
              }}
            ></div>
            <div>
              <div className="text-lg">{reader.label}</div>
              <div className="text-slate-600">{getLocationDisplayName(reader.location)}</div>
              <div className="text-slate-600">{reader.serial_number}</div>
            </div>
            {reader.status === "online" &&
              (state.reader && reader.id === state.reader.id ? (
                <button
                  className="px-4 py-2 shadow bg-red-500 text-white rounded"
                  onClick={() => disconnectReader()}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="px-4 py-2 shadow bg-green-500 text-white rounded"
                  onClick={() => connectReader(reader)}
                >
                  Connect
                </button>
              ))}
            {reader.status !== "online" && (
              <button
                className="px-4 py-2 shadow bg-slate-300 text-white rounded cursor-not-allowed"
                disabled
              >
                Connect
              </button>
            )}
            <div
              className={`absolute top-0 left-0 -ml-3 -mt-3 w-6 h-6 rounded-full shadow ${
                reader.status === "online" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        ))}
      </>
    </ConnectDialogWrapper>
  );
};

export default ConnectDialog;
