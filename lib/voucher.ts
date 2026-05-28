/**
 * Voucher code generator for Congo Booking App
 */

/**
 * Generates a unique voucher code based on the city.
 * Format: BZV-YYMM-XXXX or PNR-YYMM-XXXX
 * Where BZV/PNR is the city code, YYMM is current year/month, and XXXX is a random alphanumeric code.
 */
export function generateVoucherCode(city: string): string {
  const cityPrefix = city.toLowerCase().includes('pointe') || city.toLowerCase().includes('pnr') 
    ? 'PNR' 
    : 'BZV';
  
  const now = new Date();
  const year = String(now.getFullYear()).substring(2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${cityPrefix}-${year}${month}-${randomPart}`;
}
