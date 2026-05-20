/**
 * Paste this logic into your PUT /api/products/:id handler (after multer),
 * so removed images are not kept in MongoDB.
 *
 * Expects multipart fields from the admin frontend:
 * - existingImages: kept paths (/uploads/products/...)
 * - currentImages / keepImages: JSON array of kept paths
 * - images: new uploaded files (multer)
 */

function parseKeptImages(req) {
  if (req.body.currentImages) {
    try {
      const parsed = JSON.parse(req.body.currentImages);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* fall through */
    }
  }

  if (req.body.existingImages === undefined) return null;

  return Array.isArray(req.body.existingImages)
    ? req.body.existingImages
    : [req.body.existingImages];
}

// Inside PUT handler, after you have `product` and `req.files`:
/*
  const kept = parseKeptImages(req);
  if (kept !== null) {
    const uploaded = (req.files || []).map(
      (f) => `/uploads/products/${f.filename}`,
    );
    product.images = [...kept, ...uploaded];

    if (product.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "حداقل یک عکس الزامی است",
      });
    }
  } else if (req.files?.length) {
    const uploaded = req.files.map((f) => `/uploads/products/${f.filename}`);
    product.images = [...product.images, ...uploaded];
  }
*/
