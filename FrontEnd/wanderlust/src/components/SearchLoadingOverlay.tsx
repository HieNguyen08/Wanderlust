import { Car, FileCheck, Hotel, PartyPopper, Plane } from "lucide-react";
import { motion } from "motion/react";

interface SearchLoadingOverlayProps {
  isLoading: boolean;
  searchType?: "flight" | "hotel" | "car" | "activity" | "visa";
  message?: string;
}

export function SearchLoadingOverlay({ 
  isLoading, 
  searchType = "flight",
  message 
}: SearchLoadingOverlayProps) {
  if (!isLoading) return null;

  // Icon dựa theo loại tìm kiếm
  const iconConfig = {
    flight: { Icon: Plane, color: "blue", text: "Đang tìm chuyến bay..." },
    hotel: { Icon: Hotel, color: "purple", text: "Đang tìm khách sạn..." },
    car: { Icon: Car, color: "green", text: "Đang tìm xe cho bạn..." },
    activity: { Icon: PartyPopper, color: "orange", text: "Đang tìm hoạt động..." },
    visa: { Icon: FileCheck, color: "indigo", text: "Đang xử lý thông tin..." },
  };

  const { Icon, color, text } = iconConfig[searchType];
  const displayMessage = message || text;

  // Color mappings for Tailwind
  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      bgTo: "bg-blue-600",
      border: "border-blue-200",
      dot: "bg-blue-500",
      progress: "from-blue-500 to-blue-600"
    },
    purple: {
      bg: "bg-purple-500",
      bgTo: "bg-purple-600",
      border: "border-purple-200",
      dot: "bg-purple-500",
      progress: "from-purple-500 to-purple-600"
    },
    green: {
      bg: "bg-green-500",
      bgTo: "bg-green-600",
      border: "border-green-200",
      dot: "bg-green-500",
      progress: "from-green-500 to-green-600"
    },
    orange: {
      bg: "bg-orange-500",
      bgTo: "bg-orange-600",
      border: "border-orange-200",
      dot: "bg-orange-500",
      progress: "from-orange-500 to-orange-600"
    },
    indigo: {
      bg: "bg-indigo-500",
      bgTo: "bg-indigo-600",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
      progress: "from-indigo-500 to-indigo-600"
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 min-w-[320px] max-w-md mx-4"
      >
        {/* Animated Icon */}
        <div className="relative">
          {/* Rotating rings */}
          <motion.div
            className={`absolute inset-0 rounded-full border-4 ${colors.border}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ width: "100px", height: "100px" }}
          />
          
          {/* Center icon with bounce */}
          <motion.div
            className={`w-[100px] h-[100px] bg-linear-to-br ${colors.bg} ${colors.bgTo} rounded-full flex items-center justify-center shadow-lg`}
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <motion.h3
            className="text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {displayMessage}
          </motion.h3>
          
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Vui lòng chờ trong giây lát
          </motion.p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 ${colors.dot} rounded-full`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-linear-to-r ${colors.progress} rounded-full`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
