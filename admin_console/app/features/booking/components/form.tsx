// app/features/booking/components/form.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  useCreateBookingMutation,
  useGetBookingByIdQuery,
} from "../data/bookingApi";
import { useGetPropertiesQuery } from "~/features/property/data/propertyApi";
import { useGetUsersQuery } from "~/features/users/data/usersApi";

/* ---------------------------------------------
   VALIDATION
--------------------------------------------- */
const validate = (v: any) => {
  const errors: Record<string, string> = {};

  if (!v.propertyId) errors.propertyId = "Property is required";
  if (!v.guestId) errors.guestId = "Guest is required";
  if (!v.checkIn) errors.checkIn = "Check-in required";
  if (!v.checkOut) errors.checkOut = "Check-out required";

  if (new Date(v.checkOut) <= new Date(v.checkIn)) {
    errors.checkOut = "Check-out must be after check-in";
  }

  if (!v.totalGuests || Number(v.totalGuests) <= 0) {
    errors.totalGuests = "Guests must be at least 1";
  }

  return errors;
};

export default function BookingForm({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" && !!id;

  const [createBooking] = useCreateBookingMutation();

  /* ---------------------------------------------
     FETCH DATA
  --------------------------------------------- */
  const { data: properties } = useGetPropertiesQuery({ page: 1, limit: 100 });
  const { data: users } = useGetUsersQuery({ page: 1, limit: 100 });

  const { data: bookingData, isLoading } = useGetBookingByIdQuery(id!, {
    skip: !isEdit,
  });

  /* ---------------------------------------------
     STATE
  --------------------------------------------- */
  const [values, setValues] = useState<any>({
    propertyId: "",
    guestId: "",
    checkIn: "",
    checkOut: "",
    totalGuests: "1",
    note: "",
    extendBooking: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------------------------
     PREFILL (EDIT)
  --------------------------------------------- */
  useEffect(() => {
    if (!bookingData?.data) return;

    const b = bookingData.data;
    setValues({
      propertyId: b.property._id,
      guestId: b.guest._id,
      checkIn: b.checkIn.slice(0, 10),
      checkOut: b.checkOut.slice(0, 10),
      totalGuests: b.totalGuests.toString(),
      note: b.note || "",
      extendBooking: false,
    });
  }, [bookingData]);

  /* ---------------------------------------------
     SUBMIT
  --------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      Object.values(errs).forEach((e: any) => toast.error(e));
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({
        propertyId: values.propertyId,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        totalGuests: Number(values.totalGuests),
        note: values.note || undefined,
      }).unwrap();

      toast.success("Booking saved successfully");
      navigate("/admin/booking");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 max-w-xl">
      <h1 className="text-3xl font-semibold">
        {isEdit ? "Edit Booking" : "Create Booking"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* PROPERTY */}
          <Field label="Property">
            <select
              className="border rounded px-3 py-2"
              value={values.propertyId}
              onChange={(e) =>
                setValues({ ...values, propertyId: e.target.value })
              }
            >
              <option value="">Select property</option>
              {properties?.data?.map((p: any) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>

          {/* GUEST */}
          <Field label="Guest">
            <select
              className="border rounded px-3 py-2"
              value={values.guestId}
              onChange={(e) =>
                setValues({ ...values, guestId: e.target.value })
              }
            >
              <option value="">Select user</option>
              {users?.data?.map((u: any) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </Field>

          {/* DATES */}
          <div className="flex gap-4">
            {/* CHECK-IN */}
            <Field label="Check-in">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {values.checkIn
                      ? format(new Date(values.checkIn), "PPP")
                      : "Select check-in date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={
                      values.checkIn ? new Date(values.checkIn) : undefined
                    }
                    onSelect={(date) =>
                      setValues({
                        ...values,
                        checkIn: date ? date.toISOString().slice(0, 10) : "",
                      })
                    }
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>

            {/* CHECK-OUT */}
            <Field label="Check-out">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {values.checkOut
                      ? format(new Date(values.checkOut), "PPP")
                      : "Select check-out date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={
                      values.checkOut ? new Date(values.checkOut) : undefined
                    }
                    onSelect={(date) =>
                      setValues({
                        ...values,
                        checkOut: date ? date.toISOString().slice(0, 10) : "",
                      })
                    }
                    disabled={(date) =>
                      !values.checkIn ? true : date <= new Date(values.checkIn)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </div>

          {/* EXTEND */}
          {isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.extendBooking}
                onChange={(e) =>
                  setValues({ ...values, extendBooking: e.target.checked })
                }
              />
              Extend booking
            </label>
          )}

          {/* GUEST COUNT */}
          <Field label="Total Guests">
            <Input
              type="number"
              min={1}
              value={values.totalGuests}
              onChange={(e) =>
                setValues({ ...values, totalGuests: e.target.value })
              }
            />
          </Field>

          <Field label="Admin Note">
            <Input
              placeholder="Optional note"
              value={values.note}
              onChange={(e) => setValues({ ...values, note: e.target.value })}
            />
          </Field>
        </CardContent>
      </Card>

      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? "Update Booking" : "Create Booking"}
      </Button>
    </form>
  );
}
