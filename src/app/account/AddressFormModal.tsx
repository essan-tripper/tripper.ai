"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/lib/validation/address";
import { getStateFromPincode } from "@/lib/validation/pincode-lookup";
import { useEffect, useState } from "react";

type AddressFormModalProps = {
  initialValues: AddressInput;
  editingId: string | null;
  onSave: (data: AddressInput) => Promise<void>;
  onCancel: () => void;
};

export default function AddressFormModal({
  initialValues,
  editingId,
  onSave,
  onCancel,
}: AddressFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues,
  });

  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "matched" | "unmatched">("idle");
  const pincodeValue = watch("pincode");

  useEffect(() => {
    if (pincodeValue && pincodeValue.length === 6) {
      const matchedState = getStateFromPincode(pincodeValue);
      if (matchedState) {
        setValue("state", matchedState as AddressInput["state"], { shouldValidate: true });
        setPincodeStatus("matched");
      } else {
        setValue("state", "" as AddressInput["state"]);
        setPincodeStatus("unmatched");
      }
    } else if (pincodeValue && pincodeValue.length < 6) {
      setValue("state", "" as AddressInput["state"]);
      setPincodeStatus("idle");
    } else {
      setPincodeStatus("idle");
    }
  }, [pincodeValue, setValue]);

  useEffect(() => {
    if (initialValues.pincode && initialValues.pincode.length === 6) {
      const matchedState = getStateFromPincode(initialValues.pincode);
      if (matchedState) {
        setPincodeStatus("matched");
      }
    }
  }, []);

  async function onSubmit(data: AddressInput) {
    await onSave(data);
  }

  function inputClass(field: keyof AddressInput) {
    return `w-full bg-[#0e0e0e] border ${
      errors[field] ? "border-red-500" : "border-white/20"
    } rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#f48b29]`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <h3
          className="text-xl font-serif mb-6"
          style={{ fontFamily: "var(--font-instrument-serif), serif" }}
        >
          {editingId ? "Edit Address" : "Add Address"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/70">Pincode</label>
              <input
                {...register("pincode")}
                type="text"
                inputMode="numeric"
                maxLength={6}
                className={inputClass("pincode")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
              />
              {pincodeStatus === "matched" && (
                <p className="text-xs text-green-400">State auto-filled from pincode</p>
              )}
              {pincodeStatus === "unmatched" && (
                <p className="text-xs text-red-400">Not delivering to this address as of now</p>
              )}
              {errors.pincode && (
                <p className="text-xs text-red-400">{errors.pincode.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/70">Country</label>
              <input
                value="India"
                disabled
                className="w-full bg-[#0e0e0e] border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white/50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70">State</label>
            <input
              value={watch("state")}
              disabled
              className="w-full bg-[#0e0e0e] border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white/50 cursor-not-allowed"
            />
            {errors.state && (
              <p className="text-xs text-red-400">{errors.state.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/70">Name</label>
              <input {...register("name")} className={inputClass("name")} />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/70">Phone</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2.5 text-sm text-white/50 bg-[#0e0e0e] border border-white/20 rounded-l-lg">
                  +91
                </span>
                <input
                  {...register("phone")}
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  className={`${inputClass("phone")} rounded-l-none`}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                  }}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70">Address</label>
            <input {...register("address")} className={inputClass("address")} />
            {errors.address && (
              <p className="text-xs text-red-400">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70">City</label>
            <input
              {...register("city")}
              className={inputClass("city")}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
              }}
            />
            {errors.city && (
              <p className="text-xs text-red-400">{errors.city.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="accent-[#f48b29] cursor-pointer"
            />
            Set as default address
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || pincodeStatus === "unmatched"}
              className="flex-1 bg-[#f48b29] hover:bg-[#924c00] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting
                ? "Saving..."
                : editingId
                  ? "Update Address"
                  : "Save Address"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-white/20 text-white/70 font-medium py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
