import { Badge } from "../ui/badge";

interface ReturnConditionBadgeProps {
  condition?: "good" | "damaged" | "wrong_item";
}

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

export function ReturnConditionBadge({ condition }: ReturnConditionBadgeProps) {
  if (!condition) return null;

  const config = conditionConfig[condition];

  return (
    <Badge className={`${config.bgColor} ${config.color}`}>
      {config.label}
    </Badge>
  );
}
