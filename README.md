# BigCommerce Point of Sale Foundation

🚀 An open sourced POS showcasing how custom in-store apps could be built using the BigCommerce platform.

💰 **Pre-integrated into Stripe Terminal**, including connection to multiple terminals at a single location.

| Register Screen                          | Checkout Screen                              |
| ---------------------------------------- | -------------------------------------------- |
| ![App Preview](sample-register-screen.png) | ![App Preview](sample-checkout-screen.png) |

## Getting Started

#### 1) Create Local Environment File

```bash
cp .env.sample .env
```

At a minimum, the following .env variables need to be updated for the app to sucessfully run.

- `DATABASE_URL`
  - Follow the "Set up Database" step below to get this.
- `BC_STORE_HASH`, `BC_AUTH_TOKEN`, `BC_CHANNEL_ID`, and `BC_GQL_URL`
  - Follow the BigCommerce setup instructions below to get these.
- `STRIPE_SECRET_KEY`
  - Follow the Stripe setup instructions below to get these.

#### 2) Install App Dependencies

_We recommend using node v14.17.0_

```bash
npm install
```

#### 3) Set up Database

This app works with MongoDB. The `provider` setting in the `/prisma/schema.prisma` should be set to `mongodb`. We highly recommend using MongoDB, but if you would like to use another type of database, you will need to udpate the configuration to work with the database of your choice. View the available database options here: https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources/)

Update the `DATABASE_URL` var in `/prisma/.env` to match your new DB connection string generated from Mongo Cloud ( https://cloud.mongodb.com ).

<details>

  <summary>Guide on setting up Mongo Cloud</summary>

1. Click [here](https://account.mongodb.com/) and log in there, if you dont have an account you can click [SignUp](https://account.mongodb.com/account/register)

![image](https://user-images.githubusercontent.com/97689831/162502166-403b587e-45be-426c-8add-a19d9430f4fb.png)

2. After you sign in you see a page like bellow and click `Database Access` on left hand sidebar.

![image](https://user-images.githubusercontent.com/97689831/162502250-8c3f1c31-9280-4e4a-8885-838b2d6ee814.png)

3. From there click on "ADD NEW DATABASE USER" and fill username and password and leave all fields as it is.

![image](https://user-images.githubusercontent.com/97689831/162502286-69166d23-b43c-4850-af62-07ba0c6fc728.png)

4. Then click `Network Access` on left hand sidebar,

![image](https://user-images.githubusercontent.com/97689831/162502337-d37e42ff-c056-4832-b152-d6b70304d2a2.png)

5. From there click on "ADD IP ADDRESS" and in popup modal click on "ADD CURRENT IP ADDRESS" button

![image](https://user-images.githubusercontent.com/97689831/162502373-f48558c9-f59f-4ad7-9901-1edf13c7fe60.png)

6. Then click `Database` on left hand sidebar, which opens the first page when you logged in

![image](https://user-images.githubusercontent.com/97689831/162502533-38603784-b46f-42e3-ae1c-1d0a2167f836.png)

7. And Click "Connect" button in your running cluster

![image](https://user-images.githubusercontent.com/97689831/162502486-91dc1545-ea98-45db-844c-9b6fa5e9de1e.png)

8. Then Click "Connect your application" button in the popup modal

![image](https://user-images.githubusercontent.com/97689831/162502592-b89a0ec7-e60f-4184-9b39-db836404c129.png)

9. Then you can see MongoDB connection string in 2nd section, replace <username> and <password> with one of the user you created in 3rd step and just copy it.

![image](https://user-images.githubusercontent.com/97689831/162502665-6bb82bc6-9557-428b-a8e8-3cac7dd56bdb.png)

That's your MongoDB connection string which you should use as `DATABASE_URL` in .env

</details>

Once your Mongo Cloud account is setup, you are going to want to create the database in your new Mongo Cloud account and seed it with data:

```
  $ npx prisma db push

  $ npm run seed
```

Then you need to generate a new prisma client using your database provider settings.

```
  $ npx prisma generate
```

_Note: `npx prisma generate` is what creates the DB tables and initial client. If you miss this step, you'll see errors about prisma missing._

Now you'll be able to access this database locally via a visual editor and verify the table have been created.

```
  $ npx prisma studio
```

You can also use Mongo Compass as your database GUI. Download and install to connect: [Mongo Compass](https://www.mongodb.com/products/compass)

#### 4) Run App

```bash
npm run dev
```

Now, the app will be running locally!

Login as an admin role here: http://localhost:3000/signin (the default admin PIN in the seed data is: 1234)

Once logged in, navigate to the Settings screen to save your store address. This is the address that will be used for your checkout tax calculations.

## BigCommerce Setup

1. Create BigCommerce store: go to [https://www.bigcommerce.com/essentials/](https://www.bigcommerce.com/essentials/?source=pos-foundation) and signup for a free trial if you don't have one

2. The Bigcommerce store you are connected to must have "Pickup in Store" as a shipping option for orders to be created on the POS. Go to "Store Setup -> Shipping" in your admin to turn it on.

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

## Stripe Setup

1. Go to your Stripe dashboard: https://dashboard.stripe.com/test/developers
2. Copy the Stripe secret key and add to your .env file
3. Go to 'More > Terminal' in the dashboard. Press 'Get Started' when asked to activate the Terminal section.
4. Add a location, then click on the location row to manage details.
5. Add a new reader to the location.

## Connecting to a reader in the POS

When on the main register screen, press the 'wifi' icon, which will read all of your terminals from Stripe and check if they are active on your network.

Press 'Connect' for the active terminal you'd like to use to take payment at checkout.

## Key areas of codebase

- `/backend`
  - Where the auth and various API services live. These are uses within the internal API endpoints to keep routes secure and reach out to external APIs.
- `/prisma`
  - Where the DB models and initial seed data lives. Prisma uses this to generate DB clients for the app.
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
  - Most are built using the concept of an 'ActionBuilder' that manages execution, loading status, and data setting in a consistent manner.
    - `/{provider}/context.ts`: The types used througout the provider
    - `/{provider}/index.ts`: The actions available to the pages and components using the context providers
    - `/{provider}/ methods.ts`: The functions used within the actions to fetch / modify data

## Contributing

Want to help expand this foundation? We'd love to collaborate! To kick off, here's a breakdown of items we've itemized as either potential improvements to the existing codebase or features worth adding.

- Improvements:
  - Improve error handling and types within try/catch in the employee service: backend/services/employee.service.ts
  - Create types for CreatePaymentIntentResponse and CapturePaymentIntentResponse: src/providers/CartProvider/context.ts
  - Move transaction success screen shown when payment is completed to be it's own component: src/components/modules/Orders/TenderDialog.tsx
  - Move numeric entry pad functionality into component: src/components/modules/Orders/TenderCash.tsx
  - Incorporate more graceful error handling for API calls and supply a generic method to show error messages on the FE
  - Add shared component to handle loading indicators (overall and within buttons)
  - Create types for customer lookup actions in src/providers/CartProvider
  - Utilize the BigCommerce API Client types instead of the custom types (pending release of new client)
  - Prevent loading of app if environment variables or BigCommerce store setup is invalid, along with instructions on how to fix
- Features:
  - Ship-to-Customer checkout flow (creation / selection of shipping address)
  - Customer management section
  - Recall and finalize payment on incomplete orders
  - Receipt Printer Hardware Support
  - Barcode Scanner Hardware Support
  - Cash Drawer Support
  - Product Lookup / Search 
  - Basic Loyalty / Gift Card integration
  - Support for Multi-location Inventory, unlocking BOPIS (Buy Online, Pickup in Store)
  - Selection of store currency from list of transactional currencies active on the POS channel
  - Returns, refunds and store credit flows
  - Shift Change Operations

## Learn More

### Additional Point of Sale Solutions

Check out the wide variety of POS apps on the [BigCommerce App Marketplace](https://www.bigcommerce.com/apps/in-store/?source=pos-foundation).

### The BigCommerce Platform

Looking to help the world's leading brands and the next generation of successful merchants take flight? To learn more about developing on top of the BigCommerce platform, take a look at the following resources:

- [BigCommerce Developer Center](https://developer.bigcommerce.com/?source=pos-foundation) - Learn more about BigCommerce platform features, APIs and SDKs
- [BigDesign](https://developer.bigcommerce.com/big-design/?source=pos-foundation) - An interactive site for BigCommerce's React Components with live code editing
- [Building BigCommerce Apps](https://developer.bigcommerce.com/api-docs/getting-started/building-apps-bigcommerce/building-apps?source=pos-foundation) - Learn how to build apps for the BigCommerce marketplace
