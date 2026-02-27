"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getSales, type SaleTransaction } from "@/handlers/sale";
import { getOutlets } from "@/handlers/outlet";
import "./transaction.scss";

const SALES_QUERY_KEY = ["sales"];
const OUTLETS_QUERY_KEY = ["outlets"];

function formatDate(tx: SaleTransaction): string {
  const raw = tx.date ?? tx.createdAt ?? "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return new Date(raw).toISOString().slice(0, 16).replace("T", " ");
  return "—";
}

function getTransactionId(tx: SaleTransaction): string {
  return tx.transactionId ?? tx.id ?? "—";
}

function resolveName(
  value: string | { name?: string } | null | undefined,
  fallback: string
): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "name" in value && typeof value.name === "string")
    return value.name;
  return fallback;
}

function getCustomerName(tx: SaleTransaction): string {
  if (tx.name != null && typeof tx.name === "string") return tx.name;
  const fromCustomer = resolveName(tx.customer, "");
  if (fromCustomer) return fromCustomer;
  return "—";
}

function getType(tx: SaleTransaction): string {
  return resolveName(tx.type ?? tx.customerType, "—");
}

function getItemsCount(tx: SaleTransaction): string {
  const n = tx.itemsCount ?? tx.itemCount ?? 0;
  return n === 1 ? "1 Item" : `${n} Items`;
}

function getAmount(tx: SaleTransaction): string {
  const n = tx.amount ?? tx.total;
  if (n == null) return "—";
  return `Rs.${Number(n).toFixed(2)}`;
}

export default function TransactionPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [outletFilter, setOutletFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const {
    data: transactions = [],
    isLoading: salesLoading,
    isError: salesError,
    error: salesErrorDetail,
  } = useQuery({
    queryKey: SALES_QUERY_KEY,
    queryFn: async () => {
      const result = await getSales();
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

  const filteredTransactions = transactions.filter((tx) => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const match =
        getTransactionId(tx).toLowerCase().includes(q) ||
        getCustomerName(tx).toLowerCase().includes(q) ||
        getType(tx).toLowerCase().includes(q) ||
        getAmount(tx).toLowerCase().includes(q);
      if (!match) return false;
    }
    if (outletFilter && tx.outletId && tx.outletId !== outletFilter)
      return false;
    return true;
  });

  return (
    <section className="transactionPage">
      <div className="breadcrumb">
        <span>Sales & Billing</span> {"›"} Transaction
      </div>

      <div className="transactionHeader">
        <div className="transactionHeaderText">
          <h1 className="pageTitle">Recent Transactions</h1>
          <p className="pageSubtitle">
            View and manage recent sales transactions
          </p>
        </div>
      </div>

      <div className="transactionToolbar">
        <div className="transactionSearch">
          <span className="searchIcon">🔍</span>
          <input
            className="searchInput"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
          />
        </div>
        <div className="transactionFilterWrap">
          <select
            className="transactionFilterSelect"
            value={outletFilter}
            onChange={(e) => setOutletFilter(e.target.value)}
            aria-label="Filter by outlet"
          >
            <option value="">All Outlets</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <span className="transactionLastSync">Last sync: 2mins</span>
      </div>

      <div className="transactionTable">
        <div className="transactionRow transactionRowHeader">
          <span>Transaction ID</span>
          <span>Date & Time</span>
          <span>Customer</span>
          <span>Type</span>
          <span>Items</span>
          <span className="transactionColAmount">Amount</span>
          <span aria-label="Actions" />
        </div>
        {salesLoading && (
          <div className="transactionRow">
            <span className="transactionMessage">Loading transactions…</span>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {salesError && (
          <div className="transactionRow">
            <span className="transactionMessage transactionError">
              {salesErrorDetail instanceof Error
                ? salesErrorDetail.message
                : "Failed to load transactions"}
            </span>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {!salesLoading && !salesError && transactions.length === 0 && (
          <div className="transactionRow">
            <span className="transactionMessage">
              No transactions yet.
            </span>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {!salesLoading &&
          !salesError &&
          transactions.length > 0 &&
          filteredTransactions.length === 0 && (
            <div className="transactionRow">
              <span className="transactionMessage">
                No transactions match your search.
              </span>
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
        {!salesLoading &&
          !salesError &&
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="transactionRow">
              <span>{getTransactionId(tx)}</span>
              <span>{formatDate(tx)}</span>
              <span>{getCustomerName(tx)}</span>
              <span>
                <span className="badge transactionTypeBadge">
                  {getType(tx)}
                </span>
              </span>
              <span>{getItemsCount(tx)}</span>
              <span className="transactionColAmount">{getAmount(tx)}</span>
              <div className="transactionMenuWrap">
                <button
                  type="button"
                  className="transactionMenuTrigger"
                  aria-label="More options"
                >
                  ⋮
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
