import Link from "next/link";
import { useRouter } from "next/router";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { SlimProduct } from "@/frontend/providers/ProductProvider";

interface ProductTileProps {
  product: SlimProduct;
  index: string;
  onClick?: (product: SlimProduct) => void;
}

const ProductTile = (props: ProductTileProps): JSX.Element => {
  const router = useRouter();
  const { product } = props;
  const {
    entityId,
    name,
    defaultImage,
    prices
  } = product;

  const regularPrice = prices.price;
  const salePrice = prices.salePrice;

  let default_image = "";
  let default_image_alt = "";

  if (!isNullOrUndefined(product.defaultImage)) {
    default_image = !isNullOrUndefined(defaultImage.url1280wide) ? defaultImage.url1280wide : "";
    default_image_alt = isNullOrUndefined(defaultImage.altText) ? defaultImage.altText : "";
  }

  return (
    <Link
      href={{
        pathname: "/register",
        query: { ...router.query, productId: entityId }
      }}
      shallow={true}
    >
      <a className={`block h-40 w-1/4 p-px`}>
        <div className="relative w-full h-full bg-white shadow overflow-hidden z-0">
          <img src={default_image} alt={default_image_alt} className="h-full mx-auto" />
          <div className="absolute z-0 bottom-0 bg-gray-50 bg-opacity-70 w-full px-2">
            <p className="font-bold text-gray-800">{name}</p>
            {salePrice && salePrice.value ? (
              <span className="text-gray-600 text-right">
                <span className="text-gray-700 font-bold">${salePrice.value.toFixed(2)} </span>
                <span className="text-gray-500 line-through">${regularPrice.value.toFixed(2)}</span>
              </span>
            ) : (
              <span className="text-gray-700 text-right">${regularPrice.value.toFixed(2)}</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductTile;
