import { Router } from "express";
import { generateQRCodeBuffer } from "./qrCodeGenerator";

const router = Router();

/**
 * POST /api/qr/download
 * Generate and download a QR code as PNG
 */
router.post("/download", async (req, res) => {
  try {
    const { url, propertyName } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Generate QR code buffer
    const buffer = await generateQRCodeBuffer(url);

    // Set response headers for file download
    const filename = propertyName
      ? `QR-${propertyName.replace(/\s+/g, "-")}.png`
      : "qr-code.png";

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);

    // Send the buffer
    res.send(buffer);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

/**
 * POST /api/qr/dataurl
 * Generate a QR code as data URL (for preview)
 */
router.post("/dataurl", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Generate QR code as data URL
    const { generateQRCodeDataUrl } = await import("./qrCodeGenerator");
    const dataUrl = await generateQRCodeDataUrl(url);

    res.json({ dataUrl });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

export default router;
