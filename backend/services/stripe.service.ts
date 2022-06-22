import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27"
});

export default class StripeService {
  static connectAccount = async (code: string) => {
    const tokenResponse = await stripe.oauth.token({
      grant_type: "authorization_code",
      code
    });
    return tokenResponse;
  };
  public async createLocation(locationBody: any) {
    const location = await stripe.terminal.locations.create(locationBody);
    return location;
  }
  public async getLocations() {
    const locations = await stripe.terminal.locations.list();
    return locations;
  }
  public async createReader(registrationCode, locationId) {
    const reader = await stripe.terminal.readers.create({
      registration_code: registrationCode,
      label: "Alice's Reader",
      location: locationId
    });
    return reader;
  }
  public async getReaders() {
    const readers = await stripe.terminal.readers.list();
    return readers;
  }
  public async createTerminalToken() {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    return connectionToken;
  }
  public async capturePaymentIntent(id: string) {
    const intent = await stripe.paymentIntents.capture(id);
    return intent;
  }
  public async createPaymentIntent(orderId: number, amount: number) {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card_present"],
      capture_method: "manual",
      metadata: {
        order_id: orderId
      }
    });
    return intent;
  }
}
