import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaTrash,
  FaEdit,
  FaHome,
  FaCheckCircle,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { AccountShell, api } from "./AccountShell";

const go = (p) => (window.location.href = p);

export default function AddressesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);

    api("/api/addresses")
      .then((d) => setItems(d.addresses || d.data || d || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Delete this address?")) return;

    try {
      await api(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      toast.success("Address deleted");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AccountShell
      title="My addresses"
      right={
        <button
          className="ok-icon-btn"
          onClick={() => go("/account/addresses/add")}
          aria-label="Add address"
        >
          <FaPlus size={15} />
        </button>
      }
    >
      <div className="address-page">

        {/* PAGE HEADER */}
        <div className="address-heading">
          <div>
            <h2>Saved addresses</h2>
            <p>
              {items.length === 0
                ? "Add an address for faster checkout"
                : `${items.length} saved address${
                    items.length !== 1 ? "es" : ""
                  }`}
            </p>
          </div>

          <button
            className="ok-btn ok-primary address-add-btn"
            onClick={() => go("/account/addresses/add")}
          >
            <FaPlus size={12} />
            <span>Add address</span>
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="address-loading">
            {[1, 2].map((item) => (
              <div className="address-skeleton" key={item}>
                <div className="skeleton-icon" />
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <div className="ok-card address-empty">
            <div className="address-empty-icon">
              <FaMapMarkerAlt size={25} />
            </div>

            <h3>No saved addresses</h3>

            <p>
              Save your home, work, or other delivery addresses
              to make checkout quicker.
            </p>

            <button
              className="ok-btn ok-primary"
              onClick={() => go("/account/addresses/add")}
            >
              <FaPlus size={12} />
              Add your first address
            </button>
          </div>
        ) : (
          /* ADDRESS LIST */
          <div className="address-list">
            {items.map((a) => {
              const id = a._id || a.id;

              const addressText = [
                a.addressLine1,
                a.addressLine2,
                a.landmark,
                a.area,
                a.city,
                a.district,
                a.state,
                a.pincode || a.pinCode,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article className="ok-card address-card" key={id}>
                  {/* CARD TOP */}
                  <div className="address-card-top">
                    <div className="address-type-icon">
                      <FaHome size={16} />
                    </div>

                    <div className="address-main-info">
                      <div className="address-title-row">
                        <h3>{a.label || a.type || "Address"}</h3>

                        {a.isDefault && (
                          <span className="address-default">
                            <FaCheckCircle size={10} />
                            Default
                          </span>
                        )}
                      </div>

                      {(a.fullName || a.name || a.phone) && (
                        <div className="address-contact">
                          {a.fullName || a.name || ""}
                          {a.phone && (
                            <>
                              <span>•</span>
                              <span>{a.phone}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="address-body">
                    <FaMapMarkerAlt
                      className="address-location-icon"
                      size={13}
                    />

                    <p>{addressText || "No address details available"}</p>
                  </div>

                  {/* ACTIONS */}
                  <div className="address-actions">
                    <button
                      className="address-action edit"
                      onClick={() =>
                        go(`/account/addresses/${id}/edit`)
                      }
                    >
                      <FaEdit size={12} />
                      Edit
                    </button>

                    <button
                      className="address-action delete"
                      onClick={() => remove(id)}
                    >
                      <FaTrash size={11} />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* HELPFUL FOOTER */}
        {!loading && items.length > 0 && (
          <div className="address-tip">
            <div className="address-tip-icon">
              <FaMapMarkerAlt size={13} />
            </div>

            <div>
              <strong>Make checkout faster</strong>
              <p>
                Keep your most-used delivery address marked as
                default.
              </p>
            </div>

            <FaChevronRight
              className="address-tip-arrow"
              size={11}
            />
          </div>
        )}
      </div>

      <style>{`
        /* =====================================================
           ADDRESS PAGE
        ===================================================== */

        .address-page {
          width: 100%;
        }

        .address-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .address-heading h2 {
          margin: 0 0 5px;
          color: #111827;
          font-size: 22px;
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .address-heading p {
          margin: 0;
          color: #737582;
          font-size: 12px;
        }

        .address-add-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          border-radius: 12px;
          white-space: nowrap;
        }

        /* =====================================================
           ADDRESS CARD
        ===================================================== */

        .address-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .address-card {
          padding: 17px;
          border-radius: 18px;
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            border-color .18s ease;
        }

        .address-card:hover {
          transform: translateY(-1px);
          border-color: #dfe1ea;
          box-shadow: 0 8px 24px rgba(20, 20, 40, .07);
        }

        .address-card-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .address-type-icon {
          width: 42px;
          height: 42px;
          flex: none;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #eeedff;
          color: #4f46e5;
        }

        .address-main-info {
          min-width: 0;
          flex: 1;
        }

        .address-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }

        .address-title-row h3 {
          margin: 0;
          color: #17181d;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.3;
        }

        .address-default {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 7px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #d1fae5;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .02em;
        }

        .address-contact {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          color: #737582;
          font-size: 11px;
          font-weight: 500;
        }

        .address-body {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 14px 0 15px;
          padding: 12px;
          border-radius: 12px;
          background: #f8f9fc;
        }

        .address-location-icon {
          flex: none;
          margin-top: 3px;
          color: #64748b;
        }

        .address-body p {
          margin: 0;
          color: #4b5563;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =====================================================
           ACTIONS
        ===================================================== */

        .address-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #eef0f4;
        }

        .address-action {
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
          transition: all .16s ease;
        }

        .address-action.edit {
          background: #f5f5ff;
          color: #4f46e5;
          border-color: #e7e6ff;
        }

        .address-action.edit:hover {
          background: #eeedff;
        }

        .address-action.delete {
          color: #b91c1c;
          background: #fff7f7;
          border-color: #fee2e2;
        }

        .address-action.delete:hover {
          background: #fee2e2;
        }

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .address-empty {
          text-align: center;
          padding: 48px 24px;
        }

        .address-empty-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 17px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #eeedff;
          color: #4f46e5;
        }

        .address-empty h3 {
          margin: 0 0 7px;
          color: #17181d;
          font-size: 17px;
          font-weight: 800;
        }

        .address-empty p {
          max-width: 330px;
          margin: 0 auto 20px;
          color: #777987;
          font-size: 12px;
          line-height: 1.6;
        }

        .address-empty .ok-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* =====================================================
           LOADING SKELETON
        ===================================================== */

        .address-loading {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .address-skeleton {
          display: flex;
          gap: 12px;
          padding: 18px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid #e8e8ef;
        }

        .skeleton-icon {
          width: 42px;
          height: 42px;
          flex: none;
          border-radius: 13px;
          background: #eef0f5;
          animation: addressPulse 1.4s ease-in-out infinite;
        }

        .skeleton-content {
          flex: 1;
        }

        .skeleton-line {
          width: 80%;
          height: 10px;
          margin-bottom: 9px;
          border-radius: 999px;
          background: #eef0f5;
          animation: addressPulse 1.4s ease-in-out infinite;
        }

        .skeleton-line.skeleton-title {
          width: 35%;
          height: 12px;
        }

        .skeleton-line.short {
          width: 55%;
        }

        @keyframes addressPulse {
          0%, 100% {
            opacity: .55;
          }
          50% {
            opacity: 1;
          }
        }

        /* =====================================================
           HELPFUL TIP
        ===================================================== */

        .address-tip {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
          padding: 12px 14px;
          border: 1px solid #e8e8ef;
          border-radius: 14px;
          background: #fff;
        }

        .address-tip-icon {
          width: 32px;
          height: 32px;
          flex: none;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f1f5f9;
          color: #64748b;
        }

        .address-tip strong {
          display: block;
          margin-bottom: 2px;
          color: #374151;
          font-size: 11px;
          font-weight: 800;
        }

        .address-tip p {
          margin: 0;
          color: #858894;
          font-size: 10px;
          line-height: 1.4;
        }

        .address-tip-arrow {
          margin-left: auto;
          color: #9ca3af;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {
          .address-heading {
            align-items: flex-start;
          }

          .address-heading h2 {
            font-size: 19px;
          }

          .address-add-btn {
            width: 42px;
            height: 42px;
            min-height: 42px;
            padding: 0;
            border-radius: 12px;
          }

          .address-add-btn span {
            display: none;
          }

          .address-card {
            padding: 14px;
            border-radius: 16px;
          }

          .address-type-icon {
            width: 39px;
            height: 39px;
            border-radius: 12px;
          }

          .address-title-row h3 {
            font-size: 14px;
          }

          .address-body {
            margin-top: 12px;
            margin-bottom: 12px;
            padding: 10px;
          }

          .address-actions {
            gap: 7px;
          }

          .address-action {
            flex: 1;
            min-height: 38px;
          }

          .address-tip {
            padding: 11px;
          }
        }

        @media (max-width: 380px) {
          .address-contact {
            font-size: 10px;
          }

          .address-body p {
            font-size: 11px;
          }
        }
      `}</style>
    </AccountShell>
  );
}