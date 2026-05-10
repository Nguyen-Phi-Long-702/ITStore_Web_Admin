import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { brandService } from "../services/brandService";
import { orderService } from "../services/orderService";
import { customerService } from "../services/customerService";
import { couponService } from "../services/couponService";
import { returnService } from "../services/returnService";
import { systemService } from "../services/systemService";
const DataContext = createContext(undefined);
const DEFAULT_SYSTEM_CONFIG = {
    paymentConfig: {
        codEnabled: true,
        bankTransferEnabled: true,
        creditCardEnabled: false,
        momoEnabled: true,
        vnpayEnabled: false,
    },
    shippingConfig: {
        baseShippingFee: 30000,
        freeShippingThreshold: 500000,
        distanceFeePerKm: 5000,
        urgentShippingFee: 50000,
    },
    bankInfo: {
        bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
        accountNumber: "0123456789",
        accountName: "CONG TY TNHH IT STORE",
    },
    banners: [
        { id: "1", title: "Banner khuyến mãi tháng 2", url: "", active: true },
        { id: "2", title: "Banner sản phẩm mới", url: "", active: true },
    ],
    notificationTemplates: {
        orderNotification: "Bạn có đơn hàng mới từ [CUSTOMER_NAME]",
        lowStockNotification: "Sản phẩm [PRODUCT_NAME] sắp hết hàng (còn [QUANTITY])",
        shipmentNotification: "Đơn hàng [ORDER_NUMBER] đang được giao bởi [SHIPPER_NAME]",
    },
};
function normalizeReturnRequests(requests, orderItems, productVariants) {
    return requests.map((request) => {
        const rawItems = request.items ?? request.return_items ?? [];
        const requestOrderItems = request.order?.items ?? request.order?.order_items ?? [];
        const items = rawItems.map((item) => {
            const embeddedOrderItem = item.order_item;
            const matchedRequestOrderItem = requestOrderItems.find((orderItemEntry) => String(orderItemEntry.id) === String(item.order_item_id));
            const matchedGlobalOrderItem = orderItems.find((orderItemEntry) => String(orderItemEntry.id) === String(item.order_item_id));
            const orderItem = embeddedOrderItem ?? matchedRequestOrderItem ?? matchedGlobalOrderItem;
            const matchedVariant = orderItem?.variant_id == null
                ? undefined
                : productVariants.find((variantEntry) => String(variantEntry.id) === String(orderItem.variant_id));
            const variant = orderItem?.variant ?? orderItem?.product_variant ?? matchedVariant;
            return {
                ...item,
                condition: item.condition ?? item.return_condition,
                order_item: orderItem ? { ...orderItem, variant } : item.order_item,
            };
        });
        return {
            ...request,
            items,
        };
    });
}
export function DataProvider({ children }) {
    const [rawProducts, setRawProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [rawCustomers, setRawCustomers] = useState([]);
    const [rawOrders, setRawOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [productVariants, setProductVariants] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [stockMovements, setStockMovements] = useState([]);
    const [returnRequests, setReturnRequests] = useState([]);
    const [systemConfig, setSystemConfig] = useState(DEFAULT_SYSTEM_CONFIG);
    const [productFetchError, setProductFetchError] = useState(null);
    const [brandFetchError, setBrandFetchError] = useState(null);
    const fetchAll = useCallback(async () => {
        const results = await Promise.allSettled([
            productService.getAll(),
            categoryService.getAll(),
            brandService.getAll(),
            customerService.getAll(),
            orderService.getAll(),
            orderService.getItems(),
            couponService.getAll(),
            productService.getImages(),
            productService.getStockMovements(),
            returnService.getAll(),
            systemService.getConfig(),
        ]);
        const [productsRes, categoriesRes, brandsRes, customersRes, ordersRes, itemsRes, couponsRes, imagesRes, stockRes, returnsRes, configRes,] = results;
        let loadedVariants = [];
        if (productsRes.status === "fulfilled") {
            const loadedProducts = productsRes.value;
            setRawProducts(loadedProducts);
            setProductFetchError(null);
            const variantResults = await Promise.allSettled(loadedProducts.map((p) => productService.getVariantsByProduct(p.id)));
            const allVariants = variantResults
                .filter((r) => r.status === "fulfilled")
                .flatMap((r) => r.value)
                .map((variant) => ({
                ...variant,
                product: loadedProducts.find((product) => product.id === variant.product_id),
            }));
            loadedVariants = allVariants;
            setProductVariants(allVariants);
        }
        else {
            setProductFetchError(productsRes.reason?.message ?? "Không thể tải sản phẩm");
        }
        if (categoriesRes.status === "fulfilled")
            setCategories(categoriesRes.value);
        if (brandsRes.status === "fulfilled") {
            setBrands(brandsRes.value);
            setBrandFetchError(null);
        }
        else {
            setBrandFetchError(brandsRes.reason?.message ?? "Không thể tải thương hiệu");
        }
        if (customersRes.status === "fulfilled")
            setRawCustomers(customersRes.value);
        if (ordersRes.status === "fulfilled")
            setRawOrders(ordersRes.value);
        if (itemsRes.status === "fulfilled")
            setOrderItems(itemsRes.value);
        if (couponsRes.status === "fulfilled")
            setCoupons(couponsRes.value);
        if (imagesRes.status === "fulfilled")
            setProductImages(imagesRes.value);
        if (stockRes.status === "fulfilled")
            setStockMovements(stockRes.value);
        if (returnsRes.status === "fulfilled") {
            setReturnRequests(normalizeReturnRequests(returnsRes.value, itemsRes.status === "fulfilled" ? itemsRes.value : [], loadedVariants));
        }
        if (configRes.status === "fulfilled" && configRes.value)
            setSystemConfig(configRes.value);
    }, []);
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);
    const products = rawProducts.map((p) => ({
        ...p,
        variants: productVariants.filter((v) => v.product_id === p.id),
        images: productImages.filter((img) => img.product_id === p.id),
    }));
    const customers = useMemo(() => rawCustomers.map((c) => {
        const paidOrders = rawOrders.filter((o) => o.user_id === c.id && o.payment_status === "paid");
        return {
            ...c,
            totalOrders: paidOrders.length,
            totalSpent: paidOrders.reduce((sum, o) => sum + o.total, 0),
        };
    }), [rawCustomers, rawOrders]);
    const orders = useMemo(() => rawOrders.map((o) => {
        const items = (o.items?.length ? o.items : orderItems.filter((i) => i.order_id === o.id)).map((item) => {
            const variant = productVariants.find((v) => v.id === item.variant_id);
            return { ...item, variant };
        });
        return {
            ...o,
            user: rawCustomers.find((c) => c.id === o.user_id) ?? o.user,
            items,
        };
    }), [rawOrders, orderItems, productVariants, rawCustomers]);
    async function withRefresh(fn) {
        const result = await fn();
        await fetchAll();
        return result;
    }
    const addProduct = async (data) => {
        const created = await withRefresh(() => productService.create(data));
        return created.id;
    };
    const updateProduct = async (id, updates) => {
        if (updates.status) {
            await productService.updateStatus(id, updates.status);
        }
        const { status, ...rest } = updates;
        if (Object.keys(rest).length > 0) {
            await productService.update(id, rest);
        }
        await fetchAll();
    };
    const deleteProduct = (id) => withRefresh(() => productService.remove(id));
    const addCategory = (data) => withRefresh(() => categoryService.create(data).then(() => undefined));
    const updateCategory = (id, updates) => withRefresh(() => categoryService.update(id, updates));
    const deleteCategory = (id) => withRefresh(() => categoryService.remove(id));
    const addBrand = (data) => withRefresh(() => brandService.create(data));
    const updateBrand = (id, updates) => withRefresh(() => brandService.update(id, updates));
    const deleteBrand = (id) => withRefresh(() => brandService.remove(id));
    const updateCustomer = (id, updates) => withRefresh(() => customerService.updateStatus(id, updates.is_active ?? true));
    const deleteCustomer = (id) => withRefresh(() => customerService.remove(id));
    const addOrder = async (_data) => {
        await fetchAll();
    };
    const updateOrder = async (id, updates) => {
        if (updates.order_status === "cancelled" && updates.cancel_reason) {
            await orderService.cancelOrder(id, updates.cancel_reason);
        }
        else if (updates.order_status) {
            await orderService.updateStatus(id, updates.order_status);
        }
        await fetchAll();
    };
    const deleteOrder = (id) => withRefresh(() => orderService.remove(id));
    const addCoupon = (data) => withRefresh(() => couponService.create(data).then(() => undefined));
    const updateCoupon = (id, updates) => withRefresh(() => couponService.update(id, updates));
    const deleteCoupon = (id) => withRefresh(() => couponService.remove(id));
    const addProductVariant = (data) => withRefresh(() => productService.createVariant(data.product_id, data));
    const updateProductVariant = (id, updates) => withRefresh(() => productService.updateVariant(id, updates));
    const deleteProductVariant = (id) => withRefresh(() => productService.removeVariant(id));
    const addProductImage = async (data) => {
        if (data.image_file) {
            await withRefresh(() => productService.uploadImages(data.product_id, [data.image_file]));
        }
    };
    const updateProductImage = (id, updates) => withRefresh(() => productService.updateImage(id, updates));
    const deleteProductImage = (id) => withRefresh(() => productService.removeImage(id));
    const setPrimaryProductImage = (id) => withRefresh(() => productService.setPrimaryImage(id));
    const addStockMovement = (data) => withRefresh(() => productService.createStockMovement(data));
    const updateStockMovement = (id, updates) => withRefresh(() => productService.updateStockMovement(id, updates));
    const deleteStockMovement = (id) => withRefresh(() => productService.removeStockMovement(id));
    const updateReturnRequest = (id, updates) => withRefresh(() => returnService.update(id, updates));
    const updateSystemConfig = async (updates) => {
        const payload = { ...systemConfig, ...updates };
        await withRefresh(() => systemService.updateConfig(payload));
        setSystemConfig(payload);
    };
    const value = {
        products,
        categories,
        brands,
        customers,
        orders,
        orderItems,
        coupons,
        productVariants,
        productImages,
        stockMovements,
        returnRequests,
        systemConfig,
        productFetchError,
        brandFetchError,
        refreshData: fetchAll,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
        updateCustomer,
        deleteCustomer,
        addOrder,
        updateOrder,
        deleteOrder,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addProductVariant,
        updateProductVariant,
        deleteProductVariant,
        addProductImage,
        updateProductImage,
        deleteProductImage,
        setPrimaryProductImage,
        addStockMovement,
        updateStockMovement,
        deleteStockMovement,
        updateReturnRequest,
        updateSystemConfig,
    };
    return _jsx(DataContext.Provider, { value: value, children: children });
}
export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx)
        throw new Error("useData must be used within a DataProvider");
    return ctx;
}
