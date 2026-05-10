import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Plus, Trash2, ImagePlus, Star, X, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../components/ui/select";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import { productService } from "../../services/productService";
const MAX_PRODUCT_IMAGES = 8;
const API_BASE_URL = "http://localhost:3000";
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token";
function buildRequestUrl(endpoint) {
    return endpoint.startsWith("/__webadmin/")
        ? endpoint
        : `${API_BASE_URL}${endpoint}`;
}
export function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, categories, brands, productVariants, productImages, addProduct, updateProduct, deleteProduct: _deleteProduct, addProductVariant, updateProductVariant, deleteProductVariant, addProductImage, deleteProductImage, setPrimaryProductImage, refreshData, } = useData();
    const isEdit = !!id;
    const existingProduct = isEdit
        ? products.find((p) => p.id.toString() === id)
        : null;
    const autoProductCode = useMemo(() => {
        const maxCode = products.reduce((max, product) => {
            const raw = product.sku || product.product_code || "";
            const match = typeof raw === "string" ? raw.match(/^PRD-(\d+)$/i) : null;
            if (!match)
                return max;
            const value = Number(match[1]);
            if (Number.isNaN(value))
                return max;
            return Math.max(max, value);
        }, 0);
        return `PRD-${String(maxCode + 1).padStart(5, "0")}`;
    }, [products]);
    const [formData, setFormData] = useState({
        name: existingProduct?.name || "",
        category: existingProduct?.category?.name || "",
        brand: existingProduct?.brand?.name || "",
        status: existingProduct?.status || "available",
        description: existingProduct?.description || "",
    });
    const [images, setImages] = useState([]);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [hydratedProductId, setHydratedProductId] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [variants, setVariants] = useState([
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
        if (!isEdit || !existingProduct?.slug || isFormDirty)
            return;
        if (hydratedProductId === existingProduct.id)
            return;
        let cancelled = false;
        setIsLoadingDetail(true);
        productService.getDetail(existingProduct.slug)
            .then((detail) => {
            if (cancelled)
                return;
            setFormData({
                name: detail.name,
                category: detail.category?.name || "",
                brand: detail.brand?.name || "",
                status: detail.status,
                description: detail.description || "",
            });
            if (detail.variants.length > 0) {
                setVariants(detail.variants.map((v) => ({
                    id: v.id,
                    sku: v.sku,
                    version: v.version || "",
                    color: v.color || "",
                    price: v.price.toString(),
                    compare_at_price: v.compare_at_price?.toString() || "",
                    stock: v.stock.toString(),
                    is_active: true,
                    imageUrl: v.variant_image || "",
                    imageFile: undefined,
                })));
            }
            setImages(detail.images
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((img) => ({
                id: img.id,
                url: img.image_url,
                is_primary: img.is_primary,
            })));
            setHydratedProductId(existingProduct.id);
        })
            .catch(() => {
            if (cancelled)
                return;
            setFormData({
                name: existingProduct.name,
                category: existingProduct.category?.name || "",
                brand: existingProduct.brand?.name || "",
                status: existingProduct.status,
                description: "",
            });
        })
            .finally(() => {
            if (!cancelled)
                setIsLoadingDetail(false);
        });
        return () => { cancelled = true; };
    }, [existingProduct?.id, existingProduct?.slug, isEdit, isFormDirty, hydratedProductId]);
    const handleAddImage = (e) => {
        if (!e.target.files || images.length >= MAX_PRODUCT_IMAGES)
            return;
        const file = e.target.files[0];
        if (!file)
            return;
        setIsFormDirty(true);
        const url = URL.createObjectURL(file);
        setImages((prev) => [
            ...prev,
            { url, is_primary: prev.length === 0, imageFile: file },
        ]);
        e.target.value = "";
    };
    const handleRemoveImage = (index) => {
        setIsFormDirty(true);
        setImages((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            if (prev[index].is_primary && updated.length > 0) {
                updated[0].is_primary = true;
            }
            return updated;
        });
    };
    const handleSetPrimary = (index) => {
        setIsFormDirty(true);
        setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === index })));
    };
    const handleVariantImageChange = (index, e) => {
        if (!e.target.files?.[0])
            return;
        setIsFormDirty(true);
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        updateVariant(index, "imageUrl", url);
        updateVariant(index, "imageFile", file);
        e.target.value = "";
    };
    const handleSubmit = async (e) => {
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
        if (!selectedBrand) {
            toast.error("Vui lòng chọn thương hiệu");
            return;
        }
        const hasVariantInput = (variant) => Boolean(variant.sku ||
            variant.price ||
            variant.stock ||
            variant.version ||
            variant.color ||
            variant.compare_at_price ||
            variant.imageFile ||
            variant.imageUrl);
        const variantsForEdit = variants.filter((variant) => variant.id || hasVariantInput(variant));
        const existingVariantsForEdit = isEdit && existingProduct
            ? (() => {
                const normalizedProductSku = (existingProduct.sku || "")
                    .trim()
                    .toLowerCase();
                const skuMatchedVariants = normalizedProductSku
                    ? productVariants.filter((variant) => variant.sku.trim().toLowerCase() === normalizedProductSku)
                    : [];
                if (existingProduct.variants &&
                    existingProduct.variants.length > 0) {
                    return existingProduct.variants;
                }
                const variantsByProductId = productVariants.filter((variant) => variant.product_id === existingProduct.id);
                if (variantsByProductId.length > 0) {
                    return variantsByProductId;
                }
                return skuMatchedVariants;
            })()
            : [];
        const variantsForEditResolved = isEdit && existingProduct
            ? variantsForEdit.map((variant) => {
                if (variant.id) {
                    return variant;
                }
                const normalizedSku = variant.sku.trim().toLowerCase();
                const matchedVariantByProduct = productVariants.find((existingVariant) => existingVariant.product_id === existingProduct.id &&
                    existingVariant.sku.trim().toLowerCase() === normalizedSku);
                const matchedBySkuCandidates = productVariants.filter((existingVariant) => existingVariant.sku.trim().toLowerCase() === normalizedSku);
                const matchedVariant = matchedVariantByProduct ||
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
        const unresolvedVariants = variantsForEditResolved.filter((variant) => !variant.id);
        const existingVariantIdSet = new Set(existingVariantsForEdit.map((variant) => variant.id));
        const currentVariantIdSet = new Set(variantsForEditResolved
            .filter((variant) => variant.id)
            .map((variant) => variant.id));
        const removedVariantIds = Array.from(existingVariantIdSet).filter((variantId) => !currentVariantIdSet.has(variantId));
        if (!isEdit) {
            if (variants.some((v) => !v.sku || !v.price || !v.stock)) {
                toast.error("Vui lòng điền đầy đủ SKU, giá và tồn kho cho tất cả biến thể");
                return;
            }
            if (variants.some((v) => !v.imageFile)) {
                toast.error("Mỗi biến thể phải có ảnh (bắt buộc khi tạo mới)");
                return;
            }
        }
        else {
            if (variantsForEditResolved.some((v) => !v.sku || !v.price || !v.stock)) {
                toast.error("Vui lòng điền đầy đủ SKU, giá và tồn kho cho tất cả biến thể");
                return;
            }
            if (unresolvedVariants.some((variant) => !variant.imageFile)) {
                toast.error("Biến thể mới cần có ảnh (backend yêu cầu ảnh khi tạo biến thể)");
                return;
            }
        }
        let createdProductId = null;
        try {
            if (isEdit && existingProduct) {
                await updateProduct(existingProduct.id, {
                    name: formData.name,
                    category_id: selectedCategory.id,
                    brand_id: selectedBrand.id,
                    status: formData.status,
                    description: formData.description,
                });
                if (removedVariantIds.length > 0) {
                    await Promise.all(removedVariantIds.map((variantId) => deleteProductVariant(variantId)));
                }
                await Promise.all(variantsForEditResolved.map((v) => {
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
                }));
                const existingImages = productImages
                    .filter((img) => img.product_id === existingProduct.id && !img.variant_id)
                    .sort((a, b) => a.sort_order - b.sort_order);
                const existingImageIdSet = new Set(existingImages.map((img) => img.id));
                const currentImageIdSet = new Set(images.filter((img) => img.id).map((img) => img.id));
                const removedImageIds = Array.from(existingImageIdSet).filter((imageId) => !currentImageIdSet.has(imageId));
                if (removedImageIds.length > 0) {
                    await Promise.all(removedImageIds.map((imageId) => deleteProductImage(imageId)));
                }
                const existingImageEntries = images.filter((img) => img.id);
                const newImageEntries = images.filter((img) => !img.id && img.imageFile);
                if (newImageEntries.length > 0) {
                    await Promise.all(newImageEntries.map((img, index) => addProductImage({
                        product_id: existingProduct.id,
                        variant_id: undefined,
                        image_url: img.url,
                        is_primary: img.is_primary,
                        sort_order: existingImageEntries.length + index,
                        image_file: img.imageFile,
                    })));
                }
                const primaryExistingImageId = images.find((img) => img.is_primary && img.id)?.id;
                if (primaryExistingImageId) {
                    await setPrimaryProductImage(primaryExistingImageId);
                }
                toast.success("Cập nhật sản phẩm thành công");
            }
            else {
                createdProductId = await productService.create({
                    sku: autoProductCode,
                    name: formData.name,
                    category_id: selectedCategory.id,
                    brand_id: selectedBrand.id,
                    status: formData.status,
                    description: formData.description,
                }).then((p) => p.id);
                await Promise.all(variants.map((v) => productService.createVariant(createdProductId, {
                    product_id: createdProductId,
                    sku: v.sku,
                    version: v.version || undefined,
                    color: v.color || undefined,
                    price: parseFloat(v.price),
                    compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
                    stock: parseInt(v.stock),
                    is_active: v.is_active,
                    variant_image_file: v.imageFile,
                })));
                const imageFiles = images.filter((img) => img.imageFile).map((img) => img.imageFile);
                if (imageFiles.length > 0) {
                    await productService.uploadImages(createdProductId, imageFiles);
                }
                toast.success("Thêm sản phẩm mới thành công");
                await refreshData();
            }
            navigate("/products");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Không thể lưu sản phẩm";
            if (message.toLowerCase().includes("cloud_name")) {
                toast.error("Backend chưa cấu hình Cloudinary nên chưa thể lưu biến thể có ảnh");
            }
            else {
                toast.error(message);
            }
        }
    };
    const handleChange = (field, value) => {
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
    const removeVariant = (index) => {
        if (variants.length === 1) {
            toast.error("Sản phẩm phải có ít nhất một biến thể");
            return;
        }
        setIsFormDirty(true);
        setVariants(variants.filter((_, i) => i !== index));
    };
    const updateVariant = (index, field, value) => {
        setIsFormDirty(true);
        setVariants((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/products"), children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới" }), _jsx("p", { className: "text-gray-600", children: isEdit
                                    ? "Cập nhật thông tin sản phẩm"
                                    : "Thêm sản phẩm mới vào hệ thống" })] })] }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin c\u01A1 b\u1EA3n" }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "name", children: "T\u00EAn s\u1EA3n ph\u1EA9m *" }), _jsx(Input, { id: "name", value: formData.name, onChange: (e) => handleChange("name", e.target.value), placeholder: "Nh\u1EADp t\u00EAn s\u1EA3n ph\u1EA9m", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Danh m\u1EE5c *" }), _jsxs(Select, { value: formData.category, onValueChange: (value) => handleChange("category", value), children: [_jsx(SelectTrigger, { id: "category", children: _jsx(SelectValue, { placeholder: "Ch\u1ECDn danh m\u1EE5c" }) }), _jsx(SelectContent, { children: categories.map((category) => (_jsx(SelectItem, { value: category.name, children: category.name }, category.id))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "brand", children: "Th\u01B0\u01A1ng hi\u1EC7u" }), _jsxs(Select, { value: formData.brand, onValueChange: (value) => handleChange("brand", value), children: [_jsx(SelectTrigger, { id: "brand", children: _jsx(SelectValue, { placeholder: "Ch\u1ECDn th\u01B0\u01A1ng hi\u1EC7u" }) }), _jsx(SelectContent, { children: brands.map((brand) => (_jsx(SelectItem, { value: brand.name, children: brand.name }, brand.id))) })] })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "description", children: "M\u00F4 t\u1EA3" }), _jsx(Textarea, { id: "description", value: formData.description, onChange: (e) => handleChange("description", e.target.value), placeholder: "M\u00F4 t\u1EA3 chi ti\u1EBFt s\u1EA3n ph\u1EA9m...", rows: 4 })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: "H\u00ECnh \u1EA3nh s\u1EA3n ph\u1EA9m" }), _jsxs("span", { className: "text-sm text-gray-500", children: [images.length, "/", MAX_PRODUCT_IMAGES, " \u1EA3nh \u00B7 Nh\u1EA5n \u2605 \u0111\u1EC3 \u0111\u1EB7t \u1EA3nh \u0111\u1EA1i di\u1EC7n"] })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-4 gap-3", children: [images.map((img, index) => (_jsxs("div", { className: "relative group aspect-square rounded-lg overflow-hidden border", children: [_jsx("img", { src: img.url, alt: "", className: "w-full h-full object-cover" }), _jsxs("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: [_jsx("button", { type: "button", onClick: () => handleSetPrimary(index), className: "p-1 rounded-full text-white hover:scale-110 transition-transform", title: "\u0110\u1EB7t l\u00E0m \u1EA3nh \u0111\u1EA1i di\u1EC7n", children: _jsx(Star, { className: "h-4 w-4", fill: img.is_primary ? "currentColor" : "none" }) }), _jsx("button", { type: "button", onClick: () => handleRemoveImage(index), className: "p-1 rounded-full text-white hover:scale-110 transition-transform", title: "X\u00F3a \u1EA3nh", children: _jsx(X, { className: "h-4 w-4" }) })] }), img.is_primary && (_jsx("span", { className: "absolute top-1 left-1 bg-yellow-400 text-xs text-white px-1.5 py-0.5 rounded", children: "Ch\u00EDnh" }))] }, index))), images.length < MAX_PRODUCT_IMAGES && (_jsxs("label", { className: "aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors", children: [_jsx(ImagePlus, { className: "h-6 w-6 text-gray-400" }), _jsx("span", { className: "text-xs text-gray-400 mt-1", children: "Th\u00EAm \u1EA3nh" }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleAddImage })] }))] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: "Bi\u1EBFn th\u1EC3 s\u1EA3n ph\u1EA9m (M\u00E0u s\u1EAFc, Phi\u00EAn b\u1EA3n)" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addVariant, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Th\u00EAm bi\u1EBFn th\u1EC3"] })] }) }), _jsx(CardContent, { className: "space-y-6", children: variants.map((variant, index) => (_jsxs("div", { className: "p-4 border rounded-lg space-y-4 relative", children: [variants.length > 1 && (_jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "absolute top-2 right-2", onClick: () => removeVariant(index), children: _jsx(Trash2, { className: "h-4 w-4 text-red-600" }) })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx(Label, { children: "SKU *" }), _jsx(Input, { value: variant.sku, onChange: (e) => updateVariant(index, "sku", e.target.value), placeholder: "Nh\u1EADp SKU", required: true })] }), _jsxs("div", { children: [_jsx(Label, { children: "Phi\u00EAn b\u1EA3n" }), _jsx(Input, { value: variant.version, onChange: (e) => updateVariant(index, "version", e.target.value), placeholder: "Nh\u1EADp phi\u00EAn b\u1EA3n" })] }), _jsxs("div", { children: [_jsx(Label, { children: "M\u00E0u s\u1EAFc" }), _jsx(Input, { value: variant.color, onChange: (e) => updateVariant(index, "color", e.target.value), placeholder: "Nh\u1EADp m\u00E0u s\u1EAFc" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Gi\u00E1 b\u00E1n *" }), _jsx(Input, { type: "number", value: variant.price, onChange: (e) => updateVariant(index, "price", e.target.value), placeholder: "Nh\u1EADp gi\u00E1 b\u00E1n", required: true })] }), _jsxs("div", { children: [_jsx(Label, { children: "Gi\u00E1 g\u1ED1c (so s\u00E1nh)" }), _jsx(Input, { type: "number", value: variant.compare_at_price, onChange: (e) => updateVariant(index, "compare_at_price", e.target.value), placeholder: "Nh\u1EADp gi\u00E1 g\u1ED1c" })] }), _jsxs("div", { children: [_jsx(Label, { children: "S\u1ED1 l\u01B0\u1EE3ng t\u1ED3n *" }), _jsx(Input, { type: "number", value: variant.stock, onChange: (e) => updateVariant(index, "stock", e.target.value), placeholder: "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng", required: true })] }), _jsxs("div", { className: "col-span-2", children: [_jsxs(Label, { children: ["\u1EA2nh bi\u1EBFn th\u1EC3", " ", !isEdit && (_jsx("span", { className: "text-red-500", children: "*" }))] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [variant.imageUrl ? (_jsxs("div", { className: "relative w-20 h-20 rounded-lg overflow-hidden border group shrink-0", children: [_jsx("img", { src: variant.imageUrl, alt: "", className: "w-full h-full object-cover" }), _jsx("button", { type: "button", onClick: () => {
                                                                                            updateVariant(index, "imageUrl", "");
                                                                                            updateVariant(index, "imageFile", undefined);
                                                                                        }, className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity", children: _jsx(X, { className: "h-4 w-4 text-white" }) })] })) : (_jsxs("label", { className: `w-20 h-20 shrink-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${!isEdit
                                                                                    ? "border-red-300 hover:border-red-400 hover:bg-red-50"
                                                                                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`, children: [_jsx(ImagePlus, { className: `h-5 w-5 ${!isEdit ? "text-red-400" : "text-gray-400"}` }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => handleVariantImageChange(index, e) })] })), _jsx("p", { className: "text-xs text-gray-500", children: !isEdit
                                                                                    ? "Ảnh bắt buộc khi tạo mới"
                                                                                    : "1 ảnh đại diện cho biến thể này" })] })] })] })] }, index))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Tr\u1EA1ng th\u00E1i" }) }), _jsxs(CardContent, { children: [_jsx(Label, { htmlFor: "status", children: "Tr\u1EA1ng th\u00E1i s\u1EA3n ph\u1EA9m" }), _jsxs(Select, { value: formData.status, onValueChange: (value) => handleChange("status", value), children: [_jsx(SelectTrigger, { id: "status", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "available", children: "\u0110ang kinh doanh" }), _jsx(SelectItem, { value: "out_of_stock", children: "H\u1EBFt h\u00E0ng" }), _jsx(SelectItem, { value: "discontinued", children: "Ng\u1EEBng kinh doanh" })] })] })] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs(Button, { type: "submit", className: "w-full", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"] }), _jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: () => navigate("/products"), children: "H\u1EE7y" })] })] })] }) })] }));
}
