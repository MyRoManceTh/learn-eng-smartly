import { shopItems } from "@/data/shopItems";
import { gachaExclusiveItems, GACHA_RATES, GACHA_COIN_COST, PITY_THRESHOLD } from "@/data/gachaItems";
import { seasonTiers } from "@/data/seasonRewards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Dice5, Trophy, FileCode } from "lucide-react";

const rarityColor: Record<string, string> = {
  common: "bg-gray-400",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
};

const ShopGachaManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold font-thai">ร้านค้า & Gacha</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <FileCode className="w-3 h-3" /> Hardcoded
        </Badge>
      </div>

      <Tabs defaultValue="shop">
        <TabsList>
          <TabsTrigger value="shop" className="font-thai">
            <ShoppingBag className="w-4 h-4 mr-1" /> ร้านค้า
          </TabsTrigger>
          <TabsTrigger value="gacha" className="font-thai">
            <Dice5 className="w-4 h-4 mr-1" /> Gacha
          </TabsTrigger>
          <TabsTrigger value="season" className="font-thai">
            <Trophy className="w-4 h-4 mr-1" /> Season Pass
          </TabsTrigger>
        </TabsList>

        {/* Shop Tab */}
        <TabsContent value="shop">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ไอเทม</TableHead>
                  <TableHead>หมวด</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>Rarity</TableHead>
                  <TableHead>จำกัด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(shopItems || []).map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-thai">
                      {item.icon} {item.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.price} coins</TableCell>
                    <TableCell>
                      <Badge className={`${rarityColor[item.rarity] || "bg-gray-400"} text-white`}>
                        {item.rarity}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.maxOwned || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground font-thai mt-2">
            รวม {shopItems?.length || 0} ไอเทม
          </p>
        </TabsContent>

        {/* Gacha Tab */}
        <TabsContent value="gacha">
          <div className="space-y-4">
            {/* Gacha Config */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-thai">ตั้งค่า Gacha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-muted-foreground font-thai">ราคา</p>
                    <p className="text-lg font-bold">{GACHA_COIN_COST} <span className="text-xs">coins</span></p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-muted-foreground font-thai">Pity</p>
                    <p className="text-lg font-bold">{PITY_THRESHOLD} <span className="text-xs font-thai">ครั้ง</span></p>
                  </div>
                  {Object.entries(GACHA_RATES || {}).map(([rarity, rate]) => (
                    <div key={rarity} className="border rounded-lg p-3 text-center">
                      <p className="text-muted-foreground capitalize">{rarity}</p>
                      <p className="text-lg font-bold">{((rate as number) * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gacha Items */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ไอเทม</TableHead>
                    <TableHead>Rarity</TableHead>
                    <TableHead>หมวด</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(gachaExclusiveItems || []).map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-thai">
                        {item.icon} {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${rarityColor[item.rarity] || "bg-gray-400"} text-white`}>
                          {item.rarity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category || item.type || "-"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground font-thai">
              รวม {gachaExclusiveItems?.length || 0} ไอเทม
            </p>
          </div>
        </TabsContent>

        {/* Season Pass Tab */}
        <TabsContent value="season">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Free Reward</TableHead>
                  <TableHead>Premium Reward</TableHead>
                  <TableHead>EXP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(seasonTiers || []).map((tier: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold">{tier.tier || i + 1}</TableCell>
                    <TableCell className="font-thai">{tier.freeReward || "-"}</TableCell>
                    <TableCell className="font-thai">{tier.premiumReward || "-"}</TableCell>
                    <TableCell>{tier.expRequired || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground font-thai mt-2">
            รวม {seasonTiers?.length || 0} tiers
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopGachaManagement;
