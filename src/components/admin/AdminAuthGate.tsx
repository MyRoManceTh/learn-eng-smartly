import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Lock, ShieldX, LogIn, Bot } from "lucide-react";

interface Props {
  children: ReactNode;
}

const AdminAuthGate = ({ children }: Props) => {
  const { isAdmin, isLoading, isLoggedIn } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Bot className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-thai">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-thai">Admin Access</h1>
            <p className="text-muted-foreground font-thai mt-2">
              กรุณาเข้าสู่ระบบก่อนเข้าหน้า Admin
            </p>
          </div>
          <Button onClick={() => navigate("/auth")} className="w-full font-thai">
            <LogIn className="w-4 h-4 mr-2" />
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-thai">ไม่มีสิทธิ์เข้าถึง</h1>
            <p className="text-muted-foreground font-thai mt-2">
              บัญชีนี้ไม่มีสิทธิ์ Admin
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")} className="w-full font-thai">
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGate;
