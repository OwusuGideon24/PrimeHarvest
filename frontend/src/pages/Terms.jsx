import { Link } from "react-router-dom";

function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LegalHeader
        title="Terms of Service"
        description="The rules and conditions governing the use of PrimeHarvest."
      />

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-medium text-slate-500">
            Last updated: July 2026
          </p>

          <LegalSection title="1. Acceptance of these terms">
            <p>
              By creating an account or using PrimeHarvest, you
              confirm that you have read, understood, and agreed
              to these terms. You should not use the platform if
              you do not agree with them.
            </p>
          </LegalSection>

          <LegalSection title="2. Account registration">
            <p>
              You must provide accurate information when creating
              an account. You are responsible for keeping your
              password confidential and for activity performed
              through your account.
            </p>

            <p>
              You must notify support promptly if you believe your
              account has been accessed without permission.
            </p>
          </LegalSection>

          <LegalSection title="3. Platform services">
            <p>
              PrimeHarvest provides tools for managing wallet
              activity, deposits, investment plans, transactions,
              referrals, and withdrawal requests.
            </p>

            <p>
              Available services, payment methods, plan details,
              limits, and processing times may change as the
              platform develops.
            </p>
          </LegalSection>

          <LegalSection title="4. Deposits and payments">
            <p>
              Users must follow the payment instructions displayed
              on the platform. Deposit requests may require
              administrative review before funds are credited.
            </p>

            <p>
              Users are responsible for checking payment details
              carefully before sending funds.
            </p>
          </LegalSection>

          <LegalSection title="5. Investment plans">
            <p>
              Each investment plan may have its own entry amount,
              duration, daily return, total return, and availability
              status. Users should review all plan information
              before confirming an investment.
            </p>

            <p>
              Historical activity or displayed projections should
              not be interpreted as a guarantee of future results.
            </p>
          </LegalSection>

          <LegalSection title="6. Withdrawals">
            <p>
              Withdrawal requests may be subject to minimum limits,
              account checks, available balance requirements, and
              administrative approval.
            </p>

            <p>
              Users must provide correct destination information.
              PrimeHarvest may not be able to reverse funds sent to
              an incorrect destination supplied by a user.
            </p>
          </LegalSection>

          <LegalSection title="7. Referral programme">
            <p>
              Referral rewards may only be credited when the
              applicable qualification requirements have been met.
              Fraudulent, duplicate, or self-referred accounts may
              be rejected.
            </p>
          </LegalSection>

          <LegalSection title="8. Prohibited activity">
            <p>
              Users must not attempt to access another person’s
              account, manipulate balances, submit false payment
              information, exploit platform errors, or use the
              service for unlawful activity.
            </p>
          </LegalSection>

          <LegalSection title="9. Suspension and termination">
            <p>
              PrimeHarvest may restrict or suspend an account when
              suspicious activity, policy violations, fraud, or a
              security risk is detected.
            </p>
          </LegalSection>

          <LegalSection title="10. Service availability">
            <p>
              The platform may occasionally be unavailable because
              of maintenance, upgrades, security work, or events
              beyond reasonable control.
            </p>
          </LegalSection>

          <LegalSection title="11. Changes to these terms">
            <p>
              These terms may be updated as the platform and its
              services evolve. Continued use after an update means
              that the revised terms have been accepted.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              Questions about these terms should be directed to the
              PrimeHarvest support team using the contact details
              displayed on the platform.
            </p>
          </LegalSection>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/register"
            className="rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-7 py-4 text-center font-bold text-white shadow-lg"
          >
            Return to Registration
          </Link>

          <Link
            to="/privacy"
            className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Read Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
}

function LegalHeader({ title, description }) {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 text-white">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        <Link
          to="/"
          className="flex w-fit items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white font-black text-emerald-900">
            P
          </div>

          <span className="text-xl font-black">
            PrimeHarvest
          </span>
        </Link>

        <div className="py-14 text-center sm:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Legal Information
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-200">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}

function LegalSection({ title, children }) {
  return (
    <section className="border-b border-slate-200 py-7 last:border-b-0">
      <h2 className="text-xl font-bold text-slate-950">
        {title}
      </h2>

      <div className="mt-4 space-y-4 leading-8 text-slate-600">
        {children}
      </div>
    </section>
  );
}

export default Terms;