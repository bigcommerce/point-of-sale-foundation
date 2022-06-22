import moment from 'moment';
import React from 'react';

const formatDateTime = (str) => {
  return str ? moment(str).format('Do MMMM YYYY') : '';
};

const formatData = (type, data) => {
  let result = data;
  switch (type) {
    case 'date':
      result = formatDateTime(data);
      break;
  }
  return result;
};

export default function RowItem({ columns, data }) {
  return (
    <>
      {columns.map((colItem, index) => (
        <td key={index} className="px-6 py-4">{colItem.renderRow ? colItem.renderRow(data) : formatData(colItem.type, data[colItem.field])}</td>
      ))}
    </>
  )
};
