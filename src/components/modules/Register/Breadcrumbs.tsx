import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Breadcrumbs = ({ categories, breadcrumbs }) => {
  const router = useRouter();
  const categoryTabs = breadcrumbs.length
    ? breadcrumbs[breadcrumbs.length - 1].children
    : categories;
  const breadcrumbDynamicClasses = breadcrumbs.length ? "mt-0" : "-mt-12";
  const categoryTabsDynamicClasses =
    breadcrumbs.length && !breadcrumbs[breadcrumbs.length - 1].children.length ? "-mt-12" : "mt-0";
  const categoryStyle = "relative block h-40 w-1/4 p-px ring-2 ring-white ring-inset";
  const categoryNameStyle = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl";
  return (
    <>
      <div
        className={`relative z-10 flex justify-start w-full mb-px px-0 py-2 ${breadcrumbDynamicClasses} transition-all bg-gray-50 shadow`}
      >
        <Link
          href={{
            pathname: "/register",
            query: { ...router.query, categoryId: undefined }
          }}
          shallow={true}
        >
          <a className="flex flex-nowrap items-center pl-8 underline navigation-carrot">
            <span className="text-xl inline-block">Shop All</span>
          </a>
        </Link>
        {breadcrumbs.map(category => (
          <Link
            key={category.entityId}
            href={{
              pathname: "/register",
              query: { ...router.query, categoryId: category.entityId }
            }}
            shallow={true}
          >
            <a className="flex flex-nowrap items-center pl-8 underline navigation-carrot">
              <span className="text-xl inline-block">{category.name}</span>
            </a>
          </Link>
        ))}
      </div>
      <div
        className={`relative z-0 flex flex-wrap justify-start w-full mb-px bg-gray-50 ${categoryTabsDynamicClasses} border-2 border-slate-100 transition-all`}
      >
        {categoryTabs.map((category, index) => (
          <Link
            key={category.entityId}
            href={{
              pathname: "/register",
              query: { ...router.query, categoryId: category.entityId }
            }}
            shallow={true}
          >
            <a
              className={
                index % 2 ? `${categoryStyle} bg-stone-500` : `${categoryStyle} bg-orange-200`
              }
            >
              <span
                className={
                  index % 2 ? `${categoryNameStyle} text-white` : `${categoryNameStyle} text-slate`
                }
              >
                {category.name}
              </span>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};
export default Breadcrumbs;
