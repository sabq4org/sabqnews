export function slugify(text: string): string {
  // Convert Arabic characters to their Latin equivalents (basic transliteration)
  const transliterated = text
    .replace(/أ|إ|آ/g, "a")
    .replace(/ب/g, "b")
    .replace(/ت/g, "t")
    .replace(/ث/g, "th")
    .replace(/ج/g, "j")
    .replace(/ح/g, "h")
    .replace(/خ/g, "kh")
    .replace(/د/g, "d")
    .replace(/ذ/g, "dh")
    .replace(/ر/g, "r")
    .replace(/ز/g, "z")
    .replace(/س/g, "s")
    .replace(/ش/g, "sh")
    .replace(/ص/g, "s")
    .replace(/ض/g, "d")
    .replace(/ط/g, "t")
    .replace(/ظ/g, "z")
    .replace(/ع/g, "a")
    .replace(/غ/g, "gh")
    .replace(/ف/g, "f")
    .replace(/ق/g, "q")
    .replace(/ك/g, "k")
    .replace(/ل/g, "l")
    .replace(/م/g, "m")
    .replace(/ن/g, "n")
    .replace(/ه/g, "h")
    .replace(/و/g, "w")
    .replace(/ي/g, "y")
    .replace(/ة/g, "h")
    .replace(/ى/g, "a")
    .replace(/ء/g, "")
    .replace(/ؤ/g, "o")
    .replace(/ئ/g, "i")
    .replace(/ /g, "-") // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove all non-alphanumeric chars except hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .toLowerCase(); // Convert to lowercase

  return transliterated;
}

