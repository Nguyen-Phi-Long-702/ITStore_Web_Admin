import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "../ui/tooltip";
export function ColorSwatch({ color, colorHex, size = "md", showLabel = false, }) {
    if (!colorHex && !color)
        return null;
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };
    const element = (_jsx("div", { className: `${sizeClasses[size]} rounded-full border-2 border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform`, style: { backgroundColor: colorHex || "#CCCCCC" }, title: color }));
    if (showLabel && color) {
        return (_jsxs("div", { className: "flex items-center gap-2", children: [element, _jsx("span", { className: "text-sm", children: color })] }));
    }
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: element }), _jsx(TooltipContent, { children: _jsx("p", { children: color || colorHex }) })] }) }));
}
