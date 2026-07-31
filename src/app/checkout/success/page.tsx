import CheckoutSuccessClient from "./success-client";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; method?: string }>;
}) {
  const params = await searchParams;
  return <CheckoutSuccessClient orderId={params.order || ""} method={params.method || "cod"} />;
}
