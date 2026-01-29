// app/features/property/components/form.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, UploadIcon, XIcon, Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetPropertyByIdQuery,
} from "../data/propertyApi";

import { RichTextEditor } from "@/components/crud/RichTextEditor";

/* ---------------------------------------------
      VALIDATION
--------------------------------------------- */
const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, "")
    .trim();

const validate = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length < 10) {
    errors.title = "Title must be at least 10 characters.";
  } else if (values.title.trim().length > 150) {
    errors.title = "Title cannot exceed 150 characters.";
  }

  if (!stripHtml(values.description)) {
    errors.description = "Description is required.";
  }

  const perNight = Number(values.pricing.perNight);
  if (!values.pricing.perNight || Number.isNaN(perNight) || perNight <= 0) {
    errors.perNight = "Price per night must be greater than 0.";
  }

  return errors;
};

export default function PropertyForm({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || !!id;

  /* ---------------------------------------------
        QUERIES
  --------------------------------------------- */
  const { data, isLoading } = useGetPropertyByIdQuery(id!, {
    skip: !isEdit,
  });

  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();

  /* ---------------------------------------------
        STATE
  --------------------------------------------- */
  const [values, setValues] = useState<any>({
    title: "",
    description: "",
    propertyType: "apartment",

    /* 👥 Capacity */
    guests: "1",
    bedrooms: "0",
    beds: "1",
    bathrooms: "0",

    /* 💰 Pricing */
    pricing: {
      perNight: "",
      perWeek: "",
      perMonth: "",
      cleaningFee: "",
      serviceFee: "",
      currency: "INR",
    },

    /* ⭐ Rating (readonly usually) */
    rating: {
      avg: 0,
      count: 0,
    },

    /* 📝 House Rules */
    houseRules: {
      smoking: false,
      pets: false,
      parties: false,
      checkInTime: "",
      checkOutTime: "",
    },

    amenities: "",
    coverImage: null,
    gallery: [],

    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },

    isActive: true,
    isPublished: false,
    isFeatured: false,
  });

  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------------------------------------
        FILE UPLOADS
  --------------------------------------------- */
  const [
    { files: thumbFiles, isDragging: thumbDrag, errors: thumbErrors },
    thumbHandlers,
  ] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
  });

  const [{ files: galleryFiles }, galleryHandlers] = useFileUpload({
    accept: "image/*",
    multiple: true,
  });

  const thumbPreview = thumbFiles[0]?.preview || values.coverImage || null;

  const galleryPreviews = [
    ...(values.gallery || []),
    ...galleryFiles.map((f) => f.preview),
  ];

  /* ---------------------------------------------
        PREFILL
  --------------------------------------------- */
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;

    setValues((prev: any) => ({
      ...prev,
      ...p,
      amenities: (p.amenities || []).join(", "),
      pricing: {
        perNight: p.pricing?.perNight != null ? String(p.pricing.perNight) : "",
        cleaningFee:
          p.pricing?.cleaningFee != null ? String(p.pricing.cleaningFee) : "",
        serviceFee:
          p.pricing?.serviceFee != null ? String(p.pricing.serviceFee) : "",
      },
      seo: {
        metaTitle: p.seo?.metaTitle || "",
        metaDescription: p.seo?.metaDescription || "",
        metaKeywords: (p.seo?.metaKeywords || []).join(", "),
      },
    }));
  }, [data]);

  /* ---------------------------------------------
        SUBMIT
  --------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate(values);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      /* ───────── BASIC ───────── */
      formData.append("title", values.title.trim());
      formData.append("description", values.description);
      formData.append("propertyType", values.propertyType);

      /* ───────── CAPACITY ───────── */
      ["guests", "bedrooms", "beds", "bathrooms"].forEach((key) => {
        formData.append(key, String(values[key]));
      });

      /* ───────── PRICING ───────── */
      Object.entries(values.pricing).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(`pricing[${key}]`, String(value));
        }
      });

      /* ───────── HOUSE RULES ───────── */
      Object.entries(values.houseRules).forEach(([key, value]) => {
        formData.append(`houseRules[${key}]`, String(value));
      });

      /* ───────── AMENITIES ───────── */
      values.amenities
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean)
        .forEach((amenity: string) => formData.append("amenities[]", amenity));

      /* ───────── STATUS ───────── */
      formData.append("isActive", String(values.isActive));
      formData.append("isPublished", String(values.isPublished));
      formData.append("isFeatured", String(values.isFeatured));

      /* ───────── SEO ───────── */
      formData.append("seo[metaTitle]", values.seo.metaTitle || "");
      formData.append("seo[metaDescription]", values.seo.metaDescription || "");
      formData.append(
        "seo[metaKeywords]",
        JSON.stringify(
          values.seo.metaKeywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean),
        ),
      );

      /* ───────── COVER IMAGE ───────── */
      if (thumbFiles[0]?.file instanceof File) {
        formData.append("coverImage", thumbFiles[0].file);
      }

      /* ───────── GALLERY ───────── */
      formData.append("keep_gallery", JSON.stringify(values.gallery));
      formData.append("remove_gallery", JSON.stringify(removedImages));

      galleryFiles.forEach((f) => {
        if (f.file instanceof File) {
          formData.append("gallery", f.file);
        }
      });

      /* ───────── SAVE ───────── */
      if (isEdit) {
        await updateProperty({ id: id!, data: formData }).unwrap();
        toast.success("Property updated successfully");
      } else {
        await createProperty(formData).unwrap();
        toast.success("Property created successfully");
      }

      navigate("/admin/property");
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
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <h1 className="text-3xl font-semibold">
        {isEdit ? "Edit Property" : "Create Property"}
      </h1>

      {/* Main Details  */}
      <Card>
        <CardHeader>
          <CardTitle>Main Details</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Field label="Property Title">
            <Input
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </Field>

          <Field label="Description">
            <RichTextEditor
              value={values.description}
              onChange={(v) => setValues({ ...values, description: v })}
              error={errors.description}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Type */}
      <Card>
        <CardHeader>
          <CardTitle>Property Type</CardTitle>
        </CardHeader>

        <CardContent>
          <Field label="Select Property Type">
            <select
              className="w-full border rounded px-3 py-2"
              value={values.propertyType}
              onChange={(e) =>
                setValues({ ...values, propertyType: e.target.value })
              }
            >
              {[
                "apartment",
                "house",
                "villa",
                "studio",
                "hotel",
                "resort",
                "hostel",
              ].map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </CardContent>
      </Card>

      {/* Capacity */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-4">
          <Field label="Guests">
            <Input
              type="text"
              inputMode="numeric"
              value={values.guests}
              onChange={(e) => setValues({ ...values, guests: e.target.value })}
            />
          </Field>

          <Field label="Bedrooms">
            <Input
              type="text"
              inputMode="numeric"
              value={values.bedrooms}
              onChange={(e) =>
                setValues({ ...values, bedrooms: e.target.value })
              }
            />
          </Field>

          <Field label="Beds">
            <Input
              type="text"
              inputMode="numeric"
              value={values.beds}
              onChange={(e) => setValues({ ...values, beds: e.target.value })}
            />
          </Field>

          <Field label="Bathrooms">
            <Input
              type="text"
              inputMode="numeric"
              value={values.bathrooms}
              onChange={(e) =>
                setValues({ ...values, bathrooms: e.target.value })
              }
            />
          </Field>
        </CardContent>
      </Card>

      {/* PRICING */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-4">
          <Field label="Per Night (₹)">
            <Input
              type="number"
              value={values.pricing.perNight}
              onChange={(e) =>
                setValues({
                  ...values,
                  pricing: { ...values.pricing, perNight: e.target.value },
                })
              }
            />
            {errors.perNight && (
              <p className="text-xs text-red-500">{errors.perNight}</p>
            )}
          </Field>

          <Field label="Per Week">
            <Input
              type="number"
              value={values.pricing.perWeek}
              onChange={(e) =>
                setValues({
                  ...values,
                  pricing: { ...values.pricing, perWeek: e.target.value },
                })
              }
            />
          </Field>

          <Field label="Per Month">
            <Input
              type="number"
              value={values.pricing.perMonth}
              onChange={(e) =>
                setValues({
                  ...values,
                  pricing: { ...values.pricing, perMonth: e.target.value },
                })
              }
            />
          </Field>

          <Field label="Cleaning Fee">
            <Input
              type="number"
              value={values.pricing.cleaningFee}
              onChange={(e) =>
                setValues({
                  ...values,
                  pricing: { ...values.pricing, cleaningFee: e.target.value },
                })
              }
            />
          </Field>

          <Field label="Currency">
            <select
              className="border rounded px-3 py-2"
              value={values.pricing.currency}
              onChange={(e) =>
                setValues({
                  ...values,
                  pricing: { ...values.pricing, currency: e.target.value },
                })
              }
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
        </CardContent>
      </Card>

      {/* House Rules */}
      <Card>
        <CardHeader>
          <CardTitle>House Rules</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <SwitchField
            label="Smoking Allowed"
            value={values.houseRules.smoking}
            onChange={(v) =>
              setValues({
                ...values,
                houseRules: { ...values.houseRules, smoking: v },
              })
            }
          />

          <SwitchField
            label="Pets Allowed"
            value={values.houseRules.pets}
            onChange={(v) =>
              setValues({
                ...values,
                houseRules: { ...values.houseRules, pets: v },
              })
            }
          />

          <SwitchField
            label="Parties Allowed"
            value={values.houseRules.parties}
            onChange={(v) =>
              setValues({
                ...values,
                houseRules: { ...values.houseRules, parties: v },
              })
            }
          />

          <div className="flex gap-4">
            <Field label="Check-in Time">
              <Input
                type="time"
                value={values.houseRules.checkInTime}
                onChange={(e) =>
                  setValues({
                    ...values,
                    houseRules: {
                      ...values.houseRules,
                      checkInTime: e.target.value,
                    },
                  })
                }
              />
            </Field>

            <Field label="Check-out Time">
              <Input
                type="time"
                value={values.houseRules.checkOutTime}
                onChange={(e) =>
                  setValues({
                    ...values,
                    houseRules: {
                      ...values.houseRules,
                      checkOutTime: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* STATUS */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SwitchField
            label="Active"
            value={values.isActive}
            onChange={(v) => setValues({ ...values, isActive: v })}
          />
          <SwitchField
            label="Published"
            value={values.isPublished}
            onChange={(v) => setValues({ ...values, isPublished: v })}
          />
          <SwitchField
            label="Featured"
            value={values.isFeatured}
            onChange={(v) => setValues({ ...values, isFeatured: v })}
          />
        </CardContent>
      </Card>

      {/* COVER IMAGE */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>

        <CardContent>
          <div
            className={`border-2 border-dashed p-6 rounded-xl ${
              thumbDrag ? "border-primary bg-accent" : ""
            }`}
            onDragEnter={thumbHandlers.handleDragEnter}
            onDragLeave={thumbHandlers.handleDragLeave}
            onDragOver={thumbHandlers.handleDragOver}
            onDrop={thumbHandlers.handleDrop}
          >
            <input {...thumbHandlers.getInputProps()} className="sr-only" />

            {thumbPreview ? (
              <div className="relative h-48">
                <img
                  src={thumbPreview}
                  className="w-full h-full object-cover rounded"
                  alt="Cover"
                />

                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                  onClick={() => {
                    thumbHandlers.clearFiles();
                    setValues((p: any) => ({ ...p, coverImage: null }));
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="h-6 w-6 mx-auto opacity-70" />
                <p className="text-sm mt-2">Upload cover image</p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={thumbHandlers.openFileDialog}
                  className="mt-2"
                >
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Select Images
                </Button>
              </div>
            )}
          </div>
          {thumbErrors?.[0] && (
            <p className="text-xs text-red-500 mt-2">{thumbErrors[0]}</p>
          )}
        </CardContent>
      </Card>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? "Save Changes" : "Create Property"}
      </Button>
    </form>
  );
}

/* ---------------------------------------------
      SMALL HELPER
--------------------------------------------- */
function SwitchField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex justify-between border p-3 rounded">
      {label}
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
