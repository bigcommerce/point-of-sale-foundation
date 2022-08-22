# BigCommerce Point of Sale Foundation

🚀 This open-sourced POS showcases how custom in-store apps could be built using the BigCommerce platform.

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

Head to the [POS Foundation](/api-docs/partner/pos-solutions/foundation-guide) article to begin!  


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
    - `/{provider}/context.ts`: The types used throughout the provider.
    - `/{provider}/index.ts`: The actions available to the pages and components using the context providers.
    - `/{provider}/ methods.ts`: The functions used within the actions to fetch / modify data.

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
