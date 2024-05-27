import "./datapicker.scss";
import { DateObject } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";

const CRangePicker = ({ value, onChange }) => {
  return (
    <DatePicker
      format={"DD MMMM YYYY"}
      placeholder="click to open"
      value={value}
      onChange={onChange}
      range
      dateSeparator=" - "
      portal
      render={<InputIcon />}
      numberOfMonths={2}
      zIndex={10000}
    />
  );
};

export default CRangePicker;
