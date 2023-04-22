import React, { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useReactTable, flexRender } from "@tanstack/react-table";

type Props<T> = React.HTMLAttributes<HTMLDivElement> & {
  form: ReturnType<typeof useForm>;
  table: ReturnType<typeof useReactTable<T>>;
  topSlot?: ReactNode;
  bottomSlot?: ReactNode;
};

const ReactHookFormTable = <T,>({
  form,
  table,
  children,
  topSlot: TopSlot,
  bottomSlot: BottomSlot,
  ...props
}: Props<T>) => {
  return (
    <FormProvider {...form}>
      <div {...props}>
        {TopSlot}

        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>

        {BottomSlot}
      </div>
    </FormProvider>
  );
};

export default ReactHookFormTable;
