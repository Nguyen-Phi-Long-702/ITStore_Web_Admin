import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
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
import { ProductVariant, ProductStatus } from "../../types";
import { useData } from "../../contexts/DataContext";

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, brands, addProduct, updateProduct, addProductVariant, updateProductVariant } = useData();
  const isEdit = !!id;

  // Find product if editing
  const existingProduct = isEdit
    ? products.find((p) => p.id.toString() === id)
    : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || "",
    category: existingProduct?.category?.name || "",
    brand: existingProduct?.brand?.name || "",
    status: existingProduct?.status || "active",
    description: existingProduct?.description || "",
  });

  // Quản lý variants
  const [variants, setVariants] = useState<
    Array<{
      id?: number;
      sku: string;
      version: string;
      color: string;
      price: string;
      compare_at_price: string;
      stock: string;
      is_active: boolean;
    }>
  >([
    {
      sku: "",
      version: "",
      color: "",
      price: "",
      compare_at_price: "",
      stock: "",
      is_active: true,
    },
  ]);

  // Update form data when existing product is loaded
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        category: existingProduct.category?.name || "",
        brand: existingProduct.brand?.name || "",
        status: existingProduct.status,
        description: existingProduct.description || "",
      });

      // Load variants
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        setVariants(
          existingProduct.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            version: v.version || "",
            color: v.color || "",
            price: v.price.toString(),
            compare_at_price: v.compare_at_price?.toString() || "",
            stock: v.stock.toString(),
            is_active: v.is_active,
          }))
        );
      }
    }
  }, [existingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
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

    // Validate variants
    const hasInvalidVariant = variants.some(
      (v) => !v.sku || !v.price || !v.stock
    );
    if (hasInvalidVariant) {
      toast.error("Vui lòng điền đầy đủ thông tin cho tất cả biến thể");
      return;
    }

    if (isEdit && existingProduct) {
      // Update product
      updateProduct(existingProduct.id, {
        name: formData.name,
        category_id: selectedCategory.id,
        brand_id: selectedBrand?.id,
        status: formData.status as ProductStatus,
        description: formData.description,
      });

      // Update variants
      variants.forEach((v, index) => {
        if (v.id) {
          // Update existing variant
          updateProductVariant(v.id, {
            sku: v.sku,
            version: v.version || undefined,
            color: v.color || undefined,
            price: parseFloat(v.price),
            compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
            stock: parseInt(v.stock),
            is_active: v.is_active,
          });
        } else {
          // Add new variant to existing product
          addProductVariant({
            product_id: existingProduct.id,
            sku: v.sku,
            version: v.version || undefined,
            color: v.color || undefined,
            price: parseFloat(v.price),
            compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
            stock: parseInt(v.stock),
            is_active: v.is_active,
          });
        }
      });

      toast.success("Cập nhật sản phẩm thành công");
    } else {
      // Add new product - get the new ID that will be assigned
      const newProductId = Math.max(...products.map((p) => p.id), 0) + 1;
      
      addProduct({
        name: formData.name,
        category_id: selectedCategory.id,
        brand_id: selectedBrand?.id || 0,
        status: formData.status as ProductStatus,
        description: formData.description,
      });

      // Add variants to new product (they will be added synchronously)
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

      toast.success("Thêm sản phẩm mới thành công");
    }
    navigate("/products");
  };

  const handleChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
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
      },
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
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
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
          {/* Main info */}
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

            {/* Variants section */}
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
                          onChange={(e) => updateVariant(index, "sku", e.target.value)}
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
                          onChange={(e) =>
                            updateVariant(index, "compare_at_price", e.target.value)
                          }
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
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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

            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600">
                    Chọn hoặc kéo thả hình ảnh
                  </p>
                  <Input type="file" className="mt-2" accept="image/*" />
                </div>
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