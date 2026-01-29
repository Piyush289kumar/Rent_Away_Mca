// app/features/users/components/form.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} from "../data/usersApi";

import { useFileUpload } from "@/hooks/use-file-upload";

/* ---------------------------------------------
      VALIDATION
--------------------------------------------- */
const validate = (values: any, isEdit: boolean) => {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!isEdit && !values.password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
};

export default function UserForm({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || !!id;

  /* ---------------------------------------------
        API
  --------------------------------------------- */
  const { data, isLoading } = useGetUserByIdQuery(id!, {
    skip: !isEdit,
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  /* ---------------------------------------------
        STATE
  --------------------------------------------- */
  const [values, setValues] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "customer",
    avatar: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------------------------------------
        AVATAR UPLOAD
  --------------------------------------------- */
  const [{ files }, handlers] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
  });

  const avatarPreview = files[0]?.preview || values.avatar;

  /* ---------------------------------------------
        PREFILL (EDIT MODE)
  --------------------------------------------- */
  useEffect(() => {
    if (!data?.data) return;
    const u = data.data;

    setValues((prev: any) => ({
      ...prev,
      name: u.name || "",
      email: u.email || "",
      role: u.role || "customer",
      avatar: u.avatar || null,
    }));
  }, [data]);

  /* ---------------------------------------------
        SUBMIT
  --------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate(values, isEdit);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((m) => toast.error(m));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("email", values.email.trim());
      formData.append("role", values.role);

      if (values.password?.trim()) {
        formData.append("password", values.password);
      }

      if (files[0]?.file instanceof File) {
        formData.append("avatar", files[0].file);
      }

      if (isEdit) {
        await updateUser({ id: id!, data: formData }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully");
      }

      navigate("/admin/users");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  function Field({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">{label}</Label>
        {children}
      </div>
    );
  }

  /* ---------------------------------------------
        UI
  --------------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 max-w-xl">
      <h1 className="text-3xl font-semibold">
        {isEdit ? "Edit User" : "Create User"}
      </h1>

      {/* BASIC INFO */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field label="Full Name">
            <Input
              value={values.name}
              onChange={(e) =>
                setValues({ ...values, name: e.target.value })
              }
            />
          </Field>

          <Field label="Email Address">
            <Input
              type="email"
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
            />
          </Field>

          {!isEdit && (
            <Field label="Password">
              <Input
                type="password"
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </Field>
          )}

          <Field label="Role">
            <select
              className="border rounded px-3 py-2"
              value={values.role}
              onChange={(e) =>
                setValues({ ...values, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
        </CardContent>
      </Card>

      {/* AVATAR */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          {avatarPreview ? (
            <div className="relative h-32 w-32">
              <img
                src={avatarPreview}
                className="h-full w-full rounded-full object-cover"
                alt="Avatar"
              />
              <button
                type="button"
                onClick={() => handlers.clearFiles()}
                className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full p-1"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handlers.openFileDialog}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Avatar
            </Button>
          )}
          <input {...handlers.getInputProps()} className="sr-only" />
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? "Save Changes" : "Create User"}
      </Button>
    </form>
  );
}
