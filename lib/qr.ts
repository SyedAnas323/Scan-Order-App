import QRCode from "qrcode";

export async function generateQrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    margin: 2,
    width: 360,
    color: {
      dark: "#3D1E0D",
      light: "#FFF8EF"
    }
  });
}
