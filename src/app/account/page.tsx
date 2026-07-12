import type { Metadata } from "next";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserAddresses } from "@/lib/address-actions";
import AccountShell from "./AccountShell";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage(props: { searchParams: Promise<{ address?: string }> }) {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const addresses = await getUserAddresses();

  return (
    <AccountShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      addresses={addresses}
      showAddressRequired={searchParams.address === "required"}
    />
  );
}
