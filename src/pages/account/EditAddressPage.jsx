import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountShell, api } from "./AccountShell";
import { AddressForm } from "./AddAddressPage";

export default function EditAddressPage() {
  const id = window.location.pathname
    .split("/")
    .filter(Boolean)
    .slice(-2, -1)[0];

  const [f, setF] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load address
  useEffect(() => {
    const loadAddress = async () => {
      try {
        setLoading(true);

        // Backend currently provides GET /api/addresses
        const d = await api("/api/addresses");

        const addresses = d.addresses || d.data || [];

        const address = addresses.find(
          (item) => String(item._id || item.id) === String(id)
        );

        if (!address) {
          throw new Error("Address not found");
        }

        setF(address);
      } catch (e) {
        console.error("Load address error:", e);
        toast.error(e.message || "Failed to load address");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAddress();
    } else {
      setLoading(false);
      toast.error("Invalid address ID");
    }
  }, [id]);

  const set = (key, value) => {
    setF((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // Update address
  const save = async () => {
    if (!id) {
      toast.error("Invalid address ID");
      return;
    }

    setSaving(true);

    try {
      const d = await api(`/api/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          label: f.label || "Home",
          fullName: f.fullName,
          phone: f.phone,
          alternatePhone: f.alternatePhone || "",
          addressLine1: f.addressLine1,
          addressLine2: f.addressLine2 || "",
          landmark: f.landmark || "",
          area: f.area,
          city: f.city,
          district: f.district,
          state: f.state,
          postalCode: f.postalCode,
          country: f.country || "India",
          location: f.location || {
            latitude: null,
            longitude: null,
          },
          isDefault: Boolean(f.isDefault),
        }),
      });

      toast.success(
        d.message || "Address updated successfully"
      );

      setTimeout(() => {
        window.location.href = "/account/addresses";
      }, 500);
    } catch (e) {
      console.error("Update address error:", e);
      toast.error(e.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AccountShell title="Edit address">
        <div className="ok-card ok-empty">
          Loading address...
        </div>
      </AccountShell>
    );
  }

  if (!f) {
    return (
      <AccountShell title="Edit address">
        <div className="ok-card ok-empty">
          <h3>Address not found</h3>
          <p className="ok-muted">
            This address may have been deleted or is no longer available.
          </p>

          <button
            className="ok-btn ok-primary"
            style={{ marginTop: 18 }}
            onClick={() => {
              window.location.href = "/account/addresses";
            }}
          >
            Back to addresses
          </button>
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell title="Edit address">
      <AddressForm
        title="Edit address"
        f={f}
        set={set}
        save={save}
        saving={saving}
        submit="Save changes"
      />
    </AccountShell>
  );
}