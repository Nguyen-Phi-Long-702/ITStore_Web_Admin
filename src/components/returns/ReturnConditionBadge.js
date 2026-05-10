import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from "../ui/badge";
const conditionConfig = {
    good: {
        label: "Nguyên vẹn",
        color: "text-green-700",
        bgColor: "bg-green-100",
    },
    damaged: {
        label: "Bị hư hỏng",
        color: "text-red-700",
        bgColor: "bg-red-100",
    },
    wrong_item: {
        label: "Sai sản phẩm",
        color: "text-orange-700",
        bgColor: "bg-orange-100",
    },
};
export function ReturnConditionBadge({ condition }) {
    if (!condition)
        return null;
    const config = conditionConfig[condition];
    return (_jsx(Badge, { className: `${config.bgColor} ${config.color}`, children: config.label }));
}
