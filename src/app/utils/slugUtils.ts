/**
 * Generate a URL-friendly slug from a Vietnamese string
 * Automatically handles Vietnamese diacritics and special characters
 * 
 * @param text - The text to convert to slug
 * @returns URL-friendly slug
 * 
 * @example
 * generateSlug("Vi điều khiển") => "vi-dieu-khien"
 * generateSlug("Arduino Uno R3") => "arduino-uno-r3"
 * generateSlug("Cảm Biến Nhiệt Độ & Độ Ẩm") => "cam-bien-nhiet-do-do-am"
 */
export function generateSlug(text: string): string {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d") // Replace Vietnamese đ
    .replace(/Đ/g, "d") // Replace Vietnamese Đ
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim();
}

/**
 * Generate a unique slug by adding a suffix if the slug already exists
 * 
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 * 
 * @example
 * generateUniqueSlug("arduino-uno", ["arduino-uno"]) => "arduino-uno-1"
 * generateUniqueSlug("arduino-uno", ["arduino-uno", "arduino-uno-1"]) => "arduino-uno-2"
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}
