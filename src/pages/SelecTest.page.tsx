import React, { useRef, useState } from "react";

import Select, { SelectRefValues } from "~/components/Select";

const SelectTest = () => {
  const firstSelectRef = useRef<SelectRefValues | null>(null);
  const [selectedValue, setSelectedValue] = useState(() => firstSelectRef?.current?.selectedValue ?? "");

  const handleChangeValue = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(value)
  }

  const handleClickTriggerButton = () => {
    if (!firstSelectRef?.current) return;

    const { open, onChangeOpen } = firstSelectRef.current

    onChangeOpen(!open)
  }

  const handleClickOption = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <Select defaultOpen ref={firstSelectRef}>
        <Select.Trigger>
          <input type="text" name="firstInput" value={selectedValue} onChange={handleChangeValue} />
          <button type="button" onClick={handleClickTriggerButton}>옵션을 열고 닫습니다.</button>
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

export default SelectTest;
