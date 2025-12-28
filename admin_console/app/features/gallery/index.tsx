// app/features/gallery/index.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  useGetGalleriesQuery,
  usePartiallyUpdateGalleryMutation,
  useDeleteGalleryMutation,
} from "./data/galleryApi";
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
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GalleryPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [tableInstance, setTableInstance] = React.useState<any>(null);

  // ✅ Fetch all galleries (paginated)
  const { data, isLoading } = useGetGalleriesQuery({ page, limit });
  const [toggleGalleryStatus] = usePartiallyUpdateGalleryMutation();
  const [deleteGallery] = useDeleteGalleryMutation();

  const galleryData = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  // ✅ Delete handler
  const handleDelete = async (item: any) => {
    await toast.promise(deleteGallery(item._id).unwrap(), {
      loading: `Deleting "${item.title}"...`,
      success: `Gallery "${item.title}" deleted successfully!`,
      error: "Failed to delete gallery.",
    });
  };

  // ✅ Toggle active status
  const handleToggleActive = async (gallery: any) => {
    try {
      await toggleGalleryStatus({
        id: gallery._id,
        data: { isActive: !gallery.isActive },
      }).unwrap();
      toast.success(
        `Gallery "${gallery.title}" has been ${
          gallery.isActive ? "deactivated" : "activated"
        }.`
      );
    } catch {
      toast.error("Failed to update gallery status.");
    }
  };

  // ✅ Define table columns
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

    /* ================= IMAGE / THUMBNAIL ================= */
    {
      accessorKey: "thumbnail",
      header: "Media",
      cell: ({ row }) =>
        row.original.thumbnail ? (
          <img
            src={row.original.thumbnail}
            alt={row.original.title}
            className="h-10 w-10 rounded object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
            <ImageIcon className="h-4 w-4 opacity-60" />
          </div>
        ),
    },

    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },

    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category?.name || "-",
    },

    /* ================= NEW STATS FIELDS ================= */
    {
      header: "❤️ Likes",
      cell: ({ row }) => row.original.stats?.likes ?? 0,
    },
    {
      header: "⭐ Favorites",
      cell: ({ row }) => row.original.stats?.favorites ?? 0,
    },
    {
      header: "⬇ Downloads",
      cell: ({ row }) => row.original.stats?.downloads ?? 0,
    },
    {
      header: "🔗 Shares",
      cell: ({ row }) => row.original.stats?.shares ?? 0,
    },
    {
      header: "👁 Views",
      cell: ({ row }) => row.original.stats?.views ?? 0,
    },

    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Active
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => handleToggleActive(row.original)}
        />
      ),
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-IN"),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => {
        const gallery = row.original;
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
                onClick={() => navigate(`/admin/gallery/edit/${gallery._id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  (table.options.meta as any)?.openDeleteDialog(gallery)
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
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <Button onClick={() => navigate("/admin/gallery/create")}>
          <CirclePlus className="mr-2 h-4 w-4" /> Add Gallery
        </Button>
      </div>

      {tableInstance && (
        <BulkActions table={tableInstance} entityName="gallery" />
      )}

      <DataTable
        columns={columns}
        data={galleryData}
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
