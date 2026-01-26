/**
 * Validate project name
 */
export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'اسم المشروع مطلوب' };
  }

  if (name.trim().length < 3) {
    return { valid: false, error: 'اسم المشروع يجب أن يكون 3 أحرف على الأقل' };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: 'اسم المشروع يجب أن لا يتجاوز 100 حرف' };
  }

  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: 'اسم المشروع يحتوي على أحرف غير مسموح بها' };
  }

  return { valid: true };
}

/**
 * Validate project description
 */
export function validateProjectDescription(description: string): { valid: boolean; error?: string } {
  if (description && description.length > 500) {
    return { valid: false, error: 'الوصف يجب أن لا يتجاوز 500 حرف' };
  }

  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  fileName: string,
  allowedTypes: string[]
): { valid: boolean; error?: string; type?: string } {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (!extension) {
    return { valid: false, error: 'ملف بدون امتداد' };
  }

  const type = allowedTypes.find(t => t === `.${extension}` || t === extension);
  
  if (!type) {
    return { valid: false, error: `نوع الملف غير مدعوم. الامتدادات المدعومة: ${allowedTypes.join(', ')}` };
  }

  return { valid: true, type: extension };
}

/**
 * Validate file size
 */
export function validateFileSize(
  fileSize: number,
  maxSize: number = 5 * 1024 * 1024 * 1024 // 5GB default
): { valid: boolean; error?: string } {
  if (fileSize <= 0) {
    return { valid: false, error: 'حجم الملف غير صالح' };
  }

  if (fileSize > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `حجم الملف يتجاوز الحد الأقصى المسموح (${maxSizeMB} MB)` };
  }

  return { valid: true };
}

/**
 * Validate URL
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'الرابط مطلوب' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'رابط غير صالح' };
  }
}

/**
 * Validate email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'البريد الإلكتروني مطلوب' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'بريد إلكتروني غير صالح' };
  }

  return { valid: true };
}

/**
 * Validate duration
 */
export function validateDuration(seconds: number): { valid: boolean; error?: string } {
  if (isNaN(seconds)) {
    return { valid: false, error: 'المدة يجب أن تكون رقماً' };
  }

  if (seconds < 0) {
    return { valid: false, error: 'المدة يجب أن تكون رقمًا موجبًا' };
  }

  if (seconds > 3600 * 24) { // 24 hours max
    return { valid: false, error: 'المدة طويلة جدًا (الحد الأقصى 24 ساعة)' };
  }

  return { valid: true };
}

/**
 * Validate resolution
 */
export function validateResolution(resolution: string): { valid: boolean; error?: string } {
  const validResolutions = ['1280x720', '1920x1080', '3840x2160', '720p', '1080p', '4K'];
  
  if (!validResolutions.includes(resolution)) {
    return { valid: false, error: 'الدقة غير مدعومة' };
  }

  return { valid: true };
}

/**
 * Validate frame rate
 */
export function validateFrameRate(fps: number): { valid: boolean; error?: string } {
  const validFrameRates = [24, 25, 30, 50, 60];
  
  if (!validFrameRates.includes(fps)) {
    return { valid: false, error: 'معدل الإطارات غير مدعوم' };
  }

  return { valid: true };
}

/**
 * Validate Arabic text
 */
export function validateArabicText(text: string): { valid: boolean; error?: string } {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  if (!arabicRegex.test(text)) {
    return { valid: false, error: 'يجب أن يحتوي النص على أحرف عربية' };
  }

  return { valid: true };
}
