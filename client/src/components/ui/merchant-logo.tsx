interface MerchantLogoProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MerchantLogo = ({ name, size = "md", className = "" }: MerchantLogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const iconMap: Record<string, string> = {
    "Amazon": "fa-shopping-bag",
    "星野珈琲": "fa-utensils",
    "ENEOS": "fa-gas-pump",
    "楽天": "fa-shopping-cart",
    "セブンイレブン": "fa-store",
    "Apple": "fa-apple",
    "Netflix": "fa-film",
    "Uber Eats": "fa-utensils",
    "スターバックス": "fa-coffee"
  };

  const icon = iconMap[name] || "fa-building";

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center ${className}`}>
      <i className={`fas ${icon} text-neutral-600`}></i>
    </div>
  );
};

export default MerchantLogo;
