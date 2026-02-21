import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "关于",
  description: "关于本食谱博客",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">关于</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recipe Blog</CardTitle>
          <CardDescription>一个简单的食谱记录与分享博客</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            这里用来记录和整理日常食谱，支持按份数自动换算原料、可选营养信息，以及打印与编辑。
          </p>
          <p>
            当前为单人使用版本，数据保存在本地浏览器中。
          </p>
          <Button asChild variant="outline">
            <Link href="/">返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
