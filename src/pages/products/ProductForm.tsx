import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ImagePlus,
  Star,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import { ProductStatus, ProductVariant } from "../../types";
import { useData } from "../../contexts/DataContext";
import { productService } from "../../services/productService";
import { BASE_URL } from "../../lib/api";

const MAX_PRODUCT_IMAGES = 8;

function buildImageUrl(url: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

function parseSpecifications(specField: any): { key: string; value: string }[] {
  if (!specField) return [{ key: "", value: "" }];
  
  let parsed: any = specField;
  if (typeof specField === "string") {
    try {
      parsed = JSON.parse(specField);
    } catch {
      return [{ key: "Thông số", value: specField }];
    }
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const entries = Object.entries(parsed);
    if (entries.length === 0) return [{ key: "", value: "" }];
    return entries.map(([key, value]) => ({
      key,
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return [{ key: "", value: "" }];
    return parsed.map((item: any) => {
      if (item && typeof item === "object") {
        return {
          key: String(item.key || item.name || Object.keys(item)[0] || ""),
          value: String(item.value || Object.values(item)[0] || ""),
        };
      }
      return { key: "Thông số", value: String(item) };
    });
  }

  return [{ key: "", value: "" }];
}

type ImageEntry = {
  id?: number;
  url: string;
  is_primary: boolean;
  imageFile?: File;
};

type VariantFormData = {
  id?: number;
  sku: string;
  version: string;
  color: string;
  price: string;
  compare_at_price: string;
  stock: string;
  is_active: boolean;
  imageUrl: string;
  imageFile?: File;
};

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    categories,
    brands,
    productVariants,
    productImages,
    addProduct,
    updateProduct,
    deleteProduct: _deleteProduct,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant,
    addProductImage,
    deleteProductImage,
    setPrimaryProductImage,
    refreshData,
    fetchCategories,
    fetchBrands,
    fetchProducts,
    fetchProductImages,
  } = useData();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
    fetchProductImages();
  }, [fetchCategories, fetchBrands, fetchProducts, fetchProductImages]);

  const isEdit = !!id;

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.getAll({ page: 1, limit: 1000 }).then(res => {
      setProducts(res.data);
    }).catch(console.error);
  }, []);

  const existingProduct = isEdit
    ? products.find((p) => p.id.toString() === id)
    : null;

  const autoProductCode = useMemo(() => {
    const maxCode = products.reduce((max, product) => {
      const raw = product.sku || product.product_code || "";
      const match = typeof raw === "string" ? raw.match(/^PRD-(\d+)$/i) : null;
      if (!match) return max;
      const value = Number(match[1]);
      if (Number.isNaN(value)) return max;
      return Math.max(max, value);
    }, 0);
    return `PRD-${String(maxCode + 1).padStart(5, "0")}`;
  }, [products]);


  const [formData, setFormData] = useState({
    sku: existingProduct?.sku || "",
    name: existingProduct?.name || "",
    category: existingProduct?.category?.name || "",
    brand: existingProduct?.brand?.name || "",
    status: existingProduct?.status || "available",
    description: existingProduct?.description || "",
  });

  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(() => {
    if (existingProduct) {
      return parseSpecifications(existingProduct.specifications);
    }
    return [{ key: "", value: "" }];
  });

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [initialImageIds, setInitialImageIds] = useState<number[]>([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [hydratedProductId, setHydratedProductId] = useState<number | null>(
    null,
  );
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [variants, setVariants] = useState<VariantFormData[]>([
    {
      sku: "",
      version: "",
      color: "",
      price: "",
      compare_at_price: "",
      stock: "",
      is_active: true,
      imageUrl: "",
      imageFile: undefined,
    },
  ]);

  useEffect(() => {
    if (!isEdit || !existingProduct?.slug || isFormDirty) return;
    if (hydratedProductId === existingProduct.id) return;

    let cancelled = false;
    setIsLoadingDetail(true);

    const loadDetail = isEdit && existingProduct 
      ? productService.getAdminDetail(existingProduct.id, existingProduct.slug, existingProduct.status)
      : productService.getDetail(existingProduct!.slug);

    loadDetail
      .then((detail) => {
        if (cancelled) return;

        setFormData({
          sku: detail.sku || "",
          name: detail.name,
          category: detail.category?.name || "",
          brand: detail.brand?.name || "",
          status: detail.status as ProductStatus,
          description: detail.description || "",
        });

        setSpecifications(parseSpecifications(detail.specifications));

        if (detail.variants.length > 0) {
          setVariants(
            detail.variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              version: v.version || "",
              color: v.color || "",
              price: v.price.toString(),
              compare_at_price: v.compare_at_price?.toString() || "",
              stock: v.stock.toString(),
              is_active: v.is_active !== false,
              imageUrl: buildImageUrl(v.variant_image),
              imageFile: undefined,
            }))
          );
        }

        const loadedImages = detail.images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            id: img.id,
            url: img.image_url,
            is_primary: img.is_primary,
          }));
        setImages(loadedImages);
        setInitialImageIds(loadedImages.map((img) => img.id!));

        setHydratedProductId(existingProduct.id);
      })
      .catch(() => {
        if (cancelled) return;
        setFormData({
          sku: existingProduct.sku || "",
          name: existingProduct.name,
          category: existingProduct.category?.name || "",
          brand: existingProduct.brand?.name || "",
          status: existingProduct.status,
          description: existingProduct.description || "",
        });

        setSpecifications(parseSpecifications(existingProduct.specifications));

        const prodVariants = productVariants.filter((v) => v.product_id === existingProduct.id);
        if (prodVariants.length > 0) {
          setVariants(
            prodVariants.map((v) => {
              const vImg = productImages.find((img) => img.variant_id === v.id);
              return {
                id: v.id,
                sku: v.sku,
                version: v.version || "",
                color: v.color || "",
                price: v.price.toString(),
                compare_at_price: v.compare_at_price?.toString() || "",
                stock: v.stock.toString(),
                is_active: v.is_active !== false,
                imageUrl: vImg ? buildImageUrl(vImg.image_url) : "",
                imageFile: undefined,
              };
            })
          );
        }

        const fallbackImages = productImages
          .filter((img) => img.product_id === existingProduct.id && !img.variant_id)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            id: img.id,
            url: img.image_url,
            is_primary: img.is_primary,
          }));
        setImages(fallbackImages);
        setInitialImageIds(fallbackImages.map((img) => img.id!));

        setHydratedProductId(existingProduct.id);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDetail(false);
      });

    return () => { cancelled = true; };
  }, [existingProduct?.id, existingProduct?.slug, isEdit, isFormDirty, hydratedProductId]);


  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || images.length >= MAX_PRODUCT_IMAGES) return;
    const file = e.target.files[0];
    if (!file) return;
    setIsFormDirty(true);
    const url = URL.createObjectURL(file);
    setImages((prev) => [
      ...prev,
      { url, is_primary: prev.length === 0, imageFile: file },
    ]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setIsFormDirty(true);
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].is_primary && updated.length > 0) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  };

  const handleSetPrimary = (index: number) => {
    setIsFormDirty(true);
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === index })),
    );
  };

  const handleVariantImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.[0]) return;
    setIsFormDirty(true);
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    updateVariant(index, "imageUrl", url);
    updateVariant(index, "imageFile", file);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.sku) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc (gồm SKU sản phẩm)");
      return;
    }

    const selectedCategory = categories.find(
      (c) => c.name === formData.category,
    );
    const selectedBrand = brands.find((b) => b.name === formData.brand);

    if (!selectedCategory) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!selectedBrand) {
      toast.error("Vui lòng chọn thương hiệu");
      return;
    }

    const hasVariantInput = (variant: VariantFormData) =>
      Boolean(
        variant.sku ||
        variant.price ||
        variant.stock ||
        variant.version ||
        variant.color ||
        variant.compare_at_price ||
        variant.imageFile ||
        variant.imageUrl,
      );

    const variantsForEdit = variants.filter(
      (variant) => variant.id || hasVariantInput(variant),
    );

    const existingVariantsForEdit =
      isEdit && existingProduct
        ? (() => {
            const normalizedProductSku = (existingProduct.sku || "")
              .trim()
              .toLowerCase();
            const skuMatchedVariants = normalizedProductSku
              ? productVariants.filter(
                  (variant) =>
                    variant.sku.trim().toLowerCase() === normalizedProductSku,
                )
              : [];

            if (
              existingProduct.variants &&
              existingProduct.variants.length > 0
            ) {
              return existingProduct.variants;
            }

            const variantsByProductId = productVariants.filter(
              (variant) => variant.product_id === existingProduct.id,
            );

            if (variantsByProductId.length > 0) {
              return variantsByProductId;
            }

            return skuMatchedVariants;
          })()
        : [];

    const variantsForEditResolved =
      isEdit && existingProduct
        ? variantsForEdit.map((variant) => {
            if (variant.id) {
              return variant;
            }

            const normalizedSku = variant.sku.trim().toLowerCase();
            const matchedVariantByProduct = productVariants.find(
              (existingVariant) =>
                existingVariant.product_id === existingProduct.id &&
                existingVariant.sku.trim().toLowerCase() === normalizedSku,
            );
            const matchedBySkuCandidates = productVariants.filter(
              (existingVariant) =>
                existingVariant.sku.trim().toLowerCase() === normalizedSku,
            );
            const matchedVariant =
              matchedVariantByProduct ||
              (matchedBySkuCandidates.length === 1
                ? matchedBySkuCandidates[0]
                : undefined);

            if (!matchedVariant) {
              return variant;
            }

            return {
              ...variant,
              id: matchedVariant.id,
            };
          })
        : variantsForEdit;

    const unresolvedVariants = variantsForEditResolved.filter(
      (variant) => !variant.id,
    );
    const existingVariantIdSet = new Set(
      existingVariantsForEdit.map((variant) => variant.id),
    );
    const currentVariantIdSet = new Set(
      variantsForEditResolved
        .filter((variant) => variant.id)
        .map((variant) => variant.id as number),
    );
    const removedVariantIds = Array.from(existingVariantIdSet).filter(
      (variantId) => !currentVariantIdSet.has(variantId),
    );

    if (!isEdit) {
      if (variants.some((v) => !v.sku || !v.price || !v.stock)) {
        toast.error("Vui lòng điền đầy đủ SKU, giá và tồn kho cho tất cả biến thể");
        return;
      }
      if (variants.some((v) => !v.imageFile)) {
        toast.error("Mỗi biến thể phải có ảnh (bắt buộc khi tạo mới)");
        return;
      }
    } else {
      if (variantsForEditResolved.some((v) => !v.sku || !v.price || !v.stock)) {
        toast.error("Vui lòng điền đầy đủ SKU, giá và tồn kho cho tất cả biến thể");
        return;
      }

      if (unresolvedVariants.some((variant) => !variant.imageFile)) {
        toast.error("Biến thể mới cần có ảnh (backend yêu cầu ảnh khi tạo biến thể)");
        return;
      }
    }

    const variantsToCheck = isEdit ? variantsForEditResolved : variants;
    const skuSet = new Set<string>();
    const versionColorSet = new Set<string>();

    for (const v of variantsToCheck) {
      const sku = (v.sku || "").trim().toLowerCase();
      const version = (v.version || "").trim().toLowerCase();
      const color = (v.color || "").trim().toLowerCase();
      const versionColorKey = `${version}-${color}`;

      if (skuSet.has(sku)) {
        toast.error("Mã SKU của các biến thể không được trùng nhau");
        return;
      }
      skuSet.add(sku);

      if (versionColorSet.has(versionColorKey)) {
        toast.error("Phiên bản và màu sắc của các biến thể không được trùng nhau");
        return;
      }
      versionColorSet.add(versionColorKey);
    }

    let createdProductId: number | null = null;
    setIsSaving(true);
    try {
      const specObj: Record<string, string> = {};
      specifications.forEach((item) => {
        if (item.key.trim()) {
          specObj[item.key.trim()] = item.value;
        }
      });
      const specsJson = JSON.stringify(specObj);

      if (isEdit && existingProduct) {
        await updateProduct(existingProduct.id, {
          sku: formData.sku,
          name: formData.name,
          category_id: selectedCategory.id,
          brand_id: selectedBrand.id,
          status: formData.status as ProductStatus,
          description: formData.description,
          specifications: specsJson,
        });

        if (removedVariantIds.length > 0) {
          await Promise.all(
            removedVariantIds.map((variantId) =>
              deleteProductVariant(variantId),
            ),
          );
        }

        await Promise.all(
          variantsForEditResolved.map((v) => {
            if (v.id) {
              const variantData: Partial<ProductVariant> & { variant_image_file?: File } = {
                sku: v.sku,
                version: v.version || undefined,
                color: v.color || undefined,
                price: parseFloat(v.price),
                compare_at_price: v.compare_at_price
                  ? parseFloat(v.compare_at_price)
                  : undefined,
                stock: parseInt(v.stock),
                is_active: v.is_active,
              };
              if (v.imageFile) {
                variantData.variant_image_file = v.imageFile;
              }
              return updateProductVariant(v.id, variantData);
            }
            return addProductVariant({
              product_id: existingProduct.id,
              sku: v.sku,
              version: v.version || undefined,
              color: v.color || undefined,
              price: parseFloat(v.price),
              compare_at_price: v.compare_at_price
                ? parseFloat(v.compare_at_price)
                : undefined,
              stock: parseInt(v.stock),
              is_active: v.is_active,
              variant_image_file: v.imageFile,
            });
          }),
        );

        const currentImageIdSet = new Set(
          images.filter((img) => img.id).map((img) => img.id as number),
        );
        const removedImageIds = initialImageIds.filter(
          (imageId) => !currentImageIdSet.has(imageId),
        );

        if (removedImageIds.length > 0) {
          for (const imageId of removedImageIds) {
            await deleteProductImage(imageId);
          }
        }

        const existingImageEntries = images.filter((img) => img.id);

        const newImageEntries = images.filter(
          (img) => !img.id && img.imageFile,
        );
        if (newImageEntries.length > 0) {
          const newFiles = newImageEntries.map((img) => img.imageFile!);
          await productService.uploadImages(existingProduct.id, newFiles);
        }

        const primaryExistingImageId = images.find(
          (img) => img.is_primary && img.id,
        )?.id;
        if (primaryExistingImageId) {
          await setPrimaryProductImage(primaryExistingImageId);
        }

        toast.success("Cập nhật sản phẩm thành công");
        await refreshData();
      } else {
        createdProductId = await productService.create({
          sku: formData.sku,
          name: formData.name,
          category_id: selectedCategory.id,
          brand_id: selectedBrand.id,
          status: formData.status as ProductStatus,
          description: formData.description,
          specifications: specsJson,
        }).then((p) => p.id);

        await Promise.all(
          variants.map((v) =>
            productService.createVariant(createdProductId!, {
              product_id: createdProductId!,
              sku: v.sku,
              version: v.version || undefined,
              color: v.color || undefined,
              price: parseFloat(v.price),
              compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
              stock: parseInt(v.stock),
              is_active: v.is_active,
              variant_image_file: v.imageFile,
            }),
          ),
        );

        const imageFiles = images.filter((img) => img.imageFile).map((img) => img.imageFile!);
        if (imageFiles.length > 0) {
          await productService.uploadImages(createdProductId!, imageFiles);
        }

        toast.success("Thêm sản phẩm mới thành công");
        await refreshData();
      }

      navigate("/products");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu sản phẩm";
      if (message.toLowerCase().includes("cloud_name")) {
        toast.error(
          "Backend chưa cấu hình Cloudinary nên chưa thể lưu biến thể có ảnh",
        );
      } else {
        toast.error(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setIsFormDirty(true);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setIsFormDirty(true);
    setVariants([
      ...variants,
      {
        sku: "",
        version: "",
        color: "",
        price: "",
        compare_at_price: "",
        stock: "",
        is_active: true,
        imageUrl: "",
        imageFile: undefined,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      toast.error("Sản phẩm phải có ít nhất một biến thể");
      return;
    }
    setIsFormDirty(true);
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: string,
    value: string | boolean | File | undefined,
  ) => {
    setIsFormDirty(true);
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Toggle bật/tắt variant:
  // - Nếu variant đã có id (đang edit): gọi API ngay, rollback nếu lỗi
  // - Nếu variant chưa có id (đang tạo mới): chỉ cập nhật state local
  const handleToggleVariantStatus = async (index: number) => {
    const variant = variants[index];
    const newStatus = !variant.is_active;

    // Cập nhật UI ngay (optimistic)
    updateVariant(index, "is_active", newStatus);

    if (variant.id) {
      try {
        await productService.updateVariantStatus(variant.id, newStatus);
        toast.success(
          newStatus
            ? `Đã bật biến thể ${variant.sku}`
            : `Đã tắt biến thể ${variant.sku}`,
        );
      } catch (err) {
        // Rollback nếu API lỗi
        updateVariant(index, "is_active", !newStatus);
        toast.error("Không thể cập nhật trạng thái biến thể");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <p className="text-gray-600">
            {isEdit
              ? "Cập nhật thông tin sản phẩm"
              : "Thêm sản phẩm mới vào hệ thống"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="sku">SKU sản phẩm *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      placeholder="Nhập SKU sản phẩm (Ví dụ: LAP-DELL-G15)"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="name">Tên sản phẩm *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Danh mục *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => handleChange("brand", value)}
                    >
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Mô tả chi tiết sản phẩm..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Thông số kỹ thuật (Không bắt buộc)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsFormDirty(true);
                          setSpecifications((prev) => [...prev, { key: "", value: "" }]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm thông số
                      </Button>
                    </div>

                    {specifications.length > 0 ? (
                      <div className="border rounded-md divide-y overflow-hidden bg-white">
                        <div className="grid grid-cols-12 bg-gray-50 p-2 font-medium text-sm text-gray-700">
                          <div className="col-span-5 px-2">Tên thông số</div>
                          <div className="col-span-6 px-2">Giá trị</div>
                          <div className="col-span-1 text-center">Xóa</div>
                        </div>
                        <div className="divide-y max-h-80 overflow-y-auto">
                          {specifications.map((spec, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 p-2 items-center">
                              <div className="col-span-5 px-1">
                                <Input
                                  value={spec.key}
                                  onChange={(e) => {
                                    setIsFormDirty(true);
                                    setSpecifications((prev) =>
                                      prev.map((item, idx) =>
                                        idx === index ? { ...item, key: e.target.value } : item
                                      )
                                    );
                                  }}
                                  placeholder="Ví dụ: CPU, RAM, Pin..."
                                  className="h-9"
                                />
                              </div>
                              <div className="col-span-6 px-1">
                                <Input
                                  value={spec.value}
                                  onChange={(e) => {
                                    setIsFormDirty(true);
                                    setSpecifications((prev) =>
                                      prev.map((item, idx) =>
                                        idx === index ? { ...item, value: e.target.value } : item
                                      )
                                    );
                                  }}
                                  placeholder="Giá trị thông số..."
                                  className="h-9"
                                />
                              </div>
                              <div className="col-span-1 text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setIsFormDirty(true);
                                    setSpecifications((prev) => prev.filter((_, idx) => idx !== index));
                                  }}
                                  className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed rounded-md bg-gray-50 text-gray-500 text-sm">
                        Chưa có thông số kỹ thuật nào. Bấm "Thêm thông số" để bắt đầu.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                  <span className="text-sm text-gray-500">
                    {images.length}/{MAX_PRODUCT_IMAGES} ảnh · Nhấn ★ để đặt ảnh
                    đại diện
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="p-1 rounded-full text-white hover:scale-110 transition-transform"
                          title="Đặt làm ảnh đại diện"
                        >
                          <Star
                            className="h-4 w-4"
                            fill={img.is_primary ? "currentColor" : "none"}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 rounded-full text-white hover:scale-110 transition-transform"
                          title="Xóa ảnh"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {img.is_primary && (
                        <span className="absolute top-1 left-1 bg-yellow-400 text-xs text-white px-1.5 py-0.5 rounded">
                          Chính
                        </span>
                      )}
                    </div>
                  ))}
                  {images.length < MAX_PRODUCT_IMAGES && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                      <ImagePlus className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">
                        Thêm ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddImage}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Biến thể sản phẩm (Màu sắc, Phiên bản)</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm biến thể
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-4 relative"
                  >
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex items-start gap-4">
                        <div className="flex-1">
                          <Label>SKU *</Label>
                          <Input
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(index, "sku", e.target.value)
                            }
                            placeholder="Nhập SKU"
                            required
                          />
                        </div>
                        {/* Trạng thái biến thể */}
                        <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
                          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Trạng thái biến thể
                          </Label>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${
                                variant.is_active
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                            >
                              {variant.is_active ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleVariantStatus(index)}
                            >
                              {variant.is_active ? "Tắt" : "Bật"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Phiên bản</Label>
                        <Input
                          value={variant.version}
                          onChange={(e) =>
                            updateVariant(index, "version", e.target.value)
                          }
                          placeholder="Nhập phiên bản"
                        />
                      </div>
                      <div>
                        <Label>Màu sắc</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) =>
                            updateVariant(index, "color", e.target.value)
                          }
                          placeholder="Nhập màu sắc"
                        />
                      </div>
                      <div>
                        <Label>Giá bán *</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, "price", e.target.value)
                          }
                          placeholder="Nhập giá bán"
                          required
                        />
                      </div>
                      <div>
                        <Label>Giá gốc (so sánh)</Label>
                        <Input
                          type="number"
                          value={variant.compare_at_price}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "compare_at_price",
                              e.target.value,
                            )
                          }
                          placeholder="Nhập giá gốc"
                        />
                      </div>
                      <div>
                        <Label>Số lượng tồn *</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(index, "stock", e.target.value)
                          }
                          placeholder="Nhập số lượng"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>
                          Ảnh biến thể{" "}
                          {!isEdit && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <div className="flex items-center gap-3 mt-1">
                          {variant.imageUrl ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border group shrink-0">
                              <img
                                src={variant.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  updateVariant(index, "imageUrl", "");
                                  updateVariant(index, "imageFile", undefined);
                                }}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                              >
                                <X className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          ) : (
                            <label
                              className={`w-20 h-20 shrink-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                !isEdit
                                  ? "border-red-300 hover:border-red-400 hover:bg-red-50"
                                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                              }`}
                            >
                              <ImagePlus className={`h-5 w-5 ${!isEdit ? "text-red-400" : "text-gray-400"}`} />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleVariantImageChange(index, e)
                                }
                              />
                            </label>
                          )}
                          <p className="text-xs text-gray-500">
                            {!isEdit
                              ? "Ảnh bắt buộc khi tạo mới"
                              : "1 ảnh đại diện cho biến thể này"}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="status">Trạng thái sản phẩm</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Đang kinh doanh</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                    <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? (isEdit ? "Đang cập nhật..." : "Đang thêm...")
                  : (isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/products")}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


