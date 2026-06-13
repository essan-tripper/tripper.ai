"use client";

import { useState } from "react";
import { authClient } from "@/lib/db/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserAddresses,
} from "@/lib/address-actions";
import { type AddressInput } from "@/lib/validation/address";
import AddressFormModal from "./AddressFormModal";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string | null;
  isDefault: boolean | null;
};

const emptyForm: AddressInput = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "Delhi",
  pincode: "",
  country: "India",
  isDefault: false,
};

type AccountShellProps = {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  addresses: Address[];
  showAddressRequired: boolean;
};

function addressToInput(addr: Address): AddressInput {
  return {
    name: addr.name,
    phone: addr.phone,
    address: addr.address,
    city: addr.city,
    state: addr.state as AddressInput["state"],
    pincode: addr.pincode,
    country: "India",
    isDefault: addr.isDefault ?? false,
  };
}

export default function AccountShell({
  user,
  addresses: initialAddresses,
  showAddressRequired,
}: AccountShellProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressInput | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  function openCreate() {
    setEditingAddress(null);
    setEditingAddressId(null);
    setShowAddressForm(true);
  }

  function openEdit(addr: Address) {
    setEditingAddress(addressToInput(addr));
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  }

  function closeForm() {
    setShowAddressForm(false);
    setEditingAddress(null);
    setEditingAddressId(null);
  }

  async function handleSaveAddress(data: AddressInput) {
    if (editingAddressId) {
      await updateAddress(editingAddressId, data);
    } else {
      await createAddress(data);
    }
    closeForm();
    const updated = await getUserAddresses();
    setAddresses(updated as Address[]);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })) as Address[]
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1c1c] text-white py-20">
      <div className="max-w-2xl mx-auto px-4 space-y-10">
        <div className="bg-[#1a1a1a]/70 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <h1
            className="text-3xl font-serif mb-6"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
          >
            Your Account
          </h1>

          <div className="space-y-4">
            {user.image && (
              <Image
                src={user.image}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-sm text-white/50">Name</p>
              <p className="font-medium">{user.name ?? "\u2014"}</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Email</p>
              <p className="font-medium">{user.email ?? "\u2014"}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-6 w-full py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-[#1a1a1a]/70 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          {showAddressRequired && (
            <div className="mb-6 p-3 bg-[#f48b29]/10 border border-[#f48b29]/30 rounded-lg text-sm text-[#f48b29]">
              Please add a shipping address before proceeding to checkout.
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-serif"
              style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            >
              Shipping Addresses
            </h2>
            <button
              onClick={openCreate}
              className="bg-[#f48b29] hover:bg-[#924c00] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-white/50 text-sm">No addresses saved yet.</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-white/10 rounded-lg p-4 relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider text-[#f48b29] border border-[#f48b29]/30 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-white/60">
                    +91 {addr.phone}
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    {addr.address}, {addr.city}, {addr.state} \u2014{" "}
                    {addr.pincode}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => openEdit(addr)}
                      className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {!addr.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          Set as Default
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddressForm && (
        <AddressFormModal
          initialValues={editingAddress ?? emptyForm}
          editingId={editingAddressId}
          onSave={handleSaveAddress}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
