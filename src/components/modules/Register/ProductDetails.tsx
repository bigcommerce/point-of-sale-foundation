import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProductContext } from "@/frontend/providers/ProductProvider";
import { XIcon, CheckIcon } from "@heroicons/react/outline";
import { useCartContext, CreateCart } from "@/frontend/providers/CartProvider";

const ColorPickerVariant = ({ node, selectedValue, onClick }) => {
  const { entityId: id, displayName, isRequired, values } = node;

  const buttonActiveClassName = "outline outline-2 outline-offset-4 outline-gray-500";
  return (
    <>
      <label className="block mb-3">
        {displayName}: {isRequired ? "(Required)" : ""}
      </label>
      <div className="flex flex-1 flex-wrap w-full mb-4 justify-start gap-y-3 gap-x-2">
        {values.edges.map(({ node: { entityId: value, label, hexColors, imageUrl } }) => {
          if (hexColors && hexColors.length) {
            const colorBlockClassName = hexColors.length === 1 ? "col-span-3" : "col-span-1";

            return (
              <button
                key={`colorpicker-${id}-${value}`}
                className={`w-64 grid grid-cols-3 gap-0 shadow ${
                  value === selectedValue ? buttonActiveClassName : ""
                }`}
                onClick={() => onClick({ id, value, displayName, label })}
              >
                <label className="block col-span-3 h-12 bg-white">{label}</label>
                {hexColors.map(backgroundColor => (
                  <div
                    className={`${colorBlockClassName} h-12 justify-self-stretch`}
                    key={`colorpicker-hex-${id}-${value}`}
                    style={{ backgroundColor }}
                  />
                ))}
              </button>
            );
          } else {
            return (
              <button
                key={`colorpicker-nohex-${id}-${value}`}
                className={`w-64 flex flex-1 justify-start shadow ${
                  value === selectedValue ? buttonActiveClassName : ""
                }`}
                onClick={() => onClick({ id, value, displayName, label })}
              >
                <img className="w-24 h-24 inline-block" src={imageUrl} />
                <label className="inline-block w-full h-full bg-white">{label}</label>
              </button>
            );
          }
        })}
      </div>
    </>
  );
};

const RectangleBoxesVariant = ({ node, selectedValue, onClick }) => {
  const { entityId: id, displayName, isRequired, values } = node;
  const buttonActiveClassName = "outline outline-2 outline-offset-4 outline-gray-500";

  return (
    <div className="mb-4 w-full">
      <label className="block mb-3">
        {displayName} {isRequired ? "(Required)" : ""}
      </label>
      <div className="flex flex-1 flex-wrap w-full justify-start gap-y-3 gap-x-2">
        {values.edges.map(({ node: { entityId: value, label } }) => (
          <button
            key={`box-variant-${id}-${value}`}
            className={`shadow bg-white w-64 px-12 py-8 ${
              value === selectedValue ? buttonActiveClassName : ""
            }`}
            onClick={() => onClick({ id, value, displayName, label })}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const QtyInput = ({ value, onChange }) => {
  return (
    <div className="flex flex-1">
      <button
        key={`product-details-qty_minus-${value}`}
        className="shadow px-12 py-6 m-1 text-green-400 text-2xl select-none"
        onClick={() => (value > 1 ? onChange(value - 1) : null)}
      >
        -
      </button>
      <input className="shadow px-2 py-6 m-1 w-24 text-center" type="text" disabled value={value} />
      <button
        key={`product-details-qty-plus-${value}`}
        className="shadow px-12 py-6 m-1 text-green-400 text-2xl select-none"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
};

const ProductDetails = ({ product }): JSX.Element => {
  const productContext = useProductContext();
  const cartContext = useCartContext();
  const router = useRouter();

  const { entityId, name, defaultImage, productOptions, prices } = product;

  const sku = productContext.state.productWithOptions
    ? productContext.state.productWithOptions.sku
    : null;

  const price =
    productContext.state.productWithOptions &&
    productContext.state.productWithOptions.prices.price.value
      ? productContext.state.productWithOptions.prices.price.value
      : prices.price.value;

  const [catalogProduct, setCatalogProduct] = useState({
    entityId: entityId,
    sku: sku,
    name: name,
    plainTextDescription: null,
    availabilityV2: null,
    brand: null,
    reviewSummary: null,
    defaultImage: defaultImage,
    price: price,
    prices: prices,
    quantity: 1,
    productOptions: productOptions,
    selectedProductOptions: [],
    taxable: true,
    notes: ""
  });
  const selectedProductOptions = [...catalogProduct.selectedProductOptions];
  const displayPrice =
    catalogProduct.quantity > 1
      ? `$${price.toFixed(2)} x ${catalogProduct.quantity} = $${(
          catalogProduct.quantity * price
        ).toFixed(2)}`
      : `$${price.toFixed(2)}`;

  const onCancel = () => {
    router.replace("/register", undefined, { shallow: true });
  };

  const onOptionClick = ({ id, value, displayName, label }) => {
    const currentIndex = selectedProductOptions.findIndex(option => option.id === id);
    if (currentIndex === -1) {
      selectedProductOptions.push({ id, value, displayName, label });
    } else {
      selectedProductOptions[currentIndex].value = value;
    }

    setCatalogProduct({ ...catalogProduct, selectedProductOptions });
  };

  const onAddItemClick = async () => {
    const itemToAdd = { ...catalogProduct };

    // Check if user has selected all options
    if (selectedProductOptions.length == productOptions.edges.length) {
      const cart: CreateCart = {
        line_items: [
          {
            quantity: itemToAdd.quantity,
            product_id: itemToAdd.entityId,
            option_selections: itemToAdd.selectedProductOptions.map(({ id, value }) => ({
              option_id: id,
              option_value: value
            }))
          }
        ]
      };

      if (cartContext.state.cart) {
        // Add to cart if cart exists
        await cartContext.actions.addCartLineItems(cartContext.state.cart.id, cart.line_items);
      } else {
        // Create cart if none exists
        await cartContext.actions.createCart(cart);
      }

      // Close modal
      onCancel();
    }
  };

  useEffect(() => {
    const optionsBody = catalogProduct.selectedProductOptions.map(({ id, value }) => ({
      optionEntityId: id,
      valueEntityId: value
    }));

    productContext.actions.getProductWithOptions(catalogProduct.entityId, optionsBody);
  }, [catalogProduct]);

  return (
    <>
      <div className="fixed z-30 top-0 left-0 w-screen h-screen bg-opaque-400">
        <div className="absolute top-0 left-0 w-2/3 h-screen bg-gray-50 shadow overflow-y-scroll overflow-x-hidden">
          <div className="flex shadow flex-1 justify-between justify-items-stretch m-px">
            <a className="inline-block px-6 py-4" onClick={onCancel}>
              Cancel
            </a>
            <span className="inline-block px-6 py-4 font-bold">
              {name} - {displayPrice}
            </span>
            <a className="inline-block px-6 py-4">&nbsp;</a>
          </div>
          {/* 
          {'<!-- For future use when multiple item tabs are necessary //-->'}
          <div className="flex w-full m-px">
            <a className="block shadow text-center w-1/3 px-12 py-8 m-px">Options</a>
            <a className="block shadow text-center w-1/3 px-12 py-8 m-px bg-gray-100">Note</a>
          </div> */}
          <div className="flex w-full m-px">
            <div className="shadow w-1/2 px-12 py-8 m-px">
              <label>QTY</label>
              <QtyInput
                value={catalogProduct.quantity}
                onChange={quantity => setCatalogProduct({ ...catalogProduct, quantity })}
              />
            </div>
            <div className="shadow flex w-1/2 px-12 py-8 m-px">
              <div className="w-1/2">
                <label className="mb-4">SKU</label>
                <span className="block">{sku}</span>
              </div>
            </div>
          </div>

          <div className="w-full px-8 py-8">
            {productOptions.edges.map(({ node }) => {
              const selectedOption = catalogProduct.selectedProductOptions.find(
                option => node.entityId === option.id
              );

              {
                switch (node.displayStyle) {
                  case "Swatch":
                    return (
                      <ColorPickerVariant
                        key={`color-picker-${node.entityId}`}
                        node={node}
                        selectedValue={selectedOption ? selectedOption.value : ""}
                        onClick={onOptionClick}
                      />
                    );
                  case "RectangleBoxes":
                  case "RadioButtons":
                  case "DropdownList":
                    return (
                      <RectangleBoxesVariant
                        key={`rectangle-boxes-${node.entityId}`}
                        node={node}
                        selectedValue={selectedOption ? selectedOption.value : ""}
                        onClick={onOptionClick}
                      />
                    );
                  default:
                    return <></>;
                }
              }
            })}

            <button
              key={`add-item-${catalogProduct.entityId}`}
              className="w-full mt-6 px-8 py-6 bg-emerald-500 text-xl text-gray-50 rounded"
              onClick={onAddItemClick}
            >
              Add Item
            </button>
          </div>

          {/*<ColorPickerVariant />*/}
          {/*<RectangleBoxesVariant />*/}
          {/*<RadioButtonVariant />*/}
          {/*<DropdownListVariant />*/}
        </div>
      </div>
      <div>
        <p>&nbsp;</p>
        <div>asdasd</div>
      </div>
    </>
  );
};

export default ProductDetails;
