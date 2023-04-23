import React, { PropsWithChildren } from "react";
import { useContext } from "~/lib/react";

import Collection from "./Collection";

/** @see https://so-so.dev/react/make-select/ */

/** 컴포넌트 렌더링 시, 고유한 ID 를 부여하기 위한 자유 변수. 컴포너트 외부에 두어 렌더링마다 초기화 되지않도록 한다. */
let selectElementID = 1;

/** 각 컴포넌트는 서로 협력하는 형태를 지닌다. 협력하기 위해서, 상태와 기능을 Context 로 관리한다. */
export type SelectContextValues = {
  /** Select 컴포넌트 고유 ID */
  id: number;

  /** 옵션 리스트 visible 여부 */
  open: boolean;

  /** 선택한 옵션 값 */
  selectedValue: string;

  /** 옵션 리스트를 열고 닫는 기능 */
  onChangeOpen: (open: boolean) => void;

  /** 옵션을 선택하는 기능 */
  onChangeSelectedValue: (selectedValue: string) => void;
};

const SelectContext = React.createContext<SelectContextValues | null>(null);
const useSelectContext = () => useContext(SelectContext)

/** 외부에서 Select 컴포넌트의 기능을 접근할 수 있도록 노출할 Ref 타입 */
export type SelectRefValues = {
  /** 옵션 리스트가 열렸는지 접근할 수 있다. */
  open: boolean;

  /** 선택한 옵션값에 접근할 수 있다. */
  selectedValue: string;

  /** 옵션 리스트를 열고 닫을 수 있다. */
  onChangeOpen: (open: boolean) => void;

  /** 옵션값을 선택할 수 있다. */
  onChangeSelectedValue: (selectedValue: string) => void;
};

type SelectProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    /** 사용자는 옵션 리스트의 visible 초기값을 설정할 수 있다. */
    defaultOpen?: boolean;

    /** 사용자는 선택한 옵션값의 초기값을 설정할 수 있다. */
    defaultSelectedValue?: string;
  }
>;

const Select = React.forwardRef(
  (
    { defaultOpen = false, defaultSelectedValue = "", children, ...props }: SelectProps,
    forwardedRef: React.Ref<SelectRefValues>
  ) => {
    /** props 에 의해 동적으로 초기값이 결정되도록, 함수 형태의 기본값을 사용한다. */
    const [open, setOpen] = React.useState(() => defaultOpen);
    const [selectedValue, setSelectedValue] = React.useState(() => defaultSelectedValue);

    /** Select 컴포넌트들에 고유한 ID 를 부여한다. */
    const [id] = React.useState(() => selectElementID++);

    const handleChangeOpen = React.useCallback((open: boolean) => {
      setOpen(open);
    }, []);

    const handleChangeSelectedValue = React.useCallback((selectedValue: string) => {
      setSelectedValue(selectedValue);
    }, []);

    /** 외부로 기능을 노출한다. */
    React.useImperativeHandle(
      forwardedRef,
      () => ({
        open,
        selectedValue,
        onChangeOpen: handleChangeOpen,
        onChangeSelectedValue: handleChangeSelectedValue,
      }),
      [open, selectedValue]
    );

    return (
      <SelectContext.Provider value={{
        id,
        open,
        selectedValue,
        onChangeOpen: handleChangeOpen,
        onChangeSelectedValue: handleChangeSelectedValue,
      }}>
        <div id={`select-${id}`} {...props}>
          <Collection>{children}</Collection>
        </div>
      </SelectContext.Provider>
    );
  }
);

type TriggerProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    // ...
  }
>;

/** 옵션을 열고 닫는 역할을 담당한다. */
const Trigger = ({ children, ...props }: TriggerProps) => {
  const { id, open } = useSelectContext();

  return (
    <div
      id={`trigger-${id}`}
      /** 스크린 리더에 제어 대상을 명시한다. <OptionList /> 의 ID 와 동일. */
      aria-controls={`option-list-${id}`}
      /**  */
      aria-haspopup="true"
      /**  */
      aria-expanded={open}
      {...props}
    >
      {children}
    </div>
  );
};

type OptionListProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    // ...
  }
>;

/** 옵션들을 렌더링하는 역할을 담당한다. */
const OptionList = ({ children, ...props }: OptionListProps) => {
  const { id, open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      /** 스크린 리더에 레이블의 대상을 명시한다. <TriggerButton /> 의 ID 와 동일. */
      aria-labelledby={`trigger-button-${id}`}
      id={`option-list-${id}`}
      role="listbox"
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 옵션을 렌더링하는 역할을 한다.
 *
 * 1. 선택한 옵션을 활성화(data attributes) 한다.
 * 2. 수동으로 옵션을 선택하도록 할 수 있다. (manual props)
 **/
type OptionProps = PropsWithChildren<
  Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
    value: string;

    /** 옵션 선택을 수동으로 전환한다. (default: false) */
    manual?: boolean;

    onClick?: (value: string) => void;
  }
>;

const Option = ({ value, manual = false, onClick, children, ...props }: OptionProps) => {
  const { id, selectedValue, onChangeSelectedValue } = useSelectContext();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!manual) {
      onChangeSelectedValue(value);
    }

    onClick?.(value);
  };

  return (
    <Collection.Item>
      <div
        key={`option-item-${id}`}
        role="option"
        data-selected={value === selectedValue ? true : false}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    </Collection.Item>
  );
};

export default Object.assign(Select, {}, {
  Trigger,
  OptionList,
  Option
});
