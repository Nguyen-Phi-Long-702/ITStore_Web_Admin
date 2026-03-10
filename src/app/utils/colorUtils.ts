/**
 * Mapping màu sắc tiếng Việt sang mã màu hex
 */
export const colorNameToHex: Record<string, string> = {
  // Màu cơ bản
  "đen": "#000000",
  "trắng": "#FFFFFF",
  "xám": "#808080",
  "xám đậm": "#4B5563",
  "xám nhạt": "#D1D5DB",
  
  // Màu đỏ
  "đỏ": "#EF4444",
  "đỏ đậm": "#DC2626",
  "đỏ nhạt": "#FCA5A5",
  "đỏ tươi": "#FF0000",
  
  // Màu cam
  "cam": "#F97316",
  "cam đậm": "#EA580C",
  "cam nhạt": "#FDBA74",
  
  // Màu vàng
  "vàng": "#FCD34D",
  "vàng đậm": "#F59E0B",
  "vàng nhạt": "#FEF3C7",
  "vàng chanh": "#FBBF24",
  
  // Màu xanh lá
  "xanh lá": "#10B981",
  "xanh lá đậm": "#059669",
  "xanh lá nhạt": "#6EE7B7",
  "xanh lục": "#22C55E",
  
  // Màu xanh dương
  "xanh": "#3B82F6",
  "xanh dương": "#3B82F6",
  "xanh đậm": "#1D4ED8",
  "xanh nhạt": "#93C5FD",
  "xanh da trời": "#0EA5E9",
  "xanh navy": "#1E3A8A",
  
  // Màu tím
  "tím": "#8B5CF6",
  "tím đậm": "#6D28D9",
  "tím nhạt": "#C4B5FD",
  "tím hồng": "#D946EF",
  
  // Màu hồng
  "hồng": "#EC4899",
  "hồng đậm": "#DB2777",
  "hồng nhạt": "#F9A8D4",
  
  // Màu nâu
  "nâu": "#92400E",
  "nâu đậm": "#78350F",
  "nâu nhạt": "#D97706",
  
  // Màu bạc và vàng kim loại
  "bạc": "#C0C0C0",
  "vàng kim": "#FFD700",
  "đồng": "#B87333",
  "hồng vàng": "#FFB6C1",
  
  // Màu khác
  "be": "#F5F5DC",
  "kem": "#FFFDD0",
  "xanh lơ": "#00CED1",
  "xanh ngọc": "#40E0D0",
  "xanh mint": "#98FF98",
  "đỏ burgundy": "#800020",
};

/**
 * Chuyển đổi tên màu tiếng Việt sang mã hex
 * @param colorName - Tên màu bằng tiếng Việt
 * @returns Mã màu hex hoặc undefined nếu không tìm thấy
 */
export function getColorHex(colorName: string | undefined): string | undefined {
  if (!colorName) return undefined;
  
  const normalized = colorName.toLowerCase().trim();
  return colorNameToHex[normalized];
}

/**
 * Kiểm tra xem một chuỗi có phải là mã màu hex hợp lệ không
 * @param color - Chuỗi cần kiểm tra
 * @returns true nếu là mã hex hợp lệ
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Chuyển đổi tên màu hoặc mã hex về mã hex chuẩn
 * Nếu input là hex hợp lệ thì trả về nguyên bản
 * Nếu input là tên màu thì chuyển sang hex
 * @param input - Tên màu hoặc mã hex
 * @returns Mã màu hex hoặc undefined
 */
export function normalizeColor(input: string | undefined): string | undefined {
  if (!input) return undefined;
  
  const trimmed = input.trim();
  
  // Nếu đã là mã hex hợp lệ, trả về nguyên bản
  if (isValidHexColor(trimmed)) {
    return trimmed.toUpperCase();
  }
  
  // Nếu không phải hex, tìm trong mapping
  return getColorHex(trimmed);
}
