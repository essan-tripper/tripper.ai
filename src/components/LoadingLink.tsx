"use client";

import { useTransition, cloneElement } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LoadingLinkProps {
  href: string;
  children: React.ReactElement<{ onClick?: Function; disabled?: boolean; className?: string; children?: React.ReactNode }>;
}

export default function LoadingLink({ href, children }: LoadingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = () => {
    if (isPending) return;
    startTransition(() => router.push(href));
  };

  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      if (!e?.defaultPrevented) navigate();
    },
    disabled: isPending || children.props.disabled,
    children: isPending ? (
      <span className="inline-flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
      </span>
    ) : (
      children.props.children
    ),
  });
}
