"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCustomerTypes } from "@/handlers/customerType";
import { getDualPricings } from "@/handlers/dualPricing";
import { getOutlets } from "@/handlers/outlet";
import { getProducts } from "@/handlers/product";
import { createSale } from "@/handlers/sale";
import type { DualPricing } from "@/handlers/dualPricing";
import type { Product } from "@/handlers/product";
import "./pos.scss";

const PRODUCTS_QUERY_KEY = ["products"];
const OUTLETS_QUERY_KEY = ["outlets"];
const DUAL_PRICING_QUERY_KEY = ["dualPricing"];
const CUSTOMER_TYPES_QUERY_KEY = ["customerTypes"];

type LineItem = {
  productId: string;
  productName: string;
  weight: number;
  unitPrice: number;
};

function getUnitPrice(
  dualPricings: DualPricing[],
  productId: string,
  outletId: string,
  isWholesale: boolean
): number {
  const dp = dualPricings.find(
    (d) => d.productId === productId && d.outletId === outletId
  );
  if (!dp) return 0;
  return isWholesale ? dp.wholesalePrice : dp.retailPrice;
}

export default function PointOfSalePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerTypeId, setCustomerTypeId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [productId, setProductId] = useState("");
  const [weight, setWeight] = useState<number>(1);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const result = await getProducts();
      if (!result.ok) {
        if (result.status === 401) router.push("/login");
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const { data: outlets = [] } = useQuery({
    queryKey: OUTLETS_QUERY_KEY,
    queryFn: async () => {
      const result = await getOutlets();
      if (!result.ok) {
        if (result.status === 401) router.push("/login");
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const { data: dualPricings = [] } = useQuery({
    queryKey: DUAL_PRICING_QUERY_KEY,
    queryFn: async () => {
      const result = await getDualPricings();
      if (!result.ok) {
        if (result.status === 401) router.push("/login");
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const { data: customerTypes = [] } = useQuery({
    queryKey: CUSTOMER_TYPES_QUERY_KEY,
    queryFn: async () => {
      const result = await getCustomerTypes();
      if (!result.ok) {
        if (result.status === 401) router.push("/login");
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const selectedCustomerType = customerTypes.find((ct) => ct.id === customerTypeId);
  const isWholesale = selectedCustomerType?.name?.toLowerCase().includes("wholesale") ?? false;

  const handleAddProduct = () => {
    if (!productId || !outletId) {
      setError("Select product and outlet.");
      return;
    }
    const product = products.find((p: Product) => p.id === productId);
    const unitPrice = getUnitPrice(
      dualPricings,
      productId,
      outletId,
      isWholesale
    );
    setLineItems((prev) => [
      ...prev,
      {
        productId,
        productName: product?.name ?? "—",
        weight: Number(weight) || 1,
        unitPrice,
      },
    ]);
    setWeight(1);
    setProductId("");
    setError(null);
  };

  const removeLine = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = lineItems.reduce(
    (sum, item) => sum + item.unitPrice * item.weight,
    0
  );

  const createSaleMutation = useMutation({
    mutationFn: (items: { name: string; contact: string; customerTypeId: string; productId: string; outletId: string; weight: number }[]) =>
      createSale(items),
    onSuccess: (result) => {
      if (result.ok) {
        setLineItems([]);
        setCustomerName("");
        setCustomerContact("");
        setError(null);
        router.push("/dashboard/invoices/transaction");
      } else {
        if (result.status === 401) router.push("/login");
        else setError(result.error);
      }
    },
    onError: () => setError("Something went wrong. Please try again."),
  });

  const handleCheckout = () => {
    if (!outletId || lineItems.length === 0) {
      setError("Add at least one product and select an outlet.");
      return;
    }
    if (!customerName.trim()) {
      setError("Enter customer details.");
      return;
    }
    if (!customerTypeId) {
      setError("Select a customer type.");
      return;
    }
    const items = lineItems.map((item) => ({
      name: customerName.trim(),
      contact: customerContact.trim(),
      customerTypeId,
      productId: item.productId,
      outletId,
      weight: item.weight,
    }));
    createSaleMutation.mutate(items);
  };

  return (
    <section className="posPage">
      <div className="breadcrumb">
        <span>Sales & Billing</span> {"›"} Transaction
      </div>

      <div className="posHeader">
        <div className="posHeaderText">
          <h1 className="pageTitle">Point of Sale</h1>
          <p className="pageSubtitle">
            Scan barcode or search products
          </p>
        </div>
      </div>

      <div className="posCard">
        <h2 className="posCardTitle">Current Sale</h2>

        <div className="posFormRow">
          <label className="posField">
            <span className="posLabel">Customer Details</span>
            <input
              className="posInput"
              placeholder="Enter customer details"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              aria-label="Customer name"
            />
          </label>
          <label className="posField">
            <span className="posLabel">Contact</span>
            <input
              className="posInput"
              placeholder="Phone or email"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              aria-label="Customer contact"
            />
          </label>
        </div>

        <div className="posFormRow">
          <label className="posField">
            <span className="posLabel">Customer Type</span>
            <select
              className="posSelect"
              value={customerTypeId}
              onChange={(e) => setCustomerTypeId(e.target.value)}
              aria-label="Customer type"
            >
              <option value="">Select customer type</option>
              {customerTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
          </label>
          <label className="posField">
            <span className="posLabel">Outlet</span>
            <select
              className="posSelect"
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
              aria-label="Outlet"
            >
              <option value="">Select outlet</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="posFormRow posFormRowAdd">
          <label className="posField">
            <span className="posLabel">Product Name</span>
            <select
              className="posSelect"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              aria-label="Product"
            >
              <option value="">Select product</option>
              {products.map((p: Product) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="posField posFieldQty">
            <span className="posLabel">Qty/kg</span>
            <input
              className="posInput"
              type="number"
              min={0.01}
              step={0.01}
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              aria-label="Quantity in kg"
            />
          </label>
          <button
            type="button"
            className="posAddBtn"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
        </div>

        {error && (
          <p className="posError" role="alert">
            {error}
          </p>
        )}

        <div className="posTableWrap">
          <table className="posTable">
            <thead>
              <tr>
                <th>PRODUCT NAME</th>
                <th>QTY/KG</th>
                <th>SUB-TOTAL</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="posTableEmpty">
                    No products added. Select product and quantity above.
                  </td>
                </tr>
              ) : (
                lineItems.map((item, index) => (
                  <tr key={`${item.productId}-${index}`}>
                    <td>{item.productName}</td>
                    <td>{item.weight}</td>
                    <td>
                      {item.weight !== 1
                        ? `${item.unitPrice}*${item.weight}`
                        : String(item.unitPrice * item.weight)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="posRemoveBtn"
                        onClick={() => removeLine(index)}
                        aria-label="Remove line"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {lineItems.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} className="posTotalLabel">
                    Total
                  </td>
                  <td className="posTotalValue">{total}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <button
          type="button"
          className="posCheckoutBtn"
          onClick={handleCheckout}
          disabled={createSaleMutation.isPending || lineItems.length === 0}
        >
          {createSaleMutation.isPending ? "Processing…" : "Checkout"}
        </button>
      </div>
    </section>
  );
}
