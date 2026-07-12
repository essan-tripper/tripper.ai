"use client";

import dynamic from "next/dynamic";

const PlanThreeDView = dynamic(() => import("./PlanThreeDView"), { ssr: false });

export default function DynamicGlobe() {
  return <PlanThreeDView />;
}
