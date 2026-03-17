import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleLineCallback } from "@/lib/line-auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LineCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const lineError = searchParams.get("error");

    if (lineError) {
      setError("LINE Login ถูกยกเลิก");
      toast.error("LINE Login ถูกยกเลิก");
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    if (!code || !state) {
      setError("ข้อมูลไม่ครบถ้วน");
      toast.error("ข้อมูลไม่ครบถ้วน");
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    handleLineCallback(code, state).then((result) => {
      if (result.success) {
        toast.success("เข้าสู่ระบบด้วย LINE สำเร็จ!");
        // New users → placement test, returning users → home
        navigate(result.isNewUser ? "/placement" : "/");
      } else {
        setError(result.error || "เกิดข้อผิดพลาด");
        toast.error(result.error || "เข้าสู่ระบบด้วย LINE ล้มเหลว");
        setTimeout(() => navigate("/auth"), 3000);
      }
    });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-purple-200 to-pink-200 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="space-y-2">
            <p className="text-red-600 font-thai font-semibold">{error}</p>
            <p className="text-sm text-muted-foreground font-thai">
              กำลังกลับไปหน้าเข้าสู่ระบบ...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
            <p className="text-foreground font-thai font-semibold">
              กำลังเข้าสู่ระบบด้วย LINE...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineCallbackPage;
