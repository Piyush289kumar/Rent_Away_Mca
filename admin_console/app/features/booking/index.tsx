// app/features/booking/index.tsx


"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  useGetAllBookingsQuery,
  useDeleteBookingMutation,
} from "./data/bookingApi";

import { DataTable, BulkActions } from "@/components/crud";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function BookingPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tableInstance, setTableInstance] = React.useState<any>(null);
  const [params] = useSearchParams();

  const search = params.get("search") || "";

  /* ===========================
     API
  =========================== */
  const { data, isLoading } = useGetAllBookingsQuery({
    page,
    limit,
    search,
  });

  const [deleteBooking] = useDeleteBookingMutation();

  const bookings = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  /* ===========================
     DELETE BOOKING
  =========================== */
  const handleDelete = async (booking: any) => {
    await toast.promise(deleteBooking(booking._id).unwrap(), {
      loading: "Deleting booking...",
      success: "Booking deleted successfully!",
      error: "Failed to delete booking.",
    });
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
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
    },

    /* PROPERTY */
    {
      accessorKey: "property.title",
      header: "Property",
      cell: ({ row }) => row.original.property?.title || "—",
    },

    /* GUEST */
    {
      accessorKey: "guest.name",
      header: "Guest",
      cell: ({ row }) => row.original.guest?.name || "—",
    },

    /* CHECK IN */
    {
      accessorKey: "checkIn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Check-In <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.checkIn).toLocaleDateString("en-IN"),
    },

    /* CHECK OUT */
    {
      accessorKey: "checkOut",
      header: "Check-Out",
      cell: ({ row }) =>
        new Date(row.original.checkOut).toLocaleDateString("en-IN"),
    },

    /* TOTAL */
    {
      header: "Total",
      cell: ({ row }) =>
        row.original.pricing?.total
          ? `₹${row.original.pricing.total}`
          : "—",
    },

    /* STATUS */
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color =
          status === "confirmed"
            ? "bg-green-100 text-green-700"
            : status === "cancelled"
            ? "bg-red-100 text-red-700"
            : status === "completed"
            ? "bg-blue-100 text-blue-700"
            : status === "rejected"
            ? "bg-gray-100 text-gray-700"
            : "bg-yellow-100 text-yellow-700";

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium capitalize ${color}`}
          >
            {status}
          </span>
        );
      },
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
        const booking = row.original;

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

              {/* EDIT */}
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/admin/booking/edit/${booking._id}`)
                }
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              {/* DELETE */}
              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.openDeleteDialog(booking)
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

  /* ===========================
     UI
  =========================== */
  return (
    <div className="p-0 space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bookings</h1>

        {/* CREATE BOOKING */}
        <Button onClick={() => navigate("/admin/booking/create")}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </div>

      {tableInstance && (
        <BulkActions table={tableInstance} entityName="booking" />
      )}

      <DataTable
        columns={columns}
        data={bookings}
        isLoading={isLoading}
        searchKey="property.title"
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
          pageSize: limit,
          onPageSizeChange: setLimit,
        }}
        onDelete={handleDelete}
        deleteItemNameKey="_id"
        onTableReady={setTableInstance}
      />
    </div>
  );
}
