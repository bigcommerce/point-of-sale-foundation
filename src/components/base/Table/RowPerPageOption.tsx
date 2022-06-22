import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function RowPerPageOption({onchange}) {
  const [option, setOption] = useState({ value: 10, label: '10' });

  const handleOnChange = (newValue) => {
    setOption(newValue);
  };

  useEffect(() => {
    if(onchange) {
      onchange(option.value);
    }
  }, [option]);

  return (
    <div>
      <Select
        id="limit"
        name="limit"
        options={[
          { value: 10, label: '10' },
          { value: 20, label: '20' },
          { value: 30, label: '30' },
          { value: 50, label: '50' },
          { value: 100, label: '100' },
        ]}
        defaultValue={{ value: 10, label: '10' }}
        value={option}
        onChange={handleOnChange}
      />
    </div>
  )
};
