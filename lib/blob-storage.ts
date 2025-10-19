import { put, del, list } from "@vercel/blob";

/**
 * رفع ملف إلى Vercel Blob Storage
 * @param filename اسم الملف مع المسار (مثال: articles/image.jpg)
 * @param data البيانات (Buffer, Blob, أو string)
 * @param options خيارات إضافية
 * @returns رابط الملف المرفوع
 */
export async function uploadFile(
  filename: string,
  data: Buffer | Blob | string,
  options?: {
    contentType?: string;
    access?: "public";
    addRandomSuffix?: boolean;
  }
) {
  try {
    const { url } = await put(filename, data, {
      access: options?.access || "public",
      contentType: options?.contentType,
      addRandomSuffix: options?.addRandomSuffix ?? true,
    });

    return {
      success: true,
      url,
      filename,
    };
  } catch (error) {
    console.error("خطأ في رفع الملف:", error);
    throw new Error("فشل رفع الملف");
  }
}

/**
 * حذف ملف من Vercel Blob Storage
 * @param url رابط الملف المراد حذفه
 */
export async function deleteFile(url: string) {
  try {
    await del(url);
    return {
      success: true,
      message: "تم حذف الملف بنجاح",
    };
  } catch (error) {
    console.error("خطأ في حذف الملف:", error);
    throw new Error("فشل حذف الملف");
  }
}

/**
 * عرض قائمة الملفات في مجلد معين
 * @param prefix بادئة المسار (مثال: articles/)
 * @param options خيارات إضافية
 */
export async function listFiles(
  prefix?: string,
  options?: {
    limit?: number;
    cursor?: string;
  }
) {
  try {
    const result = await list({
      prefix,
      limit: options?.limit || 100,
      cursor: options?.cursor,
    });

    return {
      success: true,
      blobs: result.blobs,
      cursor: result.cursor,
      hasMore: result.hasMore,
    };
  } catch (error) {
    console.error("خطأ في عرض الملفات:", error);
    throw new Error("فشل عرض الملفات");
  }
}

/**
 * رفع صورة مع معالجة تلقائية
 * @param file الملف (Buffer أو Blob)
 * @param folder المجلد (افتراضي: images)
 * @param filename اسم الملف (اختياري)
 */
export async function uploadImage(
  file: Buffer | Blob,
  folder: string = "images",
  filename?: string
) {
  const timestamp = Date.now();
  const name = filename || `image-${timestamp}`;
  const path = `${folder}/${name}`;

  return uploadFile(path, file, {
    contentType: "image/jpeg",
    access: "public",
    addRandomSuffix: true,
  });
}

/**
 * رفع ملف مستند
 * @param file الملف (Buffer أو Blob)
 * @param folder المجلد (افتراضي: documents)
 * @param filename اسم الملف
 */
export async function uploadDocument(
  file: Buffer | Blob,
  folder: string = "documents",
  filename: string
) {
  const path = `${folder}/${filename}`;

  return uploadFile(path, file, {
    access: "public",
    addRandomSuffix: true,
  });
}

