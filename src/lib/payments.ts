export type PayPalMode = "sandbox" | "live";

export interface PayPalSettings {
  paypal_client_id: string;
  paypal_client_secret: string;
  paypal_mode: PayPalMode;
  paypal_currency: string;
  paypal_rate: number;
  paypal_enabled: boolean;
  cod_enabled: boolean;
}

const API_BASE: Record<PayPalMode, string> = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

export async function getPayPalAccessToken(
  clientId: string,
  clientSecret: string,
  mode: PayPalMode
): Promise<string> {
  const res = await fetch(`${API_BASE[mode]}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`فشل الاتصال بـ PayPal (${res.status}) ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPayPalOrder(
  settings: PayPalSettings,
  amount: { currency_code: string; value: string },
  returnUrl: string,
  cancelUrl: string
): Promise<{ id: string; approvalUrl: string }> {
  const token = await getPayPalAccessToken(
    settings.paypal_client_id,
    settings.paypal_client_secret,
    settings.paypal_mode
  );

  const res = await fetch(`${API_BASE[settings.paypal_mode]}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: amount.currency_code, value: amount.value },
          description: "TechVault",
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`فشل إنشاء الدفع في PayPal (${res.status}) ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    id: string;
    links: { href: string; rel: string; method: string }[];
  };

  const approval = data.links?.find((l) => l.rel === "approve");
  if (!approval?.href) throw new Error("تعذر الحصول على رابط الدفع من PayPal");

  return { id: data.id, approvalUrl: approval.href };
}

export async function capturePayPalOrder(
  paypalOrderId: string,
  settings: PayPalSettings
): Promise<{ id: string; status: string; payer: { email_address?: string; payer_id?: string } }> {
  const token = await getPayPalAccessToken(
    settings.paypal_client_id,
    settings.paypal_client_secret,
    settings.paypal_mode
  );

  const res = await fetch(`${API_BASE[settings.paypal_mode]}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`فشل إتمام الدفع (${res.status}) ${text.slice(0, 200)}`);
  }

  return (await res.json()) as {
    id: string;
    status: string;
    payer: { email_address?: string; payer_id?: string };
  };
}
