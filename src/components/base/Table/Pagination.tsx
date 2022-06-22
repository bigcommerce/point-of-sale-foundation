import React from 'react';

export default function Pagination({ pageList, currentPage, pageCount, onPageChange }) {
  const isFirtsPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  return (
    pageList && pageList.length !== 0 ?
      <div className="relative z-0 inline-flex shadow-sm">
        <div
          onClick={() => !isFirtsPage && onPageChange(currentPage - 1 > 1 ? currentPage - 1 : 1)}
          className={`relative ${isFirtsPage ? 'hidden' : 'inline-flex'} cursor-pointer items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150`}
        >
          Previous
        </div>
        {pageList.map((item, index) => (
          <div
            key={index}
            onClick={() => onPageChange(item.value)}
            className={`${item.value === currentPage ? 'bg-gray-700 text-white' : 'bg-white text-blue-700'} cursor-pointer -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 hover:bg-tertiary`}
          >
            {item.label}
          </div>
        ))}
        <div
          onClick={() => !isLastPage && onPageChange(currentPage + 1 > pageCount ? pageCount : currentPage + 1)}
          className={`cursor-pointer -ml-px relative ${isLastPage ? 'hidden' : 'inline-flex'} items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150`}
        >
          Next
        </div>
      </div>
      : null
  )
};
