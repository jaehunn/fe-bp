import React, { useRef, useState } from "react";

import Select, { SelectRefValues } from "~/components/Select";

const CollectionTest = () => {
  const firstSelectRef = useRef<SelectRefValues | null>(null);
  const [selectedValue, setSelectedValue] = useState(() => firstSelectRef?.current?.selectedValue ?? "");

  const handleChangeValue = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(value)
  }

  const handleClickOption = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <Select defaultOpen ref={firstSelectRef}>
        <Select.Trigger>
          <input type="text" name="firstInput" value={selectedValue} onChange={handleChangeValue} />
        </Select.Trigger>
        <Select.OptionList>
          <Select.Option value="a" onClick={handleClickOption}>
            A
          </Select.Option>
          <Select.Option value="b" onClick={handleClickOption}>
            B
          </Select.Option>
          <Select.Option value="c" onClick={handleClickOption}>
            C
          </Select.Option>
          <Select.Option value="d" onClick={handleClickOption}>
            D
          </Select.Option>
        </Select.OptionList>
      </Select>
    </div>
  );
};

export default CollectionTest;
