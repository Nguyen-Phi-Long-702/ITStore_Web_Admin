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
import { ProductStatus } from "../../types";
import { useData } from "../../contexts/DataContext";

const MAX_PRODUCT_IMAGES = 8;
const API_BASE_URL = "http://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token";

function buildRequestUrl(endpoint: string): string {
  return endpoint.startsWith("/__webadmin/")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;
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
    products,
    categories,
    brands,
    productVariants,
    productImages,
    addProduct,
    updateProduct,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant,
    addProductImage,
    deleteProductImage,
    setPrimaryProductImage,
  } = useData();
  const isEdit = !!id;

  const existingProduct = isEdit
    ? products.find((p) => p.id.toString() === id)
    : null;

  const autoProductCode = useMemo(() => {
    const maxCode = products.reduce((max, product) => {
      const match =
        typeof product.product_code === "string"
          ? product.product_code.match(/^PRD-(\d+)$/i)
          : null;
      if (!match) {
        return max;
      }

      const value = Number(match[1]);
      if (Number.isNaN(value)) {
        return max;
      }

      return Math.max(max, value);
    }, 0);

    return `PRD-${String(maxCode + 1).padStart(5, "0")}`;
  }, [products]);

  const [formData, setFormData] = useState({
    name: existingProduct?.name || "",
    category: existingProduct?.category?.name || "",
    brand: existingProduct?.brand?.name || "",
    status: existingProduct?.status || "active",
    description: existingProduct?.description || "",
  });

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [hydratedProductId, setHydratedProductId] = useState<number | null>(
    null,
  );
  const [fallbackDescription, setFallbackDescription] = useState("");
  const requestingDescriptionProductIdRef = useRef<number | null>(null);

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
    setIsFormDirty(false);
    setHydratedProductId(null);
    setFallbackDescription("");
    requestingDescriptionProductIdRef.current = null;
  }, [id]);

  useEffect(() => {
    const productId = existingProduct?.id;
    const productDescription = existingProduct?.description;

    if (!isEdit || !productId || isFormDirty) {
      return;
    }

    if (productDescription && productDescription.trim().length > 0) {
      setFallbackDescription("");
      return;
    }

    if (requestingDescriptionProductIdRef.current === productId) {
      return;
    }

    requestingDescriptionProductIdRef.current = productId;
    let cancelled = false;

    const extractDescription = (payload: unknown): string => {
      const asRecord = (value: unknown): Record<string, unknown> | null => {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
          return null;
        }
        return value as Record<string, unknown>;
      };

      const fromRecord = (record: Record<string, unknown>): string => {
        const candidates = [
          record.description,
          record.product_description,
          record.productDescription,
          record.short_description,
          record.shortDescription,
          record.product_desc,
          record.desc,
          record.content,
          record.details,
          record.summary,
        ];

        for (const candidate of candidates) {
          if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate;
          }
        }

        for (const [key, value] of Object.entries(record)) {
          const normalizedKey = key.trim().toLowerCase();
          if (
            !normalizedKey.includes("desc") &&
            !normalizedKey.includes("description")
          ) {
            continue;
          }

          if (typeof value === "string" && value.trim().length > 0) {
            return value;
          }
        }

        return "";
      };

      const walk = (
        value: unknown,
        visit: (node: Record<string, unknown>) => string,
      ): string => {
        if (Array.isArray(value)) {
          for (const item of value) {
            const result = walk(item, visit);
            if (result) {
              return result;
            }
          }
          return "";
        }

        const record = asRecord(value);
        if (!record) {
          return "";
        }

        const direct = visit(record);
        if (direct) {
          return direct;
        }

        for (const nested of Object.values(record)) {
          const nestedResult = walk(nested, visit);
          if (nestedResult) {
            return nestedResult;
          }
        }

        return "";
      };

      const findByIdDescription = walk(payload, (record) => {
        const rawId = record.id;
        if (Number(rawId) !== productId) {
          return "";
        }
        return fromRecord(record);
      });

      if (findByIdDescription) {
        return findByIdDescription;
      }

      if (Array.isArray(payload)) {
        const matched = payload.find((item) => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const rawId = (item as Record<string, unknown>).id;
          return Number(rawId) === productId;
        });

        if (matched && typeof matched === "object") {
          return fromRecord(matched as Record<string, unknown>);
        }

        const first = payload.find((item) => item && typeof item === "object");
        if (first && typeof first === "object") {
          return fromRecord(first as Record<string, unknown>);
        }

        return "";
      }

      const root = asRecord(payload);
      if (!root) {
        return "";
      }

      const directDescription = fromRecord(root);
      if (directDescription) {
        return directDescription;
      }

      const nestedCandidates = [
        root.data,
        root.result,
        root.payload,
        root.item,
        root.items,
        root.rows,
      ];
      for (const nested of nestedCandidates) {
        if (Array.isArray(nested)) {
          const nestedDescription = extractDescription(nested);
          if (nestedDescription) {
            return nestedDescription;
          }
          continue;
        }

        const nestedRecord = asRecord(nested);
        if (!nestedRecord) {
          continue;
        }
        const nestedDescription = fromRecord(nestedRecord);
        if (nestedDescription) {
          return nestedDescription;
        }
      }

      return walk(payload, (record) => fromRecord(record));
    };

    const fetchFallbackDescription = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim();
      const headers: Record<string, string> = {};

      if (token && token !== "undefined" && token !== "null") {
        headers.Authorization = `Bearer ${token}`;
      }

      const endpoints = [
        `/api/admin/products/${productId}`,
        `/api/products/${productId}`,
        `/admin/products/${productId}`,
        "/api/admin/products",
        "/api/products",
        "/__webadmin/db/products",
      ];

      let found = false;

      for (const endpoint of endpoints) {
        try {
          const requestUrl = buildRequestUrl(endpoint);

          const response = await fetch(requestUrl, {
            method: "GET",
            credentials: "include",
            headers,
            cache: "no-store",
          });

          if (!response.ok) {
            continue;
          }

          const payload = (await response.json().catch(() => null)) as unknown;
          const description = extractDescription(payload);

          if (!cancelled && description) {
            setFallbackDescription(description);
            found = true;
            return;
          }
        } catch {}
      }

      if (!cancelled && !found) {
        requestingDescriptionProductIdRef.current = null;
      }
    };

    void fetchFallbackDescription();

    return () => {
      cancelled = true;
    };
  }, [existingProduct?.description, existingProduct?.id, isEdit, isFormDirty]);

  useEffect(() => {
    if (!isEdit || !existingProduct || isFormDirty) {
      return;
    }

    const resolvedDescription =
      typeof existingProduct.description === "string" &&
      existingProduct.description.trim().length > 0
        ? existingProduct.description
        : fallbackDescription;

    const nextFormData = {
      name: existingProduct.name,
      category: existingProduct.category?.name || "",
      brand: existingProduct.brand?.name || "",
      status: existingProduct.status,
      description: resolvedDescription || "",
    };

    setFormData((prev) => {
      if (
        prev.name === nextFormData.name &&
        prev.category === nextFormData.category &&
        prev.brand === nextFormData.brand &&
        prev.status === nextFormData.status &&
        prev.description === nextFormData.description
      ) {
        return prev;
      }

      return nextFormData;
    });
  }, [existingProduct, fallbackDescription, isEdit, isFormDirty]);

  useEffect(() => {
    if (isEdit && isFormDirty) {
      return;
    }

    if (existingProduct) {
      const normalizedProductSku = (existingProduct.sku || "")
        .trim()
        .toLowerCase();
      const skuMatchedVariants = normalizedProductSku
        ? productVariants.filter(
            (variant) =>
              variant.sku.trim().toLowerCase() === normalizedProductSku,
          )
        : [];
      const existingVariants =
        existingProduct.variants && existingProduct.variants.length > 0
          ? existingProduct.variants
          : productVariants.filter(
                (variant) => variant.product_id === existingProduct.id,
              ).length > 0
            ? productVariants.filter(
                (variant) => variant.product_id === existingProduct.id,
              )
            : skuMatchedVariants;

      const currentVariantIds = new Set(
        variants.filter((variant) => variant.id).map((variant) => variant.id),
      );
      const incomingVariantIds = new Set(
        existingVariants.map((variant) => variant.id),
      );
      const variantsOutOfSync =
        incomingVariantIds.size !== currentVariantIds.size ||
        Array.from(incomingVariantIds).some(
          (variantId) => !currentVariantIds.has(variantId),
        );
      const shouldHydrate =
        hydratedProductId !== existingProduct.id || variantsOutOfSync;

      if (!shouldHydrate) {
        return;
      }

      if (existingVariants.length > 0) {
        setVariants(
          existingVariants.map((v) => {
            const variantImg = productImages.find(
              (img) => img.variant_id === v.id,
            );
            return {
              id: v.id,
              sku: v.sku,
              version: v.version || "",
              color: v.color || "",
              price: v.price.toString(),
              compare_at_price: v.compare_at_price?.toString() || "",
              stock: v.stock.toString(),
              is_active: v.is_active,
              imageUrl: variantImg?.image_url || "",
            };
          }),
        );
      } else {
        setVariants([
          {
            sku: existingProduct.sku || "",
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
      }

      const existingProductImages = productImages
        .filter(
          (img) => img.product_id === existingProduct.id && !img.variant_id,
        )
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => ({
          id: img.id,
          url: img.image_url,
          is_primary: img.is_primary,
        }));

      setImages(existingProductImages);
      setHydratedProductId(existingProduct.id);
    }
  }, [
    existingProduct,
    productImages,
    productVariants,
    variants,
    hydratedProductId,
    isEdit,
    isFormDirty,
  ]);

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

    if (!formData.name || !formData.category) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
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
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả biến thể");
        return;
      }
    } else {
      if (variantsForEditResolved.some((v) => !v.sku || !v.price || !v.stock)) {
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả biến thể");
        return;
      }

      if (unresolvedVariants.some((variant) => !variant.imageFile)) {
        toast.error(
          "Không thể cập nhật vì biến thể này chưa tồn tại ở backend và backend yêu cầu ảnh khi tạo mới",
        );
        return;
      }
    }

    let createdProductId: number | null = null;

    try {
      if (isEdit && existingProduct) {
        await updateProduct(existingProduct.id, {
          name: formData.name,
          category_id: selectedCategory.id,
          brand_id: selectedBrand.id,
          status: formData.status as ProductStatus,
          description: formData.description,
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
            const variantData = {
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
            if (v.id) {
              return updateProductVariant(v.id, variantData);
            }
            return addProductVariant({
              product_id: existingProduct.id,
              ...variantData,
              variant_image_file: v.imageFile,
            });
          }),
        );

        const existingImages = productImages
          .filter(
            (img) => img.product_id === existingProduct.id && !img.variant_id,
          )
          .sort((a, b) => a.sort_order - b.sort_order);

        const existingImageIdSet = new Set(existingImages.map((img) => img.id));
        const currentImageIdSet = new Set(
          images.filter((img) => img.id).map((img) => img.id as number),
        );
        const removedImageIds = Array.from(existingImageIdSet).filter(
          (imageId) => !currentImageIdSet.has(imageId),
        );

        if (removedImageIds.length > 0) {
          await Promise.all(
            removedImageIds.map((imageId) => deleteProductImage(imageId)),
          );
        }

        const existingImageEntries = images.filter((img) => img.id);

        const newImageEntries = images.filter(
          (img) => !img.id && img.imageFile,
        );
        if (newImageEntries.length > 0) {
          await Promise.all(
            newImageEntries.map((img, index) =>
              addProductImage({
                product_id: existingProduct.id,
                variant_id: undefined,
                image_url: img.url,
                is_primary: img.is_primary,
                sort_order: existingImageEntries.length + index,
                image_file: img.imageFile,
              }),
            ),
          );
        }

        const primaryExistingImageId = images.find(
          (img) => img.is_primary && img.id,
        )?.id;
        if (primaryExistingImageId) {
          await setPrimaryProductImage(primaryExistingImageId);
        }

        toast.success("Cập nhật sản phẩm thành công");
      } else {
        createdProductId = await addProduct({
          sku: autoProductCode,
          name: formData.name,
          category_id: selectedCategory.id,
          brand_id: selectedBrand.id,
          status: formData.status as ProductStatus,
          description: formData.description,
        });

        await Promise.all(
          variants.map((v) =>
            addProductVariant({
              product_id: createdProductId,
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
            }),
          ),
        );

        await Promise.all(
          images.map((img, i) =>
            addProductImage({
              product_id: createdProductId,
              variant_id: undefined,
              image_url: img.url,
              is_primary: img.is_primary,
              sort_order: i,
              image_file: img.imageFile,
            }),
          ),
        );

        toast.success("Thêm sản phẩm mới thành công");
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
                      <div className="col-span-2">
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
                        <Label>Ảnh biến thể</Label>
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
                            <label className="w-20 h-20 shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                              <ImagePlus className="h-5 w-5 text-gray-400" />
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
                            1 ảnh đại diện cho biến thể này
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
                    <SelectItem value="active">Đang kinh doanh</SelectItem>
                    <SelectItem value="discontinued">
                      Ngừng kinh doanh
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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
