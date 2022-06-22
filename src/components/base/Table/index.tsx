import React, { useEffect, useState } from 'react';
import BaseLoader from '@/frontend/components/base/Loader';
import RowPerPageOption from '@/frontend/components/base/Table/RowPerPageOption';
import Pagination from '@/frontend/components/base/Table/Pagination';
import RowItem from '@/frontend/components/base/Table/RowItem';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

export default function Table({ columns, dataSource, loading }) {
  const [data, setData] = React.useState([]);
  const [paging, setPaging] = useState({
    page: 1,
    pageCount: 10,
  });
  const [sortOption, setSortOption] = useState({
    sort: '',
    order: '',
  });
  const [limit, setLimit] = useState(10);
  const totalPage = Math.ceil(data.length / paging.pageCount);
  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (data && sortOption.order) {
      const newData = sortRows(data);
      setData(newData);
    }
  }, [sortOption.order]);

  useEffect(() => {
    const startIndex = paging.page * limit - limit;
    const endIndex = startIndex + limit;
    const newData = dataSource.slice(startIndex, endIndex);
    setData(newData);
  }, [paging.page, limit]);

  const handleSortChange = (key) => {
    if (sortOption) {
      let order = 'asc';
      if (sortOption && sortOption.sort === key && sortOption.order === 'asc') {
        order = 'desc';
      }
      setSortOption({ ...sortOption, sort: key, order: order });
    }
  };

  const handleTextSortChange = (key, sorting) => {
    if (sorting) {
      handleSortChange(key);
    }
  };

  const sortRows = (data) => {
    const sortItems = [...data];
    sortItems.sort((a, b) => {
      if (a[sortOption.sort] < b[sortOption.sort]) {
        return sortOption.order === 'asc' ? -1 : 1;
      }
      if (a[sortOption.sort] > b[sortOption.sort]) {
        return sortOption.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortItems;
  };

  const generatePaginationList = () => {
    let result = [];
    if (totalPage - paging.page < 5) {
      while (totalPage - result.length >= 1 && result.length <= 5) {
        const pageValue = totalPage - result.length;
        result.unshift({ label: pageValue, value: pageValue });
      }
    } else {
      result = [
        { label: paging.page, value: paging.page },
        { label: paging.page + 1, value: paging.page + 1 },
        { label: '...', value: paging.page + 2 },
      ]
    }

    return result;
  };

  const onChangeRowPerPageOption = (value) => {
    setLimit(value);
  };

  const handlePageChange = (newPage) => {
    if (!setPaging) return;
    if (newPage != paging.page) {
      setPaging({ page: newPage, pageCount: paging.pageCount });
    }
  };

  const SortIcon = sortOption && sortOption.order === 'asc' ? ChevronDownIcon : ChevronUpIcon;

  return (
    <div className="h-screen">
      <div className="h-12 flex justify-end items-center">
        <Pagination
          pageList={generatePaginationList()}
          onPageChange={(newPage) => {
            handlePageChange(newPage)
          }}
          currentPage={paging.page}
          pageCount={generatePaginationList().length}
        />
        <div className="ml-2">
          <RowPerPageOption onchange={onChangeRowPerPageOption} />
        </div>
      </div>
      <table className="w-full text-sm text-left h-fit">
        <thead className="text-xs ">
          <tr>
            {columns.map((value, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3"
                onClick={() =>
                  handleTextSortChange(
                    value.field,
                    value.sorting
                  )
                }
              >
                <div className={`inline-flex relative group ${value.sorting ? 'cursor-pointer' : ''}`}>
                  <p className="group-hover:text-indigo-400">{value.headerName}</p>
                  <div className={`absolute top-0.5 -right-4 ${sortOption.sort === value.field ? 'block' : 'hidden'}`}>
                    <SortIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-700" />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && <tr className="text-center"><td colSpan={10}><BaseLoader /></td></tr>}
          {loading ? (
            <></>
          ) : !data || data.length === 0 ? (
            <tr className="text-center">
              <td colSpan={10} className="p-8 m-4">No data</td>
            </tr>
          ) : (
            data.map((rowItem, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-200">
                <RowItem columns={columns} data={rowItem} />
              </tr>
            )))}
        </tbody>
      </table>
    </div>
  )
};
