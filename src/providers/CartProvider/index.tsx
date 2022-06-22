import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadStripeTerminal } from "@stripe/terminal-js";
import { SessionExpiredError } from "@/shared/methods/bigcommerce";
import { destroyCookie } from "nookies";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import {
  CartContext,
  GetCartAction,
  CreateCartAction,
  UpdateCartCustomerIdAction,
  DeleteCartAction,
  ClearCartCheckoutFunction,
  AddCartLineItemsAction,
  UpdateCartLineItemAction,
  DeleteCartLineItemAction,
  AddConsignmentAction,
  UpdateConsignmentAction,
  DeleteConsignmentAction,
  AddBillingAddressAction,
  GetAcceptedPaymentMethodsAction,
  CreatePaymentAccessTokenAction,
  ProcessManualPaymentAction,
  ProcessCashPaymentAction,
  InitCheckoutFunction,
  CreateOrderAction,
  GetLocationsAction,
  GetReadersAction,
  SetReaderAction,
  //SetReaderDisplayAction,
  ClearLocationsAction,
  ClearReadersAction,
  ClearReaderAction,
  ClearErrorsAction,
  CreateCustomerAction,
  OpenCustomerTabFunction,
  GetCustomersAction,
  UpdateCustomerAction,
  RemoveCustomerAction,
  ConsignmentRequest,
  ConsignmentLineItem,
  AddOrderNotesFunction,
  UpdateOrderNotesFunction,
  RemoveOrderNotesFunction,
  OpenOrderNotesTabFunction,
  AddUpdateOrderNotesToOrderAction,
  RemoveOrderNotesFromOrderAction
} from "./context";
import {
  getCartMethod,
  createCartMethod,
  updateCartCustomerIdMethod,
  deleteCartMethod,
  addCartLineItemsMethod,
  updateCartLineItemMethod,
  deleteCartLineItemMethod,
  addConsignmentMethod,
  updateConsignmentMethod,
  deleteConsignmentMethod,
  addBillingAddressMethod,
  getAcceptedPaymentMethodsMethod,
  createPaymentAccessTokenMethod,
  processManualPaymentMethod,
  processCashPaymentMethod,
  createOrderMethod,
  getConnectionTokenMethod,
  getLocationsMethod,
  getReadersMethod,
  createPaymentIntentMethod,
  capturePaymentIntentMethod,
  getCustomersMethod,
  createCustomerMethod,
  updateCustomerMethod,
  addUpdateOrderNotesToOrderMethod,
  removeOrderNotesFromOrderMethod
} from "./methods";
import { StoreAddress } from "../SettingsProvider";
import { asyncForEach } from "@/shared/utils/asyncForEach";

export * from "./context";

export interface ActionBuilder<T> {
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  execMethod: T;
}

const CartProvider = (props: { access_token: string; children: React.ReactElement | any }) => {
  const { access_token, children } = props;
  const router = useRouter();

  // Loaders
  const [getCartLoader, setGetCartLoader] = useState(false);
  const [createCartLoader, setCreateCartLoader] = useState(false);
  const [updateCartCustomerIdLoader, setUpdateCartCustomerIdLoader] = useState(false);
  const [deleteCartLoader, setDeleteCartLoader] = useState(false);
  const [addCartLineItemsLoader, setAddCartLineItemsLoader] = useState(false);
  const [updateCartLineItemLoader, setUpdateCartLineItemLoader] = useState(false);
  const [deleteCartLineItemLoader, setDeleteCartLineItemLoader] = useState(false);
  const [addConsignmentLoader, setAddConsignmentLoader] = useState(false);
  const [updateConsignmentLoader, setUpdateConsignmentLoader] = useState(false);
  const [deleteConsignmentLoader, setDeleteConsignmentLoader] = useState(false);
  const [addBillingAddressLoader, setAddBillingAddressLoader] = useState(false);
  const [getAcceptedPaymentMethodsLoader, setGetAcceptedPaymentMethodsLoader] = useState(false);
  const [createPaymentAccessTokenLoader, setCreatePaymentAccessTokenLoader] = useState(false);
  const [processManualPaymentLoader, setProcessManualPaymentLoader] = useState(false);
  const [processCashPaymentLoader, setProcessCashPaymentLoader] = useState(false);
  const [createOrderLoader, setCreateOrderLoader] = useState(false);
  const [getLocationsLoader, setGetLocationsLoader] = useState(false);
  const [getReadersLoader, setGetReadersLoader] = useState(false);
  const [setReaderLoader, setSetReaderLoader] = useState(false);
  const [collectTerminalPaymentLoader, setCollectTerminalPaymentLoader] = useState(false);
  const [processTerminalPaymentLoader, setProcessTerminalPaymentLoader] = useState(false);
  const [captureTerminalPaymentLoader, setCaptureTerminalPaymentLoader] = useState(false);
  const [createCustomerLoader, setCreateCustomerLoader] = useState(false);
  const [getCustomersLoader, setGetCustomersLoader] = useState(false);
  const [updateCustomerLoader, setUpdateCustomerLoader] = useState(false);
  const [removeCustomerLoader, setRemoveCustomerLoader] = useState(false);
  const [addUpdateOrderNotesToOrderLoader, setAddUpdateOrderNotesToOrderLoader] = useState(false);
  const [removeOrderNotesFromOrderLoader, setRemoveOrderNotesFromOrderLoader] = useState(false);

  // Errors
  const [getCartError, setGetCartError] = useState(null);
  const [createCartError, setCreateCartError] = useState(null);
  const [updateCartCustomerIdError, setUpdateCartCustomerIdError] = useState(null);
  const [deleteCartError, setDeleteCartError] = useState(null);
  const [addCartLineItemsError, setAddCartLineItemError] = useState(null);
  const [updateCartLineItemError, setUpdateCartLineItemError] = useState(null);
  const [deleteCartLineItemError, setDeleteCartLineItemError] = useState(null);
  const [addConsignmentError, setAddConsignmentError] = useState(null);
  const [updateConsignmentError, setUpdateConsignmentError] = useState(null);
  const [deleteConsignmentError, setDeleteConsignmentError] = useState(null);
  const [addBillingAddressError, setAddBillingAddressError] = useState(null);
  const [getAcceptedPaymentMethodsError, setGetAcceptedPaymentMethodsError] = useState(null);
  const [createPaymentAccessTokenError, setCreatePaymentAccessTokenError] = useState(null);
  const [processManualPaymentError, setProcessManualPaymentError] = useState(null);
  const [processCashPaymentError, setProcessCashPaymentError] = useState(null);
  const [createOrderError, setCreateOrderError] = useState(null);
  const [getLocationsError, setGetLocationsError] = useState(null);
  const [getReadersError, setGetReadersError] = useState(null);
  const [setReaderError, setSetReaderError] = useState(null);
  const [collectTerminalPaymentError, setCollectTerminalPaymentError] = useState(null);
  const [processTerminalPaymentError, setProcessTerminalPaymentError] = useState(null);
  const [captureTerminalPaymentError, setCaptureTerminalPaymentError] = useState(null);
  const [createCustomerError, setCreateCustomerError] = useState(null);
  const [getCustomersError, setGetCustomersError] = useState(null);
  const [updateCustomerError, setUpdateCustomerError] = useState(null);
  const [removeCustomerError, setRemoveCustomerError] = useState(null);
  const [addUpdateOrderNotesToOrderError, setAddUpdateOrderNotesToOrderError] = useState(null);
  const [removeOrderNotesFromOrderError, setRemoveOrderNotesFromOrderError] = useState(null);

  const [cart, setCart] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [acceptedPaymentMethods, setAcceptedPaymentMethods] = useState([]);
  const [paymentAccessToken, setPaymentAccessToken] = useState(null);
  const [completedPayment, setCompletedPayment] = useState(null);
  const [locations, setLocations] = useState([]);
  const [readers, setReaders] = useState([]);
  const [reader, setReader] = useState(null);
  const [terminal, setTerminal] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orderNotes, setOrderNotes] = useState(null);
  const [customersLookupResult, setCustomerLookupResult] = useState(null);

  useEffect(() => {
    const posCart =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pos_cart")) : null;
    const posCheckout =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pos_checkout")) : null;
    const posOrderId =
      typeof window !== "undefined" ? parseInt(localStorage.getItem("pos_order_id")) : 0;
    const posAcceptedPaymentMethods =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("pos_accepted_payment_methods"))
        : null;
    const posCustomer =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pos_customer")) : null;
    const posOrderNotes =
      typeof window !== "undefined" ? localStorage.getItem("pos_order_notes") : null;

    if (!isNullOrUndefined(posCart) && isNullOrUndefined(cart)) {
      setCart(posCart);
    }
    if (!isNullOrUndefined(posCheckout) && isNullOrUndefined(checkout)) {
      setCheckout(posCheckout);
    }
    if (!isNullOrUndefined(posOrderId) && isNullOrUndefined(orderId)) {
      setOrderId(posOrderId);
    }
    if (
      !isNullOrUndefined(posAcceptedPaymentMethods) &&
      isNullOrUndefined(acceptedPaymentMethods)
    ) {
      setAcceptedPaymentMethods(posAcceptedPaymentMethods);
    }
    if (!isNullOrUndefined(posCustomer) && isNullOrUndefined(customer)) {
      setCustomer(posCustomer);
    }
    if (!isNullOrUndefined(posOrderNotes) && isNullOrUndefined(orderNotes)) {
      setOrderNotes(posOrderNotes);
    }

    // Get terminal locations
    getLocations();

    // Load Stripe terminals
    loadStripeTerminal().then(StripeTerminal => {
      const terminalResponse = StripeTerminal.create({
        onFetchConnectionToken,
        onUnexpectedReaderDisconnect
      });
      setTerminal(terminalResponse);
    });
  }, []);

  // Store cart in localStorage
  useEffect(() => {
    (async function () {
      // If cart, and on client ( window exist ), create consignment and save to localStorage
      if (!isNullOrUndefined(cart) && typeof window !== "undefined") {
        if (!cart.line_items.physical_items.length) {
          return;
        }
        localStorage.setItem("pos_cart", JSON.stringify(cart));
      }
    })();
  }, [cart]);

  // Store checkout in localStorage
  useEffect(() => {
    (async function () {
      // If checkout, and on client ( window exists ), save to local storage
      if (!isNullOrUndefined(checkout) && typeof window !== "undefined") {
        localStorage.setItem("pos_checkout", JSON.stringify(checkout));
      }
    })();
  }, [checkout]);

  // store order id in localStorage
  useEffect(() => {
    (async function () {
      if (!isNullOrUndefined(orderId) && !isNaN(orderId) && typeof window !== "undefined") {
        localStorage.setItem("pos_order_id", orderId);
      }
    })();
  }, [orderId]);

  // Store accepted payment methods in localStorage
  useEffect(() => {
    (async function () {
      if (!isNullOrUndefined(acceptedPaymentMethods) && typeof window !== "undefined") {
        localStorage.setItem(
          "pos_accepted_payment_methods",
          JSON.stringify(acceptedPaymentMethods)
        );
      }
    })();
  }, [acceptedPaymentMethods]);

  // Store customer in localStorage
  useEffect(() => {
    (async function () {
      if (!isNullOrUndefined(customer) && typeof window !== "undefined") {
        const customerObject = Array.isArray(customer) ? customer[0] : customer;
        localStorage.setItem("pos_customer", JSON.stringify(customerObject));
      }
    })();
  }, [customer]);

  // Store order notes in localStorage
  useEffect(() => {
    (async function () {
      if (!isNullOrUndefined(orderNotes) && typeof window !== "undefined") {
        localStorage.setItem("pos_order_notes", orderNotes);
      }
    })();
  }, [orderNotes]);

  const actionBuilder = ({ setLoader, setData, setError, execMethod }) =>
    function (...args) {
      args = Array.from(args).concat([{ access_token }]);
      setError(null);
      setLoader(true);
      return execMethod
        .apply(this, args)
        .then(data => {
          if (!isNullOrUndefined(data)) {
            if (isNullOrUndefined(data.status)) {
              setData(data);
            } else {
              setError(data);
            }
            setLoader(false);
            return data;
          }
        })
        .catch(e => {
          if (e instanceof SessionExpiredError) {
            destroyCookie(null, "access_token");
            destroyCookie(null, "first_time");
            destroyCookie(null, "employee");
            router.reload();
            return null;
          }
          setError(e);
          setLoader(false);
          throw e;
        });
    };

  const getCart: GetCartAction = actionBuilder({
    setLoader: setGetCartLoader,
    setData: setCart,
    setError: setGetCartError,
    execMethod: getCartMethod
  });

  const createCart: CreateCartAction = actionBuilder({
    setLoader: setCreateCartLoader,
    setData: setCart,
    setError: setCreateCartError,
    execMethod: createCartMethod
  });

  const updateCartCustomerId: UpdateCartCustomerIdAction = actionBuilder({
    setLoader: setUpdateCartCustomerIdLoader,
    setData: setCart,
    setError: setUpdateCartCustomerIdError,
    execMethod: updateCartCustomerIdMethod
  });

  const deleteCart: DeleteCartAction = actionBuilder({
    setLoader: setDeleteCartLoader,
    setData: () => {},
    setError: setDeleteCartError,
    execMethod: deleteCartMethod
  });

  const clearCartCheckout: ClearCartCheckoutFunction = () => {
    setCart(null);
    setCheckout(null);
    setCompletedPayment(null);
    setOrderId(null);
    setCustomer(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pos_cart");
      localStorage.removeItem("pos_checkout");
      localStorage.removeItem("pos_order_id");
      localStorage.removeItem("pos_customer");
      localStorage.removeItem("pos_order_notes");
    }
  };

  const addCartLineItems: AddCartLineItemsAction = actionBuilder({
    setLoader: setAddCartLineItemsLoader,
    setData: setCart,
    setError: setAddCartLineItemError,
    execMethod: addCartLineItemsMethod
  });

  const updateCartLineItem: UpdateCartLineItemAction = actionBuilder({
    setLoader: setUpdateCartLineItemLoader,
    setData: setCart,
    setError: setUpdateCartLineItemError,
    execMethod: updateCartLineItemMethod
  });

  const deleteCartLineItem: DeleteCartLineItemAction = actionBuilder({
    setLoader: setDeleteCartLineItemLoader,
    setData: setCart,
    setError: setDeleteCartLineItemError,
    execMethod: deleteCartLineItemMethod
  });

  const addConsignment: AddConsignmentAction = actionBuilder({
    setLoader: setAddConsignmentLoader,
    setData: setCheckout,
    setError: setAddConsignmentError,
    execMethod: addConsignmentMethod
  });

  const updateConsignment: UpdateConsignmentAction = actionBuilder({
    setLoader: setUpdateConsignmentLoader,
    setData: setCheckout,
    setError: setUpdateConsignmentError,
    execMethod: updateConsignmentMethod
  });

  const deleteConsignment: DeleteConsignmentAction = actionBuilder({
    setLoader: setDeleteConsignmentLoader,
    setData: setCheckout,
    setError: setDeleteConsignmentError,
    execMethod: deleteConsignmentMethod
  });

  const addBillingAddress: AddBillingAddressAction = actionBuilder({
    setLoader: setAddBillingAddressLoader,
    setData: setCheckout,
    setError: setAddBillingAddressError,
    execMethod: addBillingAddressMethod
  });

  const createOrder: CreateOrderAction = actionBuilder({
    setLoader: setCreateOrderLoader,
    setData: setOrderId,
    setError: setCreateOrderError,
    execMethod: createOrderMethod
  });

  const getAcceptedPaymentMethods: GetAcceptedPaymentMethodsAction = actionBuilder({
    setLoader: setGetAcceptedPaymentMethodsLoader,
    setData: setAcceptedPaymentMethods,
    setError: setGetAcceptedPaymentMethodsError,
    execMethod: getAcceptedPaymentMethodsMethod
  });

  const createPaymentAccessToken: CreatePaymentAccessTokenAction = actionBuilder({
    setLoader: setCreatePaymentAccessTokenLoader,
    setData: setPaymentAccessToken,
    setError: setCreatePaymentAccessTokenError,
    execMethod: createPaymentAccessTokenMethod
  });

  const processManualPayment: ProcessManualPaymentAction = actionBuilder({
    setLoader: setProcessManualPaymentLoader,
    setData: setCompletedPayment,
    setError: setProcessManualPaymentError,
    execMethod: processManualPaymentMethod
  });

  const processCashPayment: ProcessCashPaymentAction = actionBuilder({
    setLoader: setProcessManualPaymentLoader,
    setData: setCompletedPayment,
    setError: setProcessManualPaymentError,
    execMethod: processCashPaymentMethod
  });

  const initCheckout: InitCheckoutFunction = async (
    storeAddress: StoreAddress,
    storeEmail: string
  ) => {
    // Create consignments for all line items
    const line_items: ConsignmentLineItem[] = cart.line_items.physical_items.map(item => ({
      item_id: item.id,
      quantity: item.quantity
    }));

    const addConsignmentRequest: ConsignmentRequest[] = [
      {
        address: {
          email: storeEmail,
          first_name: storeAddress.first_name,
          last_name: storeAddress.last_name,
          company: storeAddress.company,
          address1: storeAddress.address1,
          address2: storeAddress.address2,
          city: storeAddress.city,
          state_or_province: storeAddress.state_or_province,
          postal_code: storeAddress.postal_code,
          country_code: storeAddress.country_code
        },
        line_items: line_items
      }
    ];

    // Create consignment
    const checkout = await addConsignment(cart.id, addConsignmentRequest);

    if ("consignments" in checkout) {
      // Loop through consignments and update each with shipping option in store pickup
      await asyncForEach(checkout.consignments, async consignment => {
        const updateConsignmentRequest = {
          shipping_option_id: ""
        };
        // Get in store pickup shipping option ( default )
        consignment.available_shipping_options.forEach(ship_option => {
          // Pickup in store
          if ("shipping_pickupinstore" == ship_option.type) {
            updateConsignmentRequest.shipping_option_id = ship_option.id;
          }
        });
        // Update consignment with shipping option ( default to in store pickup )
        await updateConsignment(cart.id, consignment.id, updateConsignmentRequest);
      });

      // Add billing address ( country of store and store email address )
      const addBillingAddressRequest = {
        first_name: storeAddress.first_name,
        last_name: storeAddress.last_name,
        email: storeEmail,
        company: storeAddress.company,
        address1: storeAddress.address1,
        address2: storeAddress.address2,
        city: storeAddress.city,
        state_or_province: storeAddress.state_or_province,
        postal_code: storeAddress.postal_code,
        country_code: storeAddress.country_code
      };
      await addBillingAddress(cart.id, addBillingAddressRequest);

      // Create initial order
      const orderId = await createOrder(cart.id);

      // Update order with order notes if exist
      if (orderNotes && "number" === typeof orderId) {
        console.log("addUpdateOrderNotesToOrder :: orderId :: ", orderId);
        console.log("addUpdateOrderNotesToOrder :: orderNotes :: ", orderNotes);
        await addUpdateOrderNotesToOrder(orderId, orderNotes);
      }

      return orderId;
    }
    return 0;
  };

  const getLocations: GetLocationsAction = actionBuilder({
    setLoader: setGetLocationsLoader,
    setData: setLocations,
    setError: setGetLocationsError,
    execMethod: getLocationsMethod
  });

  const getReaders: GetReadersAction = actionBuilder({
    setLoader: setGetReadersLoader,
    setData: setReaders,
    setError: setGetReadersError,
    execMethod: getReadersMethod
  });

  const onFetchConnectionToken = async () => {
    const data = await getConnectionTokenMethod({ access_token });
    return data.secret;
  };

  const onUnexpectedReaderDisconnect = async () => {
    setReader(null);
  };

  const setReaderConnection: SetReaderAction = async reader => {
    const connectResult = await terminal.connectReader(reader);
    if (connectResult.error) {
      setReaderError(connectResult.error);
      return null;
    } else {
      setReader(connectResult.reader);
      return connectResult.reader;
    }
  };

  const setReaderDisplay = async displayInfo => {
    const response = await terminal.setReaderDisplay(displayInfo);
  };

  const collectTerminalPayment = async () => {
    setCollectTerminalPaymentLoader(true);

    const paymentAmount = Math.ceil(Number(checkout.grand_total) * 100);

    const createPaymentIntentResult = await createPaymentIntentMethod(orderId, paymentAmount, {
      access_token
    });

    if (terminal.paymentStatus === "not_ready") {
      setCollectTerminalPaymentError("Terminal is not ready to accept payments.");
      console.log('Terminal is in "not_ready" status.');
      setCollectTerminalPaymentLoader(false);
      return;
    }

    const stripePaymentClientSecret = createPaymentIntentResult.client_secret;

    const result = await terminal.collectPaymentMethod(stripePaymentClientSecret);
    if (result.error) {
      setCollectTerminalPaymentError(result.error);
      setCollectTerminalPaymentLoader(false);
    } else {
      setCollectTerminalPaymentLoader(false);
      setProcessTerminalPaymentLoader(true);
      const processResult = await terminal.processPayment(result.paymentIntent);
      if (processResult.error) {
        setProcessTerminalPaymentError(processResult.error);
        setProcessTerminalPaymentLoader(false);
      } else {
        setProcessTerminalPaymentLoader(false);
        setCaptureTerminalPaymentLoader(true);
        const captureResult = await capturePaymentIntentMethod(result.paymentIntent.id, {
          access_token
        });

        if (!isNullOrUndefined(captureResult)) {
          if (isNullOrUndefined(captureResult.status)) {
            setCompletedPayment(captureResult);
          } else {
            setCaptureTerminalPaymentError(captureResult);
          }
        }

        setCaptureTerminalPaymentLoader(false);
      }
    }
  };

  const stopCollectingTerminalPayment = async () => {
    terminal.cancelCollectPaymentMethod();
    setCollectTerminalPaymentLoader(false);
  };

  const clearLocations: ClearLocationsAction = async () => {
    setLocations([]);
    return null;
  };

  const clearReaders: ClearReadersAction = async () => {
    setReaders([]);
    return null;
  };

  const clearReader: ClearReaderAction = async () => {
    if (reader) {
      await terminal.disconnectReader();
    }
    setReader(null);
    return null;
  };

  const clearErrors: ClearErrorsAction = async () => {
    getLocationsError && setGetLocationsError(null);
    getReadersError && setGetReadersError(null);
    setReaderError && setSetReaderError(null);
    setCaptureTerminalPaymentError && setCaptureTerminalPaymentError(null);
    return null;
  };

  const createCustomer: CreateCustomerAction = actionBuilder({
    setLoader: setCreateCustomerLoader,
    setData: setCustomer,
    setError: setCreateCustomerError,
    execMethod: createCustomerMethod
  });

  const openCustomerTab: OpenCustomerTabFunction = (action = "") => {
    const actionUrl = "update" == action ? "&action=update" : null;
    router.push(`register?tab=add-customer${actionUrl}`);
  };

  const getCustomers: GetCustomersAction = actionBuilder({
    setLoader: setGetCustomersLoader,
    setData: setCustomerLookupResult,
    setError: setGetCustomersError,
    execMethod: getCustomersMethod
  });

  const updateCustomer: UpdateCustomerAction = actionBuilder({
    setLoader: setUpdateCustomerLoader,
    setData: setCustomer,
    setError: setUpdateCustomerError,
    execMethod: updateCustomerMethod
  });

  const setActiveCustomer = customer => {
    setCustomer(customer);
  };

  const clearCustomersLookupResult = () => {
    setCustomerLookupResult(null);
  };

  const removeCustomer: RemoveCustomerAction = async () => {
    // Update cart customer ID to zero
    const cartResponse = await updateCartCustomerId(cart.id, 0);
    // Update cart state
    setCart(cartResponse);
    // Update customer state
    setCustomer(null);
    // Remove from local storage
    localStorage.removeItem("pos_customer");
  };

  const addOrderNotes: AddOrderNotesFunction = orderNotesParam => {
    setOrderNotes(orderNotesParam);
    return orderNotes;
  };

  const updateOrderNotes: UpdateOrderNotesFunction = orderNotesParam => {
    setOrderNotes(orderNotesParam);
    return orderNotes;
  };

  const openOrderNotesTab: OpenOrderNotesTabFunction = action => {
    const actionUrl = "update" == action ? "&action=update" : null;
    router.push(`register?tab=order-notes${actionUrl}`);
  };

  const addUpdateOrderNotesToOrder: AddUpdateOrderNotesToOrderAction = actionBuilder({
    setLoader: setAddUpdateOrderNotesToOrderLoader,
    setData: () => {},
    setError: setAddUpdateOrderNotesToOrderError,
    execMethod: addUpdateOrderNotesToOrderMethod
  });

  const removeOrderNotesFromOrder: RemoveOrderNotesFromOrderAction = actionBuilder({
    setLoader: setRemoveOrderNotesFromOrderLoader,
    setData: () => {},
    setError: setRemoveOrderNotesFromOrderError,
    execMethod: removeOrderNotesFromOrderMethod
  });

  const removeOrderNotes: RemoveOrderNotesFunction = async () => {
    if (orderId) {
      await removeOrderNotesFromOrder(orderId);
    }
    setOrderNotes(null);
    localStorage.removeItem("pos_order_notes");
  };

  const value = {
    state: {
      loaders: {
        getCart: getCartLoader,
        createCart: createCartLoader,
        updateCartCustomerId: updateCartCustomerIdLoader,
        deleteCart: deleteCartLoader,
        addCartLineItems: addCartLineItemsLoader,
        updateCartLineItem: updateCartLineItemLoader,
        deleteCartLineItem: deleteCartLineItemLoader,
        addConsignment: addConsignmentLoader,
        updateConsignment: updateConsignmentLoader,
        deleteConsignment: deleteConsignmentLoader,
        addBillingAddress: addBillingAddressLoader,
        getAcceptedPaymentMethods: getAcceptedPaymentMethodsLoader,
        createPaymentAccessToken: createPaymentAccessTokenLoader,
        processManualPayment: processManualPaymentLoader,
        processCashPayment: processCashPaymentLoader,
        createOrder: createOrderLoader,
        getLocations: getLocationsLoader,
        getReaders: getReadersLoader,
        setReader: setReaderLoader,
        collectTerminalPayment: collectTerminalPaymentLoader,
        processTerminalPayment: processTerminalPaymentLoader,
        captureTerminalPayment: captureTerminalPaymentLoader,
        createCustomer: createCustomerLoader,
        getCustomers: getCustomersLoader,
        updateCustomer: updateCustomerLoader,
        removeCustomer: removeCustomerLoader,
        addUpdateOrderNotesToOrder: addUpdateOrderNotesToOrderLoader,
        removeOrderNotesFromOrder: removeOrderNotesFromOrderLoader
      },
      errors: {
        getCart: getCartError,
        createCart: createCartError,
        updateCartCustomerId: updateCartCustomerIdError,
        deleteCart: deleteCartError,
        addCartLineItems: addCartLineItemsError,
        updateCartLineItem: updateCartLineItemError,
        deleteCartLineItem: deleteCartLineItemError,
        addConsignment: addConsignmentError,
        updateConsignment: updateConsignmentError,
        deleteConsignment: deleteConsignmentError,
        addBillingAddress: addBillingAddressError,
        getAcceptedPaymentMethods: getAcceptedPaymentMethodsError,
        createPaymentAccessToken: createPaymentAccessTokenError,
        processManualPayment: processManualPaymentError,
        processCashPayment: processCashPaymentError,
        createOrder: createOrderError,
        getLocations: getLocationsError,
        getReaders: getReadersError,
        setReader: setReaderError,
        collectTerminalPayment: collectTerminalPaymentError,
        processTerminalPayment: processTerminalPaymentError,
        captureTerminalPayment: captureTerminalPaymentError,
        createCustomer: createCustomerError,
        getCustomers: getCustomersError,
        updateCustomer: updateCustomerError,
        removeCustomer: removeCustomerError,
        addUpdateOrderNotesToOrder: addUpdateOrderNotesToOrderError,
        removeOrderNotesFromOrder: removeOrderNotesFromOrderError
      },
      cart,
      checkout,
      orderId,
      acceptedPaymentMethods,
      paymentAccessToken,
      completedPayment,
      locations,
      readers,
      reader,
      customer,
      orderNotes,
      customersLookupResult
    },
    actions: {
      getCart,
      createCart,
      updateCartCustomerId,
      deleteCart,
      clearCartCheckout,
      addCartLineItems,
      updateCartLineItem,
      deleteCartLineItem,
      addConsignment,
      updateConsignment,
      deleteConsignment,
      addBillingAddress,
      setPaymentAccessToken,
      getAcceptedPaymentMethods,
      createPaymentAccessToken,
      processManualPayment,
      processCashPayment,
      createOrder,
      initCheckout,
      getLocations,
      getReaders,
      setReader: setReaderConnection,
      setReaderDisplay,
      collectTerminalPayment,
      stopCollectingTerminalPayment,
      clearLocations,
      clearReaders,
      clearReader,
      clearErrors,
      createCustomer,
      getCustomers,
      setActiveCustomer,
      clearCustomersLookupResult,
      updateCustomer,
      removeCustomer,
      openCustomerTab,
      addOrderNotes,
      updateOrderNotes,
      removeOrderNotes,
      openOrderNotesTab,
      addUpdateOrderNotesToOrder,
      removeOrderNotesFromOrder
    }
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export default CartProvider;
