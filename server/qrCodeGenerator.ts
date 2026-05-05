import * as QRCode from 'qrcode';

/**
 * Generate a QR code as a data URL
 * @param text The text/URL to encode in the QR code
 * @returns A data URL of the QR code as PNG
 */
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      width: 300,
      color: {
        dark: '#0a0a0a',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate a QR code as a buffer
 * @param text The text/URL to encode in the QR code
 * @returns A buffer of the QR code as PNG
 */
export async function generateQRCodeBuffer(text: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(text, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      width: 300,
      color: {
        dark: '#0a0a0a',
        light: '#ffffff',
      },
    });
    return buffer as Buffer;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}
