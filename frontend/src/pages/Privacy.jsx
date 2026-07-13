import { Link } from "react-router-dom";

function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50">
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
              Privacy and Data
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-200">
              How PrimeHarvest collects, uses, stores, and protects
              account information.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-medium text-slate-500">
            Last updated: July 2026
          </p>

          <PrivacySection title="1. Information we collect">
            <p>
              PrimeHarvest may collect information provided during
              registration, including your name, email address,
              referral code, contact information, and account
              credentials.
            </p>

            <p>
              We may also store wallet activity, deposits,
              investments, withdrawals, referral activity, support
              communications, and technical account records.
            </p>
          </PrivacySection>

          <PrivacySection title="2. How information is used">
            <p>
              Information may be used to create and manage accounts,
              process platform requests, display transaction
              history, prevent fraud, provide support, and improve
              platform reliability.
            </p>
          </PrivacySection>

          <PrivacySection title="3. Authentication information">
            <p>
              Passwords should be stored using secure hashing and
              should never be stored as readable plain text.
              Authentication tokens are used to control access to
              protected platform features.
            </p>
          </PrivacySection>

          <PrivacySection title="4. Financial activity">
            <p>
              Transaction and wallet records may be retained for
              operational, security, dispute-resolution, and
              reporting purposes.
            </p>
          </PrivacySection>

          <PrivacySection title="5. Information sharing">
            <p>
              PrimeHarvest does not sell personal information.
              Information may only be shared when needed to operate
              the service, comply with legal obligations, investigate
              fraud, or protect users and the platform.
            </p>
          </PrivacySection>

          <PrivacySection title="6. Data security">
            <p>
              Reasonable technical and organisational safeguards are
              used to protect account information. However, no
              internet-based system can guarantee absolute security.
            </p>

            <p>
              Users should use strong passwords, avoid sharing login
              details, and immediately report suspicious account
              activity.
            </p>
          </PrivacySection>

          <PrivacySection title="7. Cookies and local storage">
            <p>
              The application may use browser storage to maintain
              authentication sessions, remember selected preferences,
              and improve the user experience.
            </p>
          </PrivacySection>

          <PrivacySection title="8. Data retention">
            <p>
              Account and transaction information may be retained for
              as long as reasonably necessary to provide the service,
              satisfy security requirements, resolve disputes, and
              meet applicable obligations.
            </p>
          </PrivacySection>

          <PrivacySection title="9. User choices">
            <p>
              Users may request corrections to inaccurate account
              information. Some records may need to be preserved when
              they relate to financial activity, security, or legal
              obligations.
            </p>
          </PrivacySection>

          <PrivacySection title="10. Policy updates">
            <p>
              This privacy policy may be updated as PrimeHarvest adds
              features or changes its data practices. The latest
              version will be made available through the platform.
            </p>
          </PrivacySection>

          <PrivacySection title="11. Contact">
            <p>
              Privacy questions or account-data concerns should be
              sent to the PrimeHarvest support team.
            </p>
          </PrivacySection>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/register"
            className="rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-7 py-4 text-center font-bold text-white shadow-lg"
          >
            Return to Registration
          </Link>

          <Link
            to="/terms"
            className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Read Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}

function PrivacySection({ title, children }) {
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

export default Privacy;