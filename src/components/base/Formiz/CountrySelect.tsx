import { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const CountrySelect = (): JSX.Element => {
  const [selectValue, setSelectValue] = useState<string>("");
  const options = useMemo(() => countryList().getData(), []);

  const onCountryChange = value => {
    setSelectValue(value);
  };

  return (
    <Select
      options={options}
      classNamePrefix="country-select"
      defaultInputValue="United States"
      value={selectValue}
      onChange={onCountryChange}
    />
  );
};

export default CountrySelect;
