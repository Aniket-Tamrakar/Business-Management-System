"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { usePermissions } from "@/app/providers/AuthProvider";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import Modal from "../../../components/Modal/Modal";
import {
  createDualPricing as createDualPricingApi,
  deleteDualPricing as deleteDualPricingApi,
  getDualPricings,
  type DualPricing,
  updateDualPricing as updateDualPricingApi,
} from "@/handlers/dualPricing";
import { getOutlets } from "@/handlers/outlet";
import { getProducts } from "@/handlers/product";
import {
  dualPricingSchema,
  type DualPricingFormValues,
} from "@/schema/dualPricing";
import "./dualPricing.scss";

const DUAL_PRICING_QUERY_KEY = ["dualPricing"];
const PRODUCTS_QUERY_KEY = ["products"];
const OUTLETS_QUERY_KEY = ["outlets"];

const defaultFormValues: DualPricingFormValues = {
  productId: "",
  wholesalePrice: 0,
  retailPrice: 0,
  outletId: "",
  status: "Active",
};

function toFormValues(d: DualPricing): DualPricingFormValues {
  return {
    productId: d.productId,
    wholesalePrice: d.wholesalePrice ?? 0,
    retailPrice: d.retailPrice ?? 0,
    outletId: d.outletId,
    status: d.status ? "Active" : "Inactive",
  };
}

function resolveName(
  value: string | { name: string } | undefined,
  fallback: string
): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "name" in value) return value.name;
  return fallback;
}

export default function DualPricingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DualPricing | null>(null);
  const [editingItem, setEditingItem] = useState<DualPricing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const {
    data: items = [],
    isLoading: itemsLoading,
    isError: itemsError,
    error: itemsErrorDetail,
  } = useQuery({
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

  const addForm = useForm<DualPricingFormValues>({
    resolver: zodResolver(dualPricingSchema) as Resolver<DualPricingFormValues>,
    defaultValues: defaultFormValues,
  });

  const editForm = useForm<DualPricingFormValues>({
    resolver: zodResolver(dualPricingSchema) as Resolver<DualPricingFormValues>,
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!isModalOpen) addForm.reset(defaultFormValues);
  }, [isModalOpen, addForm.reset]);

  useEffect(() => {
    if (editingItem) editForm.reset(toFormValues(editingItem));
  }, [editingItem, editForm.reset]);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const createMutation = useMutation({
    mutationFn: (values: DualPricingFormValues) =>
      createDualPricingApi(values),
    onSuccess: (result) => {
      if (result.ok) {
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: DUAL_PRICING_QUERY_KEY });
      } else {
        if (result.status === 401) router.push("/login");
        else addForm.setError("root", { message: result.error });
      }
    },
    onError: () => {
      addForm.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: DualPricingFormValues;
    }) => updateDualPricingApi(id, values),
    onSuccess: (result) => {
      if (result.ok) {
        setEditingItem(null);
        queryClient.invalidateQueries({ queryKey: DUAL_PRICING_QUERY_KEY });
      } else {
        if (result.status === 401) router.push("/login");
        else editForm.setError("root", { message: result.error });
      }
    },
    onError: () => {
      editForm.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDualPricingApi(id),
    onSuccess: (result) => {
      if (result.ok) {
        setItemToDelete(null);
        queryClient.invalidateQueries({ queryKey: DUAL_PRICING_QUERY_KEY });
      } else {
        if (result.status === 401) router.push("/login");
      }
    },
  });

  const onAddSubmit: SubmitHandler<DualPricingFormValues> = (data) => {
    createMutation.mutate(data);
  };

  const onEditSubmit: SubmitHandler<DualPricingFormValues> = (data) => {
    if (editingItem) updateMutation.mutate({ id: editingItem.id, values: data });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) deleteMutation.mutate(itemToDelete.id);
  };

  const addLoading = addForm.formState.isSubmitting || createMutation.isPending;
  const editLoading =
    editForm.formState.isSubmitting || updateMutation.isPending;

  const getProductName = (item: DualPricing) => {
    const name = resolveName(item.product, "");
    if (name) return name;
    const p = products.find((x) => x.id === item.productId);
    return p?.name ?? item.productId ?? "—";
  };

  const getOutletName = (item: DualPricing) => {
    const name = resolveName(item.outlet, "");
    if (name) return name;
    const o = outlets.find((x) => x.id === item.outletId);
    return o?.name ?? item.outletId ?? "—";
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      getProductName(item).toLowerCase().includes(q) ||
      getOutletName(item).toLowerCase().includes(q) ||
      String(item.wholesalePrice).includes(q) ||
      String(item.retailPrice).includes(q)
    );
  });

  return (
    <section className="dualPricingPage">
      <div className="breadcrumb">
        <span>Settings</span> {"›"} Dual pricing
      </div>

      <div className="dualPricingHeader">
        <div className="dualPricingHeaderText">
          <h1 className="pageTitle">Dual pricing</h1>
          <p className="pageSubtitle">
            Manage wholesale and retail prices by product and outlet
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            className="button buttonPrimary"
            onClick={() => setIsModalOpen(true)}
          >
            Add dual pricing
          </button>
        )}
      </div>

      <div className="dualPricingSearch">
        <span className="searchIcon">🔍</span>
        <input
          className="searchInput"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search dual pricing"
        />
      </div>

      <div className="dualPricingTable">
        <div className="dualPricingRow dualPricingRowHeader">
          <span>Product</span>
          <span>Outlet</span>
          <span>Wholesale</span>
          <span>Retail</span>
          <span>Status</span>
          <span />
        </div>
        {itemsLoading && (
          <div className="dualPricingRow">
            <span className="dualPricingMessage">Loading…</span>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {itemsError && (
          <div className="dualPricingRow">
            <span className="dualPricingMessage dualPricingError">
              {itemsErrorDetail instanceof Error
                ? itemsErrorDetail.message
                : "Failed to load"}
            </span>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {!itemsLoading && !itemsError && items.length === 0 && (
          <div className="dualPricingRow">
            <span className="dualPricingMessage">
              No dual pricing yet. Add one to get started.
            </span>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {!itemsLoading &&
          !itemsError &&
          items.length > 0 &&
          filteredItems.length === 0 && (
            <div className="dualPricingRow">
              <span className="dualPricingMessage">
                No items match &quot;{searchQuery.trim()}&quot;.
              </span>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
        {!itemsLoading &&
          !itemsError &&
          filteredItems.map((item) => (
            <div key={item.id} className="dualPricingRow">
              <span>{getProductName(item)}</span>
              <span>{getOutletName(item)}</span>
              <span>{item.wholesalePrice}</span>
              <span>{item.retailPrice}</span>
              <span>
                <span
                  className={
                    item.status ? "badge badgeActive" : "badge"
                  }
                >
                  {item.status ? "Active" : "Inactive"}
                </span>
              </span>
              <div
                className="dualPricingMenuWrap"
                ref={openMenuId === item.id ? menuButtonRef : undefined}
              >
                {(canUpdate || canDelete) && (
                  <>
                    <button
                      type="button"
                      className="dualPricingMenuTrigger"
                      onClick={() =>
                        setOpenMenuId((id) =>
                          id === item.id ? null : item.id
                        )
                      }
                      aria-label="More options"
                      aria-expanded={openMenuId === item.id}
                    >
                      ⋮
                    </button>
                    {openMenuId === item.id && (
                      <div className="dualPricingMenuDropdown">
                        {canUpdate && (
                          <button
                            type="button"
                            className="dualPricingMenuItem"
                            onClick={() => {
                              setEditingItem(item);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            className="dualPricingMenuItem dualPricingMenuItemDanger"
                            onClick={() => {
                              setItemToDelete(item);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete dual pricing"
        message={
          itemToDelete
            ? `Are you sure you want to delete this dual pricing entry? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <Modal
        isOpen={!!editingItem}
        title="Edit dual pricing"
        subtitle={editingItem?.id}
        onClose={() => setEditingItem(null)}
        footer={
          <>
            <button
              type="button"
              className="button modalButton"
              onClick={() => setEditingItem(null)}
            >
              Discard
            </button>
            <button
              type="submit"
              form="edit-dual-pricing-form"
              className="button buttonPrimary modalButton"
              disabled={editLoading}
            >
              {editLoading ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        <form
          id="edit-dual-pricing-form"
          onSubmit={editForm.handleSubmit(onEditSubmit)}
          className="dualPricingAddForm"
        >
          {editForm.formState.errors.root?.message && (
            <p className="dualPricingFormError">
              {editForm.formState.errors.root.message}
            </p>
          )}
          <label className="modalField">
            <span className="label">Product</span>
            <select className="select" {...editForm.register("productId")}>
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {editForm.formState.errors.productId && (
              <span className="dualPricingFieldError">
                {editForm.formState.errors.productId.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Outlet</span>
            <select className="select" {...editForm.register("outletId")}>
              <option value="">Select outlet</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            {editForm.formState.errors.outletId && (
              <span className="dualPricingFieldError">
                {editForm.formState.errors.outletId.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Wholesale price</span>
            <input
              type="number"
              min={0}
              step={0.01}
              className="input"
              {...editForm.register("wholesalePrice")}
            />
            {editForm.formState.errors.wholesalePrice && (
              <span className="dualPricingFieldError">
                {editForm.formState.errors.wholesalePrice.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Retail price</span>
            <input
              type="number"
              min={0}
              step={0.01}
              className="input"
              {...editForm.register("retailPrice")}
            />
            {editForm.formState.errors.retailPrice && (
              <span className="dualPricingFieldError">
                {editForm.formState.errors.retailPrice.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Status</span>
            <select className="select" {...editForm.register("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </form>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        title="Add dual pricing"
        subtitle="Set wholesale and retail prices for a product at an outlet"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="button modalButton"
              onClick={() => setIsModalOpen(false)}
            >
              Discard
            </button>
            <button
              type="submit"
              form="add-dual-pricing-form"
              className="button buttonPrimary modalButton"
              disabled={addLoading}
            >
              {addLoading ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        <form
          id="add-dual-pricing-form"
          onSubmit={addForm.handleSubmit(onAddSubmit)}
          className="dualPricingAddForm"
        >
          {addForm.formState.errors.root?.message && (
            <p className="dualPricingFormError">
              {addForm.formState.errors.root.message}
            </p>
          )}
          <label className="modalField">
            <span className="label">Product</span>
            <select className="select" {...addForm.register("productId")}>
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {addForm.formState.errors.productId && (
              <span className="dualPricingFieldError">
                {addForm.formState.errors.productId.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Outlet</span>
            <select className="select" {...addForm.register("outletId")}>
              <option value="">Select outlet</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            {addForm.formState.errors.outletId && (
              <span className="dualPricingFieldError">
                {addForm.formState.errors.outletId.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Wholesale price</span>
            <input
              type="number"
              min={0}
              step={0.01}
              className="input"
              {...addForm.register("wholesalePrice")}
            />
            {addForm.formState.errors.wholesalePrice && (
              <span className="dualPricingFieldError">
                {addForm.formState.errors.wholesalePrice.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Retail price</span>
            <input
              type="number"
              min={0}
              step={0.01}
              className="input"
              {...addForm.register("retailPrice")}
            />
            {addForm.formState.errors.retailPrice && (
              <span className="dualPricingFieldError">
                {addForm.formState.errors.retailPrice.message}
              </span>
            )}
          </label>
          <label className="modalField">
            <span className="label">Status</span>
            <select className="select" {...addForm.register("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </form>
      </Modal>
    </section>
  );
}
