// app/features/property/index.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import {
  useGetPropertiesQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} from "./data/propertyApi";

import { DataTable, BulkActions } from "@/components/crud";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  ArrowUpDown,
  CirclePlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PropertyPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tableInstance, setTableInstance] = React.useState<any>(null);
  const [params] = useSearchParams();

  const filter = params.get("filter") || "all";

  const { data, isLoading } = useGetPropertiesQuery({
    page,
    limit,
    filter,
  });

  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();

  const propertyData = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  /* ===========================
     DELETE PROPERTY
  =========================== */
  const handleDelete = async (item: any) => {
    await toast.promise(deleteProperty(item._id).unwrap(), {
      loading: `Deleting "${item.title}"...`,
      success: `Property "${item.title}" deleted successfully!`,
      error: "Failed to delete property.",
    });
  };

  /* ===========================
     TOGGLE ACTIVE STATUS
  =========================== */
  const handleToggleActive = async (property: any) => {
    try {
      const formData = new FormData();
      formData.append("isActive", String(!property.isActive));

      await updateProperty({
        id: property._id,
        data: formData,
      }).unwrap();

      toast.success(
        `Property "${property.title}" is now ${
          property.isActive ? "Inactive" : "Active"
        }.`,
      );
    } catch {
      toast.error("Failed to update property status.");
    }
  };

  /* ===========================
     TABLE COLUMNS
  =========================== */
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },

    /* COVER IMAGE */
    {
      accessorKey: "coverImage",
      header: "Image",
      cell: ({ row }) =>
        row.original.coverImage ? (
          <img
            src={row.original.coverImage}
            alt={row.original.title}
            className="h-10 w-10 rounded object-cover border"
          />
        ) : (
          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs">
            N/A
          </div>
        ),
    },

    /* TITLE */
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },

    /* TYPE */
    {
      accessorKey: "propertyType",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.propertyType || "—"}</span>
      ),
    },

    /* CAPACITY */
    {
      header: "Capacity",
      cell: ({ row }) => {
        const { guests, bedrooms, beds, bathrooms } = row.original;
        return (
          <div className="text-xs leading-tight">
            <div>👥 {guests ?? 0} guests</div>
            <div>
              🛏 {bedrooms ?? 0} bedrooms · {beds ?? 0} beds
            </div>
            <div>🚿 {bathrooms ?? 0} bathrooms</div>
          </div>
        );
      },
    },

    /* PUBLISHED */
    {
      accessorKey: "isPublished",
      header: "Published",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.original.isPublished
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.isPublished ? "Published" : "Draft"}
        </span>
      ),
    },

    /* PRICE */
    {
      header: "Price / Night",
      cell: ({ row }) =>
        row.original.pricing?.perNight ? (
          `₹${row.original.pricing.perNight}`
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },

    /* ACTIVE */
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => handleToggleActive(row.original)}
        />
      ),
    },

    /* CREATED */
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-IN"),
    },

    /* ACTIONS */
    {
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => {
        const property = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate(`/admin/property/edit/${property._id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.openDeleteDialog(property)
                }
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-0 space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Properties</h1>

        <Button onClick={() => navigate("/admin/property/create")}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {tableInstance && (
        <BulkActions table={tableInstance} entityName="property" />
      )}

      <DataTable
        columns={columns}
        data={propertyData}
        isLoading={isLoading}
        searchKey="title"
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
          pageSize: limit,
          onPageSizeChange: setLimit,
        }}
        onDelete={handleDelete}
        deleteItemNameKey="title"
        onTableReady={setTableInstance}
      />
    </div>
  );
}
