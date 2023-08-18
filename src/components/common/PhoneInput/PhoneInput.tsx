import React from "react";
import Input, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps extends React.PropsWithChildren {
  value: string;
  onChange: (
    value: string,
    data: {} | CountryData,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  return (
    <Input
      country={"in"}
      specialLabel={"Mobile Number"}
      value={props.value}
      enableSearch
      onChange={props.onChange}
      placeholder="mobileNo Number"
      dropdownClass="!relative !w-full"
      buttonClass="!bg-white"
      containerClass="p-0 mb-2 w-full"
      inputClass="!block !w-full !rounded-sm !py-7"
    />
  );
};

export default PhoneInput;
