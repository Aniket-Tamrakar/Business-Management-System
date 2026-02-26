"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getProducts, type Product } from "@/handlers/product";
import { getOutlets } from "@/handlers/outlet";
import { getProductTypes } from "@/handlers/productType";
import "./liveProduct.scss";

const PRODUCT_TYPE_NAME = "Live";

export default function LiveProductPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading: productsLoading, isError: productsError, error: productsErrorDetail } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const result = await getProducts();
      if (!result.ok) {
        if (result.status === 401) router.push("/login");
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const { data: productTypes = [] } = useQuery({
    queryKey: ["productTypes"],
    queryFn: async () => {
      const result = await getProductTypes();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });

  const { data: outlets = [] } = useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      const result = await getOutlets();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });

  const liveTypeId = useMemo(
    () => productTypes.find((pt) => pt.name.toLowerCase() === PRODUCT_TYPE_NAME.toLowerCase())?.id ?? null,
    [productTypes]
  );

  const filteredProducts = useMemo(() => {
    let list: Product[] = liveTypeId
      ? products.filter((p) => p.productTypeId === liveTypeId)
      : [];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const outletNames = new Map(outlets.map((o) => [o.id, o.name.toLowerCase()]));
      const typeNames = new Map(productTypes.map((pt) => [pt.id, pt.name.toLowerCase()]));
      list = list.filter((p) => {
        const name = p.name.toLowerCase();
        const outletName = outletNames.get(p.outletId) ?? "";
        const typeName = typeNames.get(p.productTypeId) ?? "";
        return name.includes(q) || outletName.includes(q) || typeName.includes(q);
      });
    }
    return list;
  }, [products, liveTypeId, searchQuery, outlets, productTypes]);

  const getOutletName = (outletId: string) => outlets.find((o) => o.id === outletId)?.name ?? outletId;
  const getTypeName = (typeId: string) => productTypes.find((pt) => pt.id === typeId)?.name ?? typeId;

  return (
    <section className="liveProductPage">
      <div className="breadcrumb">
        <span>Product</span> {"›"} Live
      </div>

      <div className="liveProductHeader">
        <div className="liveProductHeaderText">
          <h1 className="pageTitle">Live Products</h1>
          <p className="pageSubtitle">Products of type Live</p>
        </div>
        <div className="liveProductSearch">
          <span className="searchIcon">🔍</span>
          <input
            className="searchInput"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search live products"
          />
        </div>
      </div>

      <div className="productsTable">
        <div className="productsRow productsRowHeader">
          <span>Name</span>
          <span>Product Type</span>
          <span>Outlet</span>
          <span>Quantity</span>
          <span>Status</span>
        </div>
        {productsLoading && (
          <div className="productsRow">
            <span className="productsMessage">Loading…</span>
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {productsError && (
          <div className="productsRow">
            <span className="productsMessage productsError">
              {productsErrorDetail instanceof Error
                ? productsErrorDetail.message
                : "Failed to load products"}
            </span>
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {!productsLoading && !productsError && !liveTypeId && productTypes.length > 0 && (
          <div className="productsRow">
            <span className="productsMessage">No product type named &quot;Live&quot; found.</span>
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {!productsLoading &&
          !productsError &&
          liveTypeId &&
          filteredProducts.length === 0 && (
            <div className="productsRow">
              <span className="productsMessage">
                {searchQuery.trim()
                  ? `No live products match "${searchQuery.trim()}".`
                  : "No live products yet."}
              </span>
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
        {!productsLoading &&
          !productsError &&
          filteredProducts.length > 0 &&
          filteredProducts.map((product) => (
            <div key={product.id} className="productsRow">
              <span>{product.name}</span>
              <span>{getTypeName(product.productTypeId)}</span>
              <span>{getOutletName(product.outletId)}</span>
              <span>{product.quantity}</span>
              <span>
                <span className={product.status ? "badge badgeActive" : "badge"}>
                  {product.status ? "Active" : "Inactive"}
                </span>
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
