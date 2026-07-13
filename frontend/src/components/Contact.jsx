import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [feedback, setFeedback] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (feedback) {
      setFeedback("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFeedback(
      "Your message has been prepared. Contact delivery will be connected during backend integration."
    );
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Contact Us
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Need help with your account?
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Contact the PrimeHarvest support team for account,
            deposit, investment, or withdrawal assistance.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-700 p-6 text-white sm:p-8 lg:p-10">
            <p className="text-sm font-semibold text-emerald-200">
              Support Information
            </p>

            <h3 className="mt-3 text-2xl font-black sm:text-3xl">
              We are here to assist you.
            </h3>

            <p className="mt-4 leading-7 text-slate-200">
              Share your question with our support team and include
              enough detail to help us understand the issue.
            </p>

            <div className="mt-8 space-y-4">
              <ContactItem
                icon="✉"
                title="Email"
                value="support@primeharvest.com"
              />

              <ContactItem
                icon="☎"
                title="Phone"
                value="+233 549 022 138"
              />

              <ContactItem
                icon="🕒"
                title="Support Hours"
                value="Monday to Friday"
              />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="font-bold">
                Account safety reminder
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Never share your password or authentication token
                with anyone claiming to represent support.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10"
          >
            {feedback && (
              <div
                className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                role="alert"
              >
                {feedback}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <ContactField
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <ContactField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <div className="sm:col-span-2">
                <ContactField
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What do you need help with?"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-semibold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe your issue or question..."
                  required
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={`contact-${name}`}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={`contact-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function ContactItem({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-300">
          {title}
        </p>

        <p className="mt-1 font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Contact;