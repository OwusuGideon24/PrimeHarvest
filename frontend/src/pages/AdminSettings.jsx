import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const DEFAULT_SETTINGS = {
  company_name: "",
  support_email: "",
  support_phone: "",
  minimum_deposit: "",
  minimum_withdrawal: "",
  daily_profit_rate: "",
  referral_bonus: "",
  usdt_trc20_wallet: "",
  usdt_bep20_wallet: "",
  bitcoin_wallet: "",
  ethereum_wallet: "",
  deposits_enabled: false,
  withdrawals_enabled: false,
  maintenance_mode: false,
};

function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] =
    useState(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const token = localStorage.getItem("token");

  const normalizeSettings = (data = {}) => ({
    ...DEFAULT_SETTINGS,
    ...data,
    deposits_enabled: Boolean(data.deposits_enabled),
    withdrawals_enabled: Boolean(data.withdrawals_enabled),
    maintenance_mode: Boolean(data.maintenance_mode),
  });

  const fetchSettings = useCallback(
    async ({ showRefreshLoader = false } = {}) => {
      if (!token) {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Your login session has expired.",
        });
        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        }

        setMessage({
          type: "",
          text: "",
        });

        const response = await api.get(
          "/admin/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData =
          response.data?.settings || response.data || {};

        const normalizedData =
          normalizeSettings(responseData);

        setSettings(normalizedData);
        setSavedSettings(normalizedData);
      } catch (error) {
        console.error(
          "Unable to load platform settings:",
          error.response?.data?.message || error.message
        );

        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Unable to load platform settings.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSettings();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchSettings]);

  const hasChanges = useMemo(
    () =>
      JSON.stringify(settings) !==
      JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const validateSettings = () => {
    if (!settings.company_name.trim()) {
      return "Please enter the company name.";
    }

    if (
      settings.support_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        settings.support_email
      )
    ) {
      return "Please enter a valid support email address.";
    }

    if (Number(settings.minimum_deposit) < 0) {
      return "Minimum deposit cannot be negative.";
    }

    if (Number(settings.minimum_withdrawal) < 0) {
      return "Minimum withdrawal cannot be negative.";
    }

    if (Number(settings.daily_profit_rate) < 0) {
      return "Daily profit rate cannot be negative.";
    }

    if (Number(settings.referral_bonus) < 0) {
      return "Referral reward cannot be negative.";
    }

    return "";
  };

  const saveSettings = async (event) => {
    event.preventDefault();

    if (!token || saving || !hasChanges) {
      return;
    }

    const validationError = validateSettings();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });
      return;
    }

    const requestData = {
      ...settings,
      company_name: settings.company_name.trim(),
      support_email: settings.support_email.trim(),
      support_phone: settings.support_phone.trim(),
      minimum_deposit: Number(
        settings.minimum_deposit || 0
      ),
      minimum_withdrawal: Number(
        settings.minimum_withdrawal || 0
      ),
      daily_profit_rate: Number(
        settings.daily_profit_rate || 0
      ),
      referral_bonus: Number(
        settings.referral_bonus || 0
      ),
      usdt_trc20_wallet:
        settings.usdt_trc20_wallet.trim(),
      usdt_bep20_wallet:
        settings.usdt_bep20_wallet.trim(),
      bitcoin_wallet: settings.bitcoin_wallet.trim(),
      ethereum_wallet: settings.ethereum_wallet.trim(),
      deposits_enabled: Boolean(
        settings.deposits_enabled
      ),
      withdrawals_enabled: Boolean(
        settings.withdrawals_enabled
      ),
      maintenance_mode: Boolean(
        settings.maintenance_mode
      ),
    };

    try {
      setSaving(true);
      setMessage({
        type: "",
        text: "",
      });

      const response = await api.put(
        "/admin/settings",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const returnedSettings =
        response.data?.settings || requestData;

      const normalizedData =
        normalizeSettings(returnedSettings);

      setSettings(normalizedData);
      setSavedSettings(normalizedData);

      setMessage({
        type: "success",
        text:
          response.data?.message ||
          "Platform settings updated successfully.",
      });
    } catch (error) {
      console.error(
        "Unable to save platform settings:",
        error.response?.data?.message || error.message
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to save platform settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    setSettings(savedSettings);
    setMessage({
      type: "",
      text: "",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 font-semibold text-slate-600">
            Loading platform settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              Platform Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Platform Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Configure company details, financial limits,
              payment destinations, rewards, and platform
              availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void fetchSettings({
                showRefreshLoader: true,
              })
            }
            disabled={refreshing || saving}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Settings"}
          </button>
        </div>
      </section>

      {message.text && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard
          title="Deposits"
          enabled={settings.deposits_enabled}
        />

        <StatusCard
          title="Withdrawals"
          enabled={settings.withdrawals_enabled}
        />

        <StatusCard
          title="Platform"
          enabled={!settings.maintenance_mode}
          enabledLabel="Online"
          disabledLabel="Maintenance"
        />
      </section>

      <form onSubmit={saveSettings} className="space-y-6">
        <SettingsSection
          title="Company Information"
          description="Contact details displayed to users for platform support."
          icon="🏢"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="Company Name"
              name="company_name"
              value={settings.company_name}
              onChange={handleChange}
              placeholder="PrimeHarvest"
              required
              disabled={saving}
            />

            <FormField
              label="Support Email"
              name="support_email"
              type="email"
              value={settings.support_email}
              onChange={handleChange}
              placeholder="support@example.com"
              disabled={saving}
            />

            <FormField
              label="Support Phone"
              name="support_phone"
              type="tel"
              value={settings.support_phone}
              onChange={handleChange}
              placeholder="+233..."
              disabled={saving}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Financial Settings"
          description="Configure minimum transaction values and platform rewards."
          icon="💰"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <CurrencyField
              label="Minimum Deposit"
              name="minimum_deposit"
              value={settings.minimum_deposit}
              onChange={handleChange}
              disabled={saving}
            />

            <CurrencyField
              label="Minimum Withdrawal"
              name="minimum_withdrawal"
              value={settings.minimum_withdrawal}
              onChange={handleChange}
              disabled={saving}
            />

            <div>
              <label
                htmlFor="daily_profit_rate"
                className="text-sm font-semibold text-slate-700"
              >
                Daily Profit Rate
              </label>

              <div className="relative mt-2">
                <input
                  id="daily_profit_rate"
                  type="number"
                  name="daily_profit_rate"
                  min="0"
                  step="0.01"
                  value={settings.daily_profit_rate}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                />

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 font-semibold text-slate-500">
                  %
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                General platform rate. Individual plans may use
                their own return values.
              </p>
            </div>

            <CurrencyField
              label="Referral Reward"
              name="referral_bonus"
              value={settings.referral_bonus}
              onChange={handleChange}
              disabled={saving}
              helpText="Reward credited for a qualifying referral."
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Deposit Destinations"
          description="Payment details shown to users when making deposits."
          icon="🏦"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="USDT TRC20 Wallet"
              name="usdt_trc20_wallet"
              value={settings.usdt_trc20_wallet}
              onChange={handleChange}
              placeholder="Enter USDT TRC20 wallet address"
              disabled={saving}
              inputClassName="font-mono"
            />

            <FormField
              label="MTN Mobile Money Number"
              name="usdt_bep20_wallet"
              value={settings.usdt_bep20_wallet}
              onChange={handleChange}
              placeholder="Enter MTN MoMo number"
              disabled={saving}
              helpText="This keeps the existing backend field name used by your application."
            />

            <FormField
              label="Bitcoin Wallet"
              name="bitcoin_wallet"
              value={settings.bitcoin_wallet}
              onChange={handleChange}
              placeholder="Enter Bitcoin wallet address"
              disabled={saving}
              inputClassName="font-mono"
            />

            <FormField
              label="Ethereum Wallet"
              name="ethereum_wallet"
              value={settings.ethereum_wallet}
              onChange={handleChange}
              placeholder="Enter Ethereum wallet address"
              disabled={saving}
              inputClassName="font-mono"
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Platform Controls"
          description="Turn major platform operations on or off."
          icon="⚙️"
        >
          <div className="space-y-4">
            <ToggleSetting
              name="deposits_enabled"
              title="Enable Deposits"
              description="Allow users to submit new deposit requests."
              checked={settings.deposits_enabled}
              onChange={handleChange}
              disabled={saving}
            />

            <ToggleSetting
              name="withdrawals_enabled"
              title="Enable Withdrawals"
              description="Allow users to submit withdrawal requests."
              checked={settings.withdrawals_enabled}
              onChange={handleChange}
              disabled={saving}
            />

            <ToggleSetting
              name="maintenance_mode"
              title="Maintenance Mode"
              description="Temporarily restrict normal platform access during updates."
              checked={settings.maintenance_mode}
              onChange={handleChange}
              disabled={saving}
              danger
            />
          </div>

          {settings.maintenance_mode && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">
                Maintenance mode is enabled
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Confirm that your backend middleware enforces
                maintenance mode before relying on this setting.
              </p>
            </div>
          )}
        </SettingsSection>

        <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:rounded-3xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                {hasChanges
                  ? "You have unsaved changes"
                  : "All settings are saved"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Review financial and payment information carefully
                before saving.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetChanges}
                disabled={!hasChanges || saving}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reset Changes
              </button>

              <button
                type="submit"
                disabled={!hasChanges || saving}
                className="rounded-xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-7 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  icon,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  helpText = "",
  inputClassName = "",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 ${inputClassName}`}
      />

      {helpText && (
        <p className="mt-2 text-xs text-slate-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

function CurrencyField({
  label,
  name,
  value,
  onChange,
  disabled,
  helpText = "",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-500">
          $
        </span>

        <input
          id={name}
          type="number"
          name={name}
          min="0"
          step="0.01"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="0.00"
          className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
        />
      </div>

      {helpText && (
        <p className="mt-2 text-xs text-slate-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

function ToggleSetting({
  name,
  title,
  description,
  checked,
  onChange,
  disabled,
  danger = false,
}) {
  return (
    <label
      htmlFor={name}
      className={`flex cursor-pointer items-center justify-between gap-5 rounded-2xl border p-4 transition sm:p-5 ${
        checked
          ? danger
            ? "border-red-200 bg-red-50"
            : "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50 hover:border-slate-300"
      }`}
    >
      <div>
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="relative shrink-0">
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />

        <div
          className={`h-7 w-12 rounded-full transition peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${
            danger
              ? "bg-slate-300 peer-checked:bg-red-600"
              : "bg-slate-300 peer-checked:bg-emerald-600"
          }`}
        />

        <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

function StatusCard({
  title,
  enabled,
  enabledLabel = "Enabled",
  disabledLabel = "Disabled",
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-xl font-bold ${
              enabled ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {enabled ? enabledLabel : disabledLabel}
          </p>
        </div>

        <span
          className={`h-3 w-3 rounded-full ${
            enabled
              ? "bg-emerald-500"
              : "bg-red-500"
          }`}
        />
      </div>
    </article>
  );
}

export default AdminSettings;