import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface BlurModalProps {
  children: React.ReactNode;
  horizontal?: "start" | "center" | "end";
  vertical?: "start" | "center" | "end";
  onClose: () => void;
}

export function BlurModal({
  horizontal = "center",
  vertical = "center",
  children,
  onClose,
}: BlurModalProps) {
  const horizontalClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  const verticalClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  return (
    <>
      {/* Blur overlay */}
      <div
        className="flex"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 50,
        }}
      />

      {/* Content */}
      <div
        className={`flex w-full h-full p-8 ${
          horizontal ? horizontalClasses[horizontal] : "justify-center"
        } ${vertical ? verticalClasses[vertical] : "items-center"}`}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 51,
        }}
      >
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <X />
        </Button>
        {children}
      </div>
    </>
  );
}
