# BigCommerce Point of Sale Foundation

🚀 This open source proof-of-concept app showcases the BigCommerce platform's customizable ability to support point-of-sale transactions.

💰 **Integrated with Stripe Terminal**. Power multiple registers at a single location.

**Data handling by the Prisma ORM and MongoDB Cloud**. Start with boilerplate migrations and seed data to get started customizing the look, feel, or functionality of your POS implementation.


| Register View | Checkout View |
|:-------------:|:-------------:|
| ![App Preview](sample-register-screen.png) | ![App Preview](sample-checkout-screen.png) |

## Core technologies

* Node.js 14.x / npm
* A [BigCommerce (sandbox) store](https://developer.bigcommerce.com/api-docs/partner/getting-started/create-a-sandbox-store?source=pos-foundation)
* A [pre-certified Stripe Terminal EMV card reader](https://stripe.com/terminal)


## Getting started

Find prerequisites, configuration details, and more in the [POS Foundation Guide](https://developer.bigcommerce.com/api-docs/partner/pos-solutions/foundation-guide?source=pos-foundation) at the [BigCommerce Dev Center](https://developer.bigcommerce.com).


## Directory structure highlights

```shell
...
├── backend/
    # Authentication and various API services. The internal API endpoints use these resources to keep routes secure and reach out to external APIs.
├── prisma/ 
    # DB models, migrations, and seed data. Prisma uses these to generate the app's DB client.
├── public/
├── shared/
    # Where the types are located.
└── src/
    ...
    ├── pages/
        # Where the sections of the app are managed.
        # Next.js docs: https://nextjs.org/docs/basic-features/pages
        └── api/
        # Where the APIs for the app are managed.
        # Next.js docs: https://nextjs.org/docs/api-routes/introduction
    └── providers/
        # Where the context providers used within pages and components live.
        # Most providers use a single higher-order 'ActionBuilder' wrapper to execute functions, set data, and update loading status. This pattern minimizes side effects and ensures consistent error handling.  
        └── {NameOfProvider}/
            ├── index.ts        
                # The actions available to the pages and components using the context providers.
            ├── context.ts 
                # The types used throughout the provider.
            └── methods.ts
                # The functions used within the actions to fetch / modify data.

```

## Contributing

Want to help expand this foundation? We'd love to collaborate! You can start with this list of both potential improvements and features worth adding to the existing codebase. You can also check out the [expansion resources](https://developer.bigcommerce.com/api-docs/partner/pos-solutions/foundation-guide?source=pos-foundation#expansion-resources) in our Dev Center's POS Foundation Guide.

### Improvements
  - Improve error handling and types within try/catch in the employee service: backend/services/employee.service.ts
  - Create types for CreatePaymentIntentResponse and CapturePaymentIntentResponse: src/providers/CartProvider/context.ts
  - Move the transaction success screen shown when payment is completed to be its own component: src/components/modules/Orders/TenderDialog.tsx
  - Move numeric entry pad functionality into component: src/components/modules/Orders/TenderCash.tsx
  - Incorporate more graceful error handling for API calls and supply a generic method to show error messages on the FE
  - Add the shared component to handle loading indicators (overall and within buttons)
  - Create types for customer lookup actions in src/providers/CartProvider
  - Utilize the BigCommerce API Client types instead of the custom types (pending release of new client)
  - Prevent loading of the app if environment variables or BigCommerce store setup is invalid, along with instructions on how to fix
### Features
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

### Existing point of sale solutions

Check out the variety of POS apps on the [BigCommerce App Marketplace](https://www.bigcommerce.com/apps/in-store/?source=pos-foundation).

### The BigCommerce platform

Looking to help the world's leading brands and the next generation of successful merchants take flight? To learn more about developing on top of the BigCommerce platform, take a look at the following resources:

- [BigCommerce Dev Center](https://developer.bigcommerce.com/?source=pos-foundation) - Learn more about BigCommerce platform features, APIs and SDKs
- [BigDesign](https://developer.bigcommerce.com/big-design/?source=pos-foundation) - An interactive site for BigCommerce's React Components with live code editing
- [Building BigCommerce Apps](https://developer.bigcommerce.com/api-docs/getting-started/building-apps-bigcommerce/building-apps?source=pos-foundation) - Learn how to build apps for the BigCommerce marketplace
