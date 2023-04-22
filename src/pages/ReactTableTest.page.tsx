import React, { useState, useEffect, MouseEventHandler } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./index.css";

import ReactHookFormTable from "~/components/ReactHookFormTable";
import {
  PRODUCT,
  TABLE_VALIDATION_SCEMA,
} from "~/components/ReactTable.constant";

type ProductValues = Partial<typeof PRODUCT>;

const ReactTableTest = () => {
  const [data, setData] = useState<ProductValues[]>(() => []);

  const useFormProps = useForm<{ [K: string]: ProductValues }>({
    resolver: yupResolver(TABLE_VALIDATION_SCEMA),
  });
  const { register } = useFormProps;

  const columnHeader = createColumnHelper<ProductValues>();
  const { accessor } = columnHeader;
  const columns = [
    accessor("id", {
      id: "id",
      header: () => <div>{PRODUCT["id"]}</div>,
      cell: (ctx) => (
        <div>
          <input
            defaultValue={ctx.getValue()}
            {...register(`${ctx.row.index}.id`)}
          />
        </div>
      ),
    }),
    accessor("name", {
      id: "name",
      header: () => <div>{PRODUCT["name"]}</div>,
      cell: (ctx) => (
        <div>
          <input
            defaultValue={ctx.getValue()}
            {...register(`${ctx.row.index}.name`)}
          />
        </div>
      ),
    }),
    accessor("price", {
      id: "price",
      header: () => <div>{PRODUCT["price"]}</div>,
      cell: (ctx) => (
        <div>
          <input
            defaultValue={ctx.getValue()}
            {...register(`${ctx.row.index}.price`)}
          />
        </div>
      ),
    }),
    accessor("createdAt", {
      id: "createdAt",
      header: () => <div>{PRODUCT["createdAt"]}</div>,
      cell: (ctx) => (
        <div>
          <input
            defaultValue={ctx.getValue()}
            {...register(`${ctx.row.index}.createdAt`)}
          />
        </div>
      ),
    }),
  ];

  const useReactTableProps = useReactTable({
    data,
    columns,

    /** 무슨 속성이지? */
    getCoreRowModel: getCoreRowModel(),
  });

  const handleClickAdButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log(useFormProps.getValues());

    alert("광고 되었습니다.");
  };

  useEffect(() => {
    // fetch data
    setData([
      {
        id: "0",
        name: "나이키 에어포스",
        price: "120",
        createdAt: "2022-03-16",
      },
      {
        id: "1",
        name: "반스 올드스쿨",
        price: "200",
        createdAt: "2022-04-10",
      },
      {
        id: "2",
        name: "나이키 에어포스",
        price: "150",
        createdAt: "2022-02-11",
      },
      {
        id: "3",
        name: "살로몬 XT-6",
        price: "300",
        createdAt: "2022-01-17",
      },
    ]);
  }, []);

  return (
    <div>
      <ReactHookFormTable
        form={useFormProps}
        table={useReactTableProps}
        topSlot={<div>총 {data?.length ?? 0}개</div>}
        bottomSlot={
          <div>
            <button onClick={handleClickAdButton}>AD</button>
          </div>
        }
      />
    </div>
  );
};

export default ReactTableTest;
