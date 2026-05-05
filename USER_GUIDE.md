# OpenLoop Property System — User Guide

Welcome to OpenLoop, your elegant real estate lead capture and management system. This guide walks you through all features and how to use them effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Properties](#managing-properties)
4. [QR Code Generation](#qr-code-generation)
5. [Lead Capture Form](#lead-capture-form)
6. [Managing Leads](#managing-leads)
7. [Setup & Integration](#setup--integration)
8. [Best Practices](#best-practices)

---

## Getting Started

### Logging In

1. Visit your OpenLoop dashboard URL
2. Click "Sign In" and authenticate with your Manus account
3. You'll be directed to the Properties dashboard

### First Steps

1. **Add a Property** — Create your first property listing
2. **Generate QR Code** — Download the QR code for printing
3. **Share QR Code** — Place it at your property or on marketing materials
4. **Monitor Leads** — Check the Leads dashboard for incoming inquiries

---

## Dashboard Overview

The dashboard has three main sections accessible from the left sidebar:

### Properties
Manage all your real estate listings and generate QR codes for each.

### Leads
View all incoming inquiries, track their status, and manage follow-ups.

### Setup Guide
Complete integration steps for Twilio SMS, Google Sheets, and Make.com automation.

---

## Managing Properties

### Adding a Property

1. Click **"Add Property"** button (top right)
2. Fill in the property details:
   - **Property Name** (required) — e.g., "Penthouse Agdal"
   - **Address** — Full property address
   - **Price** — Listing price
   - **Agent Phone** — Your contact number for leads
3. Click **"Create Property"**

### Editing a Property

1. Find the property in the table
2. Click the **Edit** (pencil) icon
3. Update any details
4. Click **"Update Property"**

### Deleting a Property

1. Find the property in the table
2. Click the **Delete** (trash) icon
3. Confirm the deletion

---

## QR Code Generation

### Downloading QR Codes

Each property has two QR code options:

#### Download as PNG
1. Click the **"Download"** button next to your property
2. The QR code will download as a PNG file
3. Use this for printing on signs, flyers, or marketing materials

#### Print Directly
1. Click the **"Print"** button next to your property
2. A print-friendly window opens with the QR code
3. Adjust print settings and click **"Print"**

### QR Code Details

- Each QR code is **unique** to its property
- When scanned, it links to the public lead capture form
- The form automatically loads the property details
- Visitors can submit their information directly

---

## Lead Capture Form

### What Visitors See

When someone scans your QR code, they see:

1. **Property Details** — Name, address, and price
2. **Contact Form** with fields:
   - Name (required)
   - Phone number (required)
   - Timeline/Intent (required):
     - **Buy Now** — Ready to purchase immediately
     - **This Week** — Interested in viewing this week
     - **Exploring** — Just browsing/gathering information
3. **Submit Button**

### After Submission

- Visitor sees a thank you message
- An SMS is automatically sent to their phone
- Lead is recorded in your dashboard
- Data is synced to Google Sheets (if configured)
- You receive a notification

---

## Managing Leads

### Viewing Leads

The **Leads** page shows all incoming inquiries in a table with:
- **Lead ID** — Unique identifier
- **Name** — Visitor's name
- **Phone** — Contact number
- **Property** — Which property they inquired about
- **Intent** — Their timeline/interest level
- **Status** — Current lead status
- **Date** — When they submitted

### Filtering Leads

Use the filter controls to find specific leads:

1. **Search** — Find by name or phone number
2. **Filter by Property** — Show leads for a specific property
3. **Filter by Status** — Show leads by their current status

### Updating Lead Status

Lead status tracks your progress with each inquiry:

- **New** — Just received, not yet contacted
- **Engaged** — You've contacted them, they're interested
- **Booked** — Viewing or transaction in progress
- **Cold** — No longer interested or unresponsive

To update status:
1. Click the **Status** dropdown for a lead
2. Select the new status
3. Status updates immediately

### Lead Statistics

At the bottom of the Leads page, see a quick summary:
- Total leads received
- Leads by status (New, Engaged, Booked)

---

## Setup & Integration

### Overview

OpenLoop integrates with three external services to automate your workflow:

1. **Twilio** — Sends SMS notifications to leads
2. **Google Sheets** — Stores all lead data in a spreadsheet
3. **Make.com** — Orchestrates the automation between services

### Setup Guide Tab

The **Setup Guide** in your dashboard provides step-by-step instructions for:

1. **Google Sheets Setup** — Create your lead tracking spreadsheet
2. **Make.com Setup** — Configure automation workflows
3. **Twilio Setup** — Set up SMS messaging
4. **Deployment & Testing** — Test everything before going live

### Quick Setup Checklist

Follow the interactive checklist in the Setup Guide tab to track your progress through:
- Google Sheets configuration
- Make.com scenario creation
- Twilio account setup
- Final testing and deployment

---

## Best Practices

### QR Code Placement

- **At Property** — Place QR codes on signs at the property entrance
- **Marketing Materials** — Include in flyers, brochures, and postcards
- **Digital** — Share on social media, property listings, and emails
- **Multiple Locations** — Use multiple QR codes at different property areas

### Lead Follow-up

1. **Respond Quickly** — Contact leads within 24 hours
2. **Personalize** — Reference the property they inquired about
3. **Provide Value** — Share additional property details or scheduling options
4. **Track Status** — Update lead status as conversations progress

### Data Management

- **Regular Reviews** — Check your Leads dashboard daily
- **Google Sheets** — Use your synced sheet for reporting and analysis
- **Backup** — Keep records of important lead conversations
- **Privacy** — Only use lead data for legitimate property inquiries

### SMS Best Practices

- **Timing** — Send SMS follow-ups during business hours
- **Frequency** — Don't overwhelm leads with too many messages
- **Personalization** — The SMS includes their name and property name
- **Call to Action** — Include clear next steps (schedule viewing, call, etc.)

---

## Troubleshooting

### QR Code Not Working

- Verify the QR code was downloaded successfully
- Check that the code is clearly printed and not damaged
- Try scanning with multiple devices
- Ensure your internet connection is working

### SMS Not Received

- Verify Twilio credentials are correct in Setup Guide
- Check that the phone number format is correct (+1234567890)
- Ensure Twilio account has available credits
- Check SMS logs in Twilio console

### Leads Not Syncing to Google Sheets

- Verify Google Apps Script deployment URL is correct
- Check Make.com scenario is active
- Review Make.com execution logs for errors
- Test with a sample lead submission

### Form Not Loading

- Clear your browser cache
- Try a different browser
- Verify the property ID in the QR code URL
- Check that the property exists in your dashboard

---

## Support

For technical issues or questions:

1. Check the Setup Guide for detailed integration instructions
2. Review the troubleshooting section above
3. Contact support through your Manus account

---

## Key Features Summary

✅ **Property Management** — Add, edit, delete properties  
✅ **QR Code Generation** — Download or print unique codes  
✅ **Lead Capture** — Beautiful public form for inquiries  
✅ **SMS Notifications** — Automatic personalized messages  
✅ **Google Sheets Sync** — All leads stored in spreadsheet  
✅ **Lead Dashboard** — Track and manage all inquiries  
✅ **Status Tracking** — Monitor lead progress  
✅ **Setup Checklist** — Step-by-step integration guide  

---

**Welcome to OpenLoop. Start capturing leads today!**
