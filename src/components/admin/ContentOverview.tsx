import { readingCategories } from "@/data/readingData";
import { conversationScenarios } from "@/data/conversationData";
import { pronunciationGroups } from "@/data/pronunciationData";
import { aesopFables } from "@/data/aesopFables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageCircle, Volume2, Library, Database, FileCode } from "lucide-react";

const ContentOverview = () => {
  const readingCount = readingCategories?.reduce(
    (acc: number, cat: any) => acc + (cat.storiesCount || 0),
    0
  ) || 0;
  const conversationCount = conversationScenarios?.length || 0;
  const pronunciationCount = pronunciationGroups?.length || 0;
  const fableCount = aesopFables?.length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Database className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold font-thai">ภาพรวมเนื้อหา</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reading Stories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-thai flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> บทอ่าน
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <FileCode className="w-3 h-3" /> Hardcoded
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{readingCount} <span className="text-sm font-normal text-muted-foreground font-thai">เรื่อง</span></p>
            <div className="mt-2 space-y-1">
              {readingCategories?.map((cat: any) => (
                <div key={cat.id} className="flex justify-between text-sm">
                  <span className="font-thai">{cat.icon} {cat.nameThai}</span>
                  <span className="text-muted-foreground">{cat.storiesCount || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-thai flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" /> บทสนทนา
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <FileCode className="w-3 h-3" /> Hardcoded
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{conversationCount} <span className="text-sm font-normal text-muted-foreground font-thai">สถานการณ์</span></p>
            <div className="mt-2 space-y-1">
              {conversationScenarios?.map((s: any) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="font-thai">{s.titleThai || s.title}</span>
                  <Badge variant="secondary" className="text-xs">{["","Pre-A1","A1","A2","B1","B2"][s.level] || s.level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pronunciation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-thai flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-500" /> ออกเสียง
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <FileCode className="w-3 h-3" /> Hardcoded
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pronunciationCount} <span className="text-sm font-normal text-muted-foreground font-thai">กลุ่ม</span></p>
            <div className="mt-2 space-y-1">
              {pronunciationGroups?.slice(0, 6).map((g: any) => (
                <div key={g.id} className="flex justify-between text-sm">
                  <span className="font-thai">{g.titleThai || g.title}</span>
                  <span className="text-muted-foreground">{g.words?.length || 0} คำ</span>
                </div>
              ))}
              {(pronunciationGroups?.length || 0) > 6 && (
                <p className="text-xs text-muted-foreground font-thai">...และอีก {(pronunciationGroups?.length || 0) - 6} กลุ่ม</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fables */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-thai flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Library className="w-4 h-4 text-purple-500" /> นิทานอีสป
              </span>
              <Badge variant="outline" className="flex items-center gap-1">
                <FileCode className="w-3 h-3" /> Hardcoded
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fableCount} <span className="text-sm font-normal text-muted-foreground font-thai">เรื่อง</span></p>
            <div className="mt-2 space-y-1">
              {aesopFables?.slice(0, 5).map((f: any) => (
                <div key={f.id} className="flex justify-between text-sm">
                  <span className="truncate max-w-[180px]">{f.title}</span>
                  <Badge variant="secondary" className="text-xs">{["","Pre-A1","A1","A2","B1","B2"][f.level] || f.level}</Badge>
                </div>
              ))}
              {fableCount > 5 && (
                <p className="text-xs text-muted-foreground font-thai">...และอีก {fableCount - 5} เรื่อง</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground font-thai">
          เนื้อหาเหล่านี้เก็บในไฟล์ TypeScript (Hardcoded) หากต้องการแก้ไข ให้แก้ที่ไฟล์ใน <code>src/data/</code> โดยตรง
          ในอนาคตสามารถย้ายไปเก็บใน Database เพื่อให้แก้ไขผ่าน Admin ได้
        </p>
      </div>
    </div>
  );
};

export default ContentOverview;
