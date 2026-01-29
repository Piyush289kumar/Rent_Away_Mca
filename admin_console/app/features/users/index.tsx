// app/features/users/index.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "./data/usersApi";

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

export default function UsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tableInstance, setTableInstance] = React.useState<any>(null);
  const [params] = useSearchParams();

  const search = params.get("search") || "";

  /* ===========================
     API
  =========================== */
  const { data, isLoading } = useGetUsersQuery({
    page,
    limit,
    search,
  });

  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  /* ===========================
     DELETE USER
  =========================== */
  const handleDelete = async (user: any) => {
    await toast.promise(deleteUser(user._id).unwrap(), {
      loading: `Deleting "${user.name}"...`,
      success: `User "${user.name}" deleted successfully!`,
      error: "Failed to delete user.",
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

    /* AVATAR */
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) =>
        row.original.avatar ? (
          <img
            src={row.original.avatar}
            alt={row.original.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
            N/A
          </div>
        ),
    },

    /* NAME */
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },

    /* EMAIL */
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.email}</span>
      ),
    },

    /* ROLE */
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize ${
            row.original.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {row.original.role}
        </span>
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
        const user = row.original;

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
                onClick={() => navigate(`/admin/users/edit/${user._id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.openDeleteDialog(user)
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
        <h1 className="text-2xl font-semibold">Users</h1>

        <Button onClick={() => navigate("/admin/users/create")}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {tableInstance && (
        <BulkActions table={tableInstance} entityName="user" />
      )}

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchKey="name"
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
          pageSize: limit,
          onPageSizeChange: setLimit,
        }}
        onDelete={handleDelete}
        deleteItemNameKey="name"
        onTableReady={setTableInstance}
      />
    </div>
  );
}
