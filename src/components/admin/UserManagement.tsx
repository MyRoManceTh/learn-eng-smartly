import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Search, Ban, ShieldCheck, RotateCcw, Gift } from "lucide-react";
import UserDetailSheet from "./UserDetailSheet";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [grantUserId, setGrantUserId] = useState<string | null>(null);
  const [grantCoins, setGrantCoins] = useState(0);
  const [grantExp, setGrantExp] = useState(0);
  const [banReason, setBanReason] = useState("");

  const { users, isLoading, banUser, unbanUser, resetProgress, grantReward } = useAdminUsers(debouncedSearch);

  const handleSearch = () => {
    setDebouncedSearch(search);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground font-thai">กำลังโหลดผู้ใช้...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold font-thai">จัดการผู้ใช้ ({users.length})</h2>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="ค้นหาชื่อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-[200px]"
          />
          <Button size="sm" variant="outline" onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead className="w-[60px]">Lv</TableHead>
              <TableHead className="w-[80px]">EXP</TableHead>
              <TableHead className="w-[80px]">Coins</TableHead>
              <TableHead className="w-[60px]">Streak</TableHead>
              <TableHead className="w-[80px]">สถานะ</TableHead>
              <TableHead className="w-[180px] text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground font-thai">
                  ไม่พบผู้ใช้
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow
                  key={user.user_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell className="font-medium font-thai max-w-[150px] truncate">
                    {user.display_name || "ไม่ระบุชื่อ"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Lv.{user.current_level || 1}</Badge>
                  </TableCell>
                  <TableCell>{(user.total_exp || 0).toLocaleString()}</TableCell>
                  <TableCell>{(user.coins || 0).toLocaleString()}</TableCell>
                  <TableCell>{user.current_streak || 0}</TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive" className="font-thai">แบน</Badge>
                    ) : user.is_premium ? (
                      <Badge className="bg-yellow-500 font-thai">Premium</Badge>
                    ) : (
                      <Badge variant="secondary" className="font-thai">ปกติ</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      {/* Ban/Unban */}
                      {user.is_banned ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="ปลดแบน"
                          onClick={() => unbanUser.mutate(user.user_id)}
                        >
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="แบน">
                              <Ban className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-thai">แบนผู้ใช้</AlertDialogTitle>
                              <AlertDialogDescription className="font-thai">
                                แบน "{user.display_name || "ไม่ระบุชื่อ"}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Input
                              placeholder="เหตุผล..."
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                              className="font-thai"
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-thai">ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive font-thai"
                                onClick={() => {
                                  banUser.mutate({ userId: user.user_id, reason: banReason });
                                  setBanReason("");
                                }}
                              >
                                แบน
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {/* Reset Progress */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="รีเซ็ต">
                            <RotateCcw className="w-4 h-4 text-orange-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-thai">รีเซ็ตความก้าวหน้า</AlertDialogTitle>
                            <AlertDialogDescription className="font-thai">
                              รีเซ็ต EXP, Coins, Streak, Level ของ "{user.display_name}" เป็น 0? ไม่สามารถย้อนกลับได้
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-thai">ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive font-thai"
                              onClick={() => resetProgress.mutate(user.user_id)}
                            >
                              รีเซ็ต
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Grant Reward */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="แจกรางวัล"
                            onClick={() => {
                              setGrantUserId(user.user_id);
                              setGrantCoins(0);
                              setGrantExp(0);
                            }}
                          >
                            <Gift className="w-4 h-4 text-purple-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-thai">แจกรางวัล</AlertDialogTitle>
                            <AlertDialogDescription className="font-thai">
                              แจกให้ "{user.display_name}"
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-thai">Coins</label>
                              <Input
                                type="number"
                                min={0}
                                value={grantCoins}
                                onChange={(e) => setGrantCoins(Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-thai">EXP</label>
                              <Input
                                type="number"
                                min={0}
                                value={grantExp}
                                onChange={(e) => setGrantExp(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-thai">ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                              className="font-thai"
                              onClick={() => {
                                if (grantUserId) {
                                  grantReward.mutate({
                                    userId: grantUserId,
                                    coins: grantCoins || undefined,
                                    exp: grantExp || undefined,
                                  });
                                }
                              }}
                            >
                              แจก
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Sheet */}
      {selectedUser && (
        <UserDetailSheet
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
