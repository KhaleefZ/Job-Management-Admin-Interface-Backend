// Email utility functions for notifications
export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export function generateApplicationConfirmationEmail(
  applicantName: string,
  jobTitle: string,
  companyName: string,
): EmailTemplate {
  return {
    to: "",
    subject: `Application Confirmation - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Submitted Successfully</h2>
        <p>Dear ${applicantName},</p>
        <p>Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p>We have received your application and will review it shortly. You will be notified of any updates regarding your application status.</p>
        <p>Best regards,<br>The ${companyName} Team</p>
      </div>
    `,
  }
}

export function generateStatusUpdateEmail(
  applicantName: string,
  jobTitle: string,
  companyName: string,
  newStatus: string,
): EmailTemplate {
  const statusMessages = {
    shortlisted: "Congratulations! You have been shortlisted for the next round.",
    hired: "Congratulations! You have been selected for this position.",
    rejected: "Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.",
  }

  return {
    to: "",
    subject: `Application Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Status Update</h2>
        <p>Dear ${applicantName},</p>
        <p>We have an update regarding your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p><strong>Status:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
        <p>${statusMessages[newStatus as keyof typeof statusMessages] || "Your application status has been updated."}</p>
        <p>Best regards,<br>The ${companyName} Team</p>
      </div>
    `,
  }
}
