import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Plus, Trash2, ImagePlus, Star, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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

type ImageEntry = { url: string; is_primary: boolean };

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
};

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    categories,
    brands,
    productImages,
    addProduct,
    updateProduct,
    addProductVariant,
    updateProductVariant,
    addProductImage,
  } = useData();
  const isEdit = !!id;

  const existingProduct = isEdit ? products.find((p) => p.id.toString() === id) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || "",
    category: existingProduct?.category?.name || "",
    brand: existingProduct?.brand?.name || "",
    status: existingProduct?.status || "active",
    description: existingProduct?.description || "",
  });

  const [images, setImages] = useState<ImageEntry[]>([]);

  const [variants, setVariants] = useState<VariantFormData[]>([
    { sku: "", version: "", color: "", price: "", compare_at_price: "", stock: "", is_active: true, imageUrl: "" },
  ]);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        category: existingProduct.category?.name || "",
        brand: existingProduct.brand?.name || "",
        status: existingProduct.status,
        description: existingProduct.description || "",
      });

      if (existingProduct.variants && existingProduct.variants.length > 0) {
        setVariants(
          existingProduct.variants.map((v) => {
            const variantImg = productImages.find((img) => img.variant_id === v.id);
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
          })
        );
      }

      const existingProductImages = productImages
        .filter((img) => img.product_id === existingProduct.id && !img.variant_id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => ({ url: img.image_url, is_primary: img.is_primary }));

      setImages(existingProductImages);
    }
  }, [existingProduct, productImages]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || images.length >= MAX_PRODUCT_IMAGES) return;
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, { url, is_primary: prev.length === 0 }]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].is_primary && updated.length > 0) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === index })));
  };

  const handleVariantImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    updateVariant(index, "imageUrl", url);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const selectedCategory = categories.find((c) => c.name === formData.category);
    const selectedBrand = brands.find((b) => b.name === formData.brand);

    if (!selectedCategory) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (variants.some((v) => !v.sku || !v.price || !v.stock)) {
      toast.error("Vui lòng điền đầy đủ thông tin cho tất cả biến thể");
      return;
    }

    if (isEdit && existingProduct) {
      updateProduct(existingProduct.id, {
        name: formData.name,
        category_id: selectedCategory.id,
        brand_id: selectedBrand?.id,
        status: formData.status as ProductStatus,
        description: formData.description,
      });

      variants.forEach((v) => {
        const variantData = {
          sku: v.sku,
          version: v.version || undefined,
          color: v.color || undefined,
          price: parseFloat(v.price),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
          stock: parseInt(v.stock),
          is_active: v.is_active,
        };
        if (v.id) {
          updateProductVariant(v.id, variantData);
        } else {
          addProductVariant({ product_id: existingProduct.id, ...variantData });
        }
      });

      toast.success("Cập nhật sản phẩm thành công");
    } else {
      const newProductId = Math.max(...products.map((p) => p.id), 0) + 1;

      addProduct({
        name: formData.name,
        category_id: selectedCategory.id,
        brand_id: selectedBrand?.id || 0,
        status: formData.status as ProductStatus,
        description: formData.description,
      });

      variants.forEach((v) => {
        addProductVariant({
          product_id: newProductId,
          sku: v.sku,
          version: v.version || undefined,
          color: v.color || undefined,
          price: parseFloat(v.price),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
          stock: parseInt(v.stock),
          is_active: v.is_active,
        });
      });

      images.forEach((img, i) => {
        addProductImage({
          product_id: newProductId,
          variant_id: undefined,
          image_url: img.url,
          is_primary: img.is_primary,
          sort_order: i,
        });
      });

      toast.success("Thêm sản phẩm mới thành công");
    }
    navigate("/products");
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { sku: "", version: "", color: "", price: "", compare_at_price: "", stock: "", is_active: true, imageUrl: "" },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      toast.error("Sản phẩm phải có ít nhất một biến thể");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string | boolean) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <p className="text-gray-600">
            {isEdit ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm mới vào hệ thống"}
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
                      onChange={(e) => handleChange("description", e.target.value)}
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
                    {images.length}/{MAX_PRODUCT_IMAGES} ảnh · Nhấn ★ để đặt ảnh đại diện
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="p-1 rounded-full text-white hover:scale-110 transition-transform"
                          title="Đặt làm ảnh đại diện"
                        >
                          <Star className="h-4 w-4" fill={img.is_primary ? "currentColor" : "none"} />
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
                      <span className="text-xs text-gray-400 mt-1">Thêm ảnh</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Biến thể sản phẩm (Màu sắc, Phiên bản)</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm biến thể
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4 relative">
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
                          onChange={(e) => updateVariant(index, "sku", e.target.value)}
                          placeholder="Nhập SKU"
                          required
                        />
                      </div>
                      <div>
                        <Label>Phiên bản</Label>
                        <Input
                          value={variant.version}
                          onChange={(e) => updateVariant(index, "version", e.target.value)}
                          placeholder="Nhập phiên bản"
                        />
                      </div>
                      <div>
                        <Label>Màu sắc</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) => updateVariant(index, "color", e.target.value)}
                          placeholder="Nhập màu sắc"
                        />
                      </div>
                      <div>
                        <Label>Giá bán *</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, "price", e.target.value)}
                          placeholder="Nhập giá bán"
                          required
                        />
                      </div>
                      <div>
                        <Label>Giá gốc (so sánh)</Label>
                        <Input
                          type="number"
                          value={variant.compare_at_price}
                          onChange={(e) => updateVariant(index, "compare_at_price", e.target.value)}
                          placeholder="Nhập giá gốc"
                        />
                      </div>
                      <div>
                        <Label>Số lượng tồn *</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, "stock", e.target.value)}
                          placeholder="Nhập số lượng"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Ảnh biến thể</Label>
                        <div className="flex items-center gap-3 mt-1">
                          {variant.imageUrl ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border group shrink-0">
                              <img src={variant.imageUrl} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => updateVariant(index, "imageUrl", "")}
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
                                onChange={(e) => handleVariantImageChange(index, e)}
                              />
                            </label>
                          )}
                          <p className="text-xs text-gray-500">1 ảnh đại diện cho biến thể này</p>
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
                    <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/products")}>
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}