import { apiRequest } from "@/lib/api/client";
import { SALES_ROUTES } from "@/lib/api/routes";

export type SaleItemPayload = {
  name: string;
  contact: string;
  customerTypeId: string;
  productId: string;
  outletId: string;
  weight: number;
};

/** Transaction/sale record for list view. API may return type/customerType/customer as { id, name }. */
export type SaleTransaction = {
  id: string;
  transactionId?: string;
  date?: string;
  createdAt?: string;
  name?: string;
  customer?: string | { id?: string; name?: string };
  contact?: string;
  customerType?: string | { id?: string; name?: string };
  customerTypeId?: string;
  type?: string | { id?: string; name?: string };
  itemsCount?: number;
  itemCount?: number;
  amount?: number;
  total?: number;
  outletId?: string;
  [key: string]: unknown;
};

export type GetSalesResponse = {
  data?: SaleTransaction[];
  sales?: SaleTransaction[];
  transactions?: SaleTransaction[];
  [key: string]: unknown;
};

export type CreateSaleResponse = {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

export async function getSales(): Promise<
  | { ok: true; data: SaleTransaction[] }
  | { ok: false; error: string; status: number }
> {
  const result = await apiRequest<GetSalesResponse>(SALES_ROUTES.GET, {
    method: "GET",
  });
  if (!result.ok) return result;
  const list =
    result.data?.data ?? result.data?.sales ?? result.data?.transactions ?? [];
  const data: SaleTransaction[] = Array.isArray(list) ? list : [];
  return { ok: true, data };
}

/** POST /sales/get-by-product-id with body { productId } */
export async function getSalesByProductId(
  productId: string
): Promise<
  | { ok: true; data: SaleTransaction[] }
  | { ok: false; error: string; status: number }
> {
  const result = await apiRequest<GetSalesResponse>(
    SALES_ROUTES.GET_BY_PRODUCT_ID,
    {
      method: "POST",
      body: JSON.stringify({ productId }),
    }
  );
  if (!result.ok) return result;
  const list =
    result.data?.data ?? result.data?.sales ?? result.data?.transactions ?? [];
  const data: SaleTransaction[] = Array.isArray(list) ? list : [];
  return { ok: true, data };
}

export async function createSale(items: SaleItemPayload[]) {
  return apiRequest<CreateSaleResponse>(SALES_ROUTES.CREATE, {
    method: "POST",
    body: JSON.stringify(items),
  });
}
