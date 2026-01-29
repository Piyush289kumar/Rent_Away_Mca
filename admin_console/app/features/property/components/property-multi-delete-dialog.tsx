// app/features/property/components/property-multi-delete-dialog.tsx

"use client";

import type { Table } from "@tanstack/react-table";
import { MultiDeleteDialog } from "@/components/crud/MultiDeleteDialog";
import { useDeletePropertyMutation } from "../data/propertyApi";

type PropertyMultiDeleteDialogProps<TData> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<TData>;
};

export function PropertyMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: PropertyMultiDeleteDialogProps<TData>) {
  const [deleteProperty] = useDeletePropertyMutation();

  return (
    <MultiDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      table={table}
      entityName="property"
      deleteFn={(id) => deleteProperty(id).unwrap()}
    />
  );
}
