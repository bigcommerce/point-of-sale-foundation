# BigCommerce Point of Sale (POS) Foundation

🚀 This open-sourced POS application allows you to build custom in-store apps using the BigCommerce platform.

💰 **Pre-integrated into Stripe Terminal**, including connection to multiple terminals at a single location.

| Register Screen                          | Checkout Screen                              |
| ---------------------------------------- | -------------------------------------------- |
| ![App Preview](sample-register-screen.png) | ![App Preview](sample-checkout-screen.png) |

## Prerequisites
You will need the following:
* [BigCommerce sandbox store](https://developer.bigcommerce.com/docs/ZG9jOjM4MzMyNTE-create-a-sandbox-store?source=subscription-foundation) (required to develop and test apps)
* a database (BigCommerce recommends MongoDB) 
* a shipping zone with a [Pickup in Store](https://support.bigcommerce.com/s/article/Free-Shipping?language=en_US#in-store) shipping method 
* a [Stripe POS terminal and card reader](https://stripe.com/terminal)
* Experience using [npm](https://www.npmjs.com/)
* Node.js 14.x

## Getting started
1. Start by forking the point-of-sale-foundation repository.
2. Navigate to the root directory of your project and install npm packages.

```shell
npm install
```
## BigCommerce setup

1. [Create BigCommerce store](https://developer.bigcommerce.com/docs/ZG9jOjM4MzMyNTE-create-a-sandbox-store?source=subscription-foundation): go to [https://www.bigcommerce.com/essentials/](https://www.bigcommerce.com/essentials/?source=pos-foundation) and signup for a free trial if you don't have one.
2. The Bigcommerce store you are connected to must have "Pickup in Store" as a shipping option for orders to be created on the POS. Go to "Settings -> Shipping" in your admin to turn it on.

3. Create BigCommerce v2/v3 API credentials. Go to Advanced Settings > API Accounts and create and API Account with these scopes:

```
Customers: MODIFY
Information & settings: READ-ONLY
Orders: MODIFY
Create payments: CREATE
Get payment methods: READ-ONLY
Products: READ-ONLY
Carts: MODIFY
Checkouts: MODIFY
Channel Settings: MODIFY
Storefront API tokens: MANAGE
```
4. Copy the `ACCESS_TOKEN`, `CLIENT ID`, and `CLIENT SECRET` credentials. In a later step, you will need these credentials to update `BC_APP_CLIENT_ID`, `BC_APP_SECRET`, and `BC_AUTH_TOKEN` environment variables in the .env file.

## Stripe setup

1. Go to your Stripe dashboard: https://dashboard.stripe.com/test/developers
2. Copy the Stripe secret key. In a later step, you will use the secret key to update the environment variable `STRIPE_SECRET_KEY` in the .env file.
3. Go to "More > Terminal" in the dashboard. Press "Get Started" when asked to activate the Terminal section.
4. Add a location, then click on the location row to manage details.
5. Add a new reader to the location.

## Set up database

This app works with MongoDB. The `provider` setting in the `/prisma/schema.prisma` should be set to `mongodb`. 

![POS-provider-mongodb](https://storage.googleapis.com/bigcommerce-production-dev-center/images/POS-provider-mongodb.png)

We highly recommend using MongoDB, but if you would like to use another type of database, you will need to update the configuration to work with the database of your choice. View the available database options here: https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources/)

Copy the the `DATABASE_URL` generated from Mongo Cloud ( https://cloud.mongodb.com). In a later step, you will need the `DATABASE_URL` to update the environment variable in .env file. 

Click on the arrow below and follow the Mongo Cloud setup instructions.

<details>

  <summary>Guide on setting up Mongo Cloud</summary>

1. Click [here](https://account.mongodb.com/) and log in.  If you don't have an account, you can click [SignUp](https://account.mongodb.com/account/register).

2. On the left-hand sidebar, click "Database Access" > "ADD NEW DATABASE USER".
  
    a. Fill in your username and password, and leave all remaining fields as is.
  
    b. Click "Add User".


3. On the left-hand sidebar, click "Network Access" > "ADD IP ADDRESS".
  
    a. Enter an IP address in the "Access List Entry" field. We recommend using 0.0.0.0/0 so you can connect from anywhere.

      ![pos-ip-address](https://storage.googleapis.com/bigcommerce-production-dev-center/images/POS-IP-address.png)
  
    b. Click "Confirm".

4. On the left-hand sidebar, click "Database".
  
    a. Click the "Connect" button in your running cluster.
  
    b. Click "Connect your application" in the popup modal.
  
    c. Copy the connection string and replace \<password> with the password and \<username> with the username created in step 2a. Also add "myFirstDatabase" to the connection string as shown below.

    ```shell
    mongodb+srv://<username>:<password>@cluster0.jfohhb8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    ```

_Note: This MongoDB connection string is what you should use to update the `DATABASE_URL` variable in the .env file._
  
![pos-connection-string](https://storage.googleapis.com/bigcommerce-production-dev-center/images/POS-connection-string.png)

</details>

## Create local environment file

1. Create a `.env` file in the root directory of your project.
2. Copy the content of `.env-sample` to `.env`.
```bash
cp .env.sample .env
```
At a minimum, the following .env variables need to be updated for the app to sucessfully run.

- `DATABASE_URL`
  - Follow the [Set up Database](#set-up-database) step to get this.
- `BC_STORE_HASH`, `BC_AUTH_TOKEN`, `BC_CHANNEL_ID`, `BC_GQL_URL, `BC_APP_CLIENT_ID`, and `BC_APP_SECRET`
  - Follow the [BigCommerce setup](#bigcommerce-setup) instructions to get these.
- `STRIPE_SECRET_KEY`
  - Follow the [Stripe setup](#stripe-setup) instructions to get these.
  
  
## Create and seed database
  
 1. Once you set up your Mongo Cloud account, create the database and seed it with data by doing the following:

```
  $ npx prisma db push

  $ npm run seed
```

2. Generate a new prisma client using your database provider settings.

```
  $ npx prisma generate
```

  _Note: `npx prisma generate` is what creates the DB tables and initial client. If you miss this step, you'll see errors about prisma missing._

3. Now you'll be able to access this database locally via a visual editor and verify you have created the table correctly.

```
  $ npx prisma studio
```

  _Note: You can also use Mongo Compass as your database GUI. Download and install to connect: [Mongo Compass](https://www.mongodb.com/products/compass)_

4. Run App

```bash
npm run dev
```

Now, the app will be running locally!

Login as an admin role here: http://localhost:3000/signin (the default admin PIN in the seed data is: 1234)

Once logged in, navigate to the "Settings" screen to save your store address. The app uses your store address for checkout tax calculations. You will receive the following error if you do not supply the store address.
  
![pos-missing-store-address](https://storage.googleapis.com/bigcommerce-production-dev-center/images/POS-missing-store-address.jpeg)


## Connecting to a reader in the POS

On the main register screen, press the 'wifi' icon, which will read all of your terminals from Stripe and check if they are active on your network.

Press "Connect" for the active terminal you'd like to use to take payment at checkout.

## Key areas of codebase

- `/backend`
  - Where the auth and various API services live. These are used within the internal API endpoints to keep routes secure and reach out to external APIs.
- `/prisma`
  - Where the DB models and initial seed data live. Prisma uses this to generate DB clients for the app.
- `/shared`
  - Where the types are located.
- `/src/pages`
  - Where the sections of the app are managed.
  - Next.js docs: https://nextjs.org/docs/basic-features/pages
- `/src/pages/api`
  - Where the APIs for the app are managed.
  - Next.js docs: https://nextjs.org/docs/api-routes/introduction
- `/src/providers`
  - Where the context providers used within pages and components live.
  - Most are built using the concept of an 'ActionBuilder' that manages execution, loading status, and data setting consistently.
    - `/{provider}/context.ts`: The types used throughout the provider
    - `/{provider}/index.ts`: The actions available to the pages and components using the context providers
    - `/{provider}/ methods.ts`: The functions used within the actions to fetch / modify data

## Contributing

Want to help expand this foundation? We'd love to collaborate! To kick-off, here's a breakdown of items we've itemized as either potential improvements to the existing codebase or features worth adding.

- Improvements:
  - Improve error handling and types within try/catch in the employee service: backend/services/employee.service.ts
  - Create types for CreatePaymentIntentResponse and CapturePaymentIntentResponse: src/providers/CartProvider/context.ts
  - Move the transaction success screen shown when payment is completed to be its own component: src/components/modules/Orders/TenderDialog.tsx
  - Move numeric entry pad functionality into component: src/components/modules/Orders/TenderCash.tsx
  - Incorporate more graceful error handling for API calls and supply a generic method to show error messages on the FE
  - Add the shared component to handle loading indicators (overall and within buttons)
  - Create types for customer lookup actions in src/providers/CartProvider
  - Utilize the BigCommerce API Client types instead of the custom types (pending release of new client)
  - Prevent loading of the app if environment variables or BigCommerce store setup is invalid, along with instructions on how to fix
- Features:
  - Ship-to-Customer checkout flow (creation / selection of shipping address)
  - Customer management section
  - Recall and finalize the payment on incomplete orders
  - Receipt Printer Hardware Support
  - Barcode Scanner Hardware Support
  - Cash Drawer Support
  - Product Lookup / Search 
  - Basic Loyalty / Gift Card integration
  - Support for Multi-location Inventory, unlocking BOPIS (Buy Online, Pickup in Store)
  - Selection of store currency from the list of transactional currencies active on the POS channel
  - Returns, refunds, and store credit flows
  - Shift Change Operations

## Learn more

### Additional point of sale solutions

Check out the wide variety of POS apps on the [BigCommerce App Marketplace](https://www.bigcommerce.com/apps/in-store/?source=pos-foundation).

### The BigCommerce platform

Looking to help the world's leading brands and the next generation of successful merchants take flight? To learn more about developing on top of the BigCommerce platform, take a look at the following resources:

- [BigCommerce Developer Center](https://developer.bigcommerce.com/?source=pos-foundation) - Learn more about BigCommerce platform features, APIs and SDKs
- [BigDesign](https://developer.bigcommerce.com/big-design/?source=pos-foundation) - An interactive site for BigCommerce's React Components with live code editing
- [Building BigCommerce Apps](https://developer.bigcommerce.com/api-docs/getting-started/building-apps-bigcommerce/building-apps?source=pos-foundation) - Learn how to build apps for the BigCommerce marketplace
