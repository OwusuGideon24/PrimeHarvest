const nodemailer = require("nodemailer");

const requiredEmailVariables = [
  "SMTP_USER",
  "SMTP_PASSWORD",
];

const validateEmailConfiguration = () => {
  const missingVariables = requiredEmailVariables.filter(
    (variableName) => !process.env[variableName]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing email configuration: ${missingVariables.join(", ")}`
    );
  }
};

const createTransporter = () => {
  validateEmailConfiguration();

  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,

    logger:
      String(process.env.SMTP_DEBUG).toLowerCase() === "true",

    debug:
      String(process.env.SMTP_DEBUG).toLowerCase() === "true",
  });
};

const verifyEmailConnection = async () => {
  const transporter = createTransporter();

  try {
    await transporter.verify();

    console.log("SMTP connection is ready.");

    return true;
  } catch (error) {
    console.error("SMTP verification failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });

    return false;
  } finally {
    transporter.close();
  }
};

const sendPasswordResetEmail = async ({
  recipientEmail,
  recipientName,
  resetUrl,
}) => {
  if (!recipientEmail) {
    throw new Error("A recipient email address is required.");
  }

  if (!resetUrl) {
    throw new Error("A password reset URL is required.");
  }

  const transporter = createTransporter();

  try {
    const result = await transporter.sendMail({
      from: {
        name:
          process.env.SMTP_FROM_NAME ||
          "PrimeHarvest",

        address:
          process.env.SMTP_FROM_EMAIL ||
          process.env.SMTP_USER,
      },

      to: recipientEmail,

      subject: "Reset your PrimeHarvest password",

      text: `
Hello ${recipientName || "PrimeHarvest user"},

We received a request to reset your PrimeHarvest password.

Use this link to create a new password:

${resetUrl}

This link expires in 30 minutes and can only be used once.

If you did not request a password reset, you can ignore this email.

PrimeHarvest Support
      `.trim(),

      html: `
        <div
          style="
            background:#f1f5f9;
            padding:32px;
            font-family:Arial,sans-serif;
            color:#0f172a;
          "
        >
          <div
            style="
              max-width:600px;
              margin:0 auto;
              background:#ffffff;
              border-radius:24px;
              overflow:hidden;
            "
          >
            <div
              style="
                background:linear-gradient(
                  135deg,
                  #020617,
                  #064e3b,
                  #047857
                );
                padding:32px;
                color:#ffffff;
              "
            >
              <h1 style="margin:0;font-size:28px;">
                PrimeHarvest
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  color:#a7f3d0;
                "
              >
                Password reset request
              </p>
            </div>

            <div style="padding:32px;">
              <h2 style="margin-top:0;">
                Reset your password
              </h2>

              <p
                style="
                  line-height:1.7;
                  color:#475569;
                "
              >
                Hello ${recipientName || "PrimeHarvest user"},
              </p>

              <p
                style="
                  line-height:1.7;
                  color:#475569;
                "
              >
                We received a request to reset your
                PrimeHarvest password. Click the button below
                to create a new one.
              </p>

              <p style="margin:28px 0;">
                <a
                  href="${resetUrl}"
                  style="
                    display:inline-block;
                    background:#047857;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 24px;
                    border-radius:12px;
                    font-weight:bold;
                  "
                >
                  Reset Password
                </a>
              </p>

              <p
                style="
                  line-height:1.7;
                  color:#475569;
                "
              >
                This link expires in 30 minutes and can only
                be used once.
              </p>

              <p
                style="
                  line-height:1.7;
                  color:#475569;
                "
              >
                If you did not request this reset, you can
                safely ignore this email.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log(
      `Password reset email sent to ${recipientEmail}`
    );

    return result;
  } finally {
    transporter.close();
  }
};

if (
  String(process.env.SMTP_VERIFY).toLowerCase() === "true"
) {
  void verifyEmailConnection();
}

module.exports = {
  sendPasswordResetEmail,
  verifyEmailConnection,
};