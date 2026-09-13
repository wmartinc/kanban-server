const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.APP_PASSWORD
  }
})

/**
 * Generates an HTML email template for OTP verification.
 * @param {string} otp - The one-time password code to display.
 * @param {number} expiresInMinutes - How many minutes the OTP is valid.
 * @returns {string} The complete HTML string ready to be sent as email body.
 */
const emailTemplate = (otp, expiresInMinutes = 10) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tu código de verificación</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0f0f13; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f13; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #1a1a24; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a3d;">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%); padding: 36px 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                  🔐 Verificación de identidad
                </h1>
                <p style="margin: 8px 0 0; color: rgba(255,255,255,0.75); font-size: 14px;">
                  Kanban App — Seguridad de cuenta
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">

                <p style="margin: 0 0 24px; color: #c4c4d4; font-size: 15px; line-height: 1.6;">
                  Hemos recibido una solicitud para acceder a tu cuenta. Usa el siguiente código de un solo uso para completar el proceso:
                </p>

                <!-- OTP Box -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 8px 0 32px;">
                      <div style="
                        display: inline-block;
                        background: linear-gradient(135deg, #1e1e2e, #252538);
                        border: 2px solid #6c63ff;
                        border-radius: 12px;
                        padding: 20px 48px;
                        box-shadow: 0 0 24px rgba(108, 99, 255, 0.25);
                      ">
                        <span style="
                          font-size: 42px;
                          font-weight: 800;
                          letter-spacing: 12px;
                          color: #a89dff;
                          font-family: 'Courier New', Courier, monospace;
                        ">${otp}</span>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Expiry notice -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                  <tr>
                    <td style="
                      background-color: #1e1e2e;
                      border-left: 4px solid #f59e0b;
                      border-radius: 0 8px 8px 0;
                      padding: 14px 18px;
                    ">
                      <p style="margin: 0; color: #fbbf24; font-size: 13px; font-weight: 600;">
                        ⏳ Este código expira en <strong>${expiresInMinutes} minutos</strong>.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Security disclaimer -->
                <p style="margin: 0; color: #6b6b80; font-size: 12px; line-height: 1.7; border-top: 1px solid #2a2a3d; padding-top: 24px;">
                  Si no solicitaste este código, puedes ignorar este correo de forma segura. Nunca compartas este código con nadie. Nuestro equipo jamás te lo pedirá.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #12121a; padding: 20px 40px; text-align: center; border-top: 1px solid #2a2a3d;">
                <p style="margin: 0; color: #4a4a5e; font-size: 12px;">
                  © ${new Date().getFullYear()} Kanban App · Este es un correo automático, por favor no respondas.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
/**
 * Generates a random numeric OTP (One-Time Password).
 * @param {number} length - Number of digits for the OTP (default: 6).
 * @returns {string} A zero-padded random numeric string of the given length.
 */
const generateOTP = (length = 6) => {
  const max = Math.pow(10, length)
  const min = Math.pow(10, length - 1)
  const otp = Math.floor(Math.random() * (max - min)) + min
  return String(otp)
}

module.exports = { transporter, emailTemplate, generateOTP }
