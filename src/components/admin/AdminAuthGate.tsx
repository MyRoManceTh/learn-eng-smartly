import { useState, ReactNode } from "react";
import { ADMIN_PASSWORD } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck } from "lucide-react";

interface Props {
  children: ReactNode;
}

const AdminAuthGate = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-thai">🔒 Admin Access</h1>
          <p className="text-muted-foreground font-thai mt-2">
            กรุณาใส่รหัสผ่านเพื่อเข้าสู่แดชบอร์ด
          </p>
        </div>
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="รหัสผ่าน..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={error ? "border-destructive" : ""}
          />
          {error && (
            <p className="text-sm text-destructive font-thai">รหัสผ่านไม่ถูกต้อง</p>
          )}
          <Button onClick={handleLogin} className="w-full font-thai">
            <ShieldCheck className="w-4 h-4 mr-2" />
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthGate;
