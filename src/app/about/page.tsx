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
          <CardTitle>ZQZ的食谱</CardTitle>
          <CardDescription>记录、分享我做过的美食</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            回顾自己做饭这么多年，自己做的菜总在慢慢地变化——菜系、技法、甚至口味。
            最早时候喜欢做炖菜，一次炖一大锅可以吃很久。
            后来一段时间热衷做中餐，尤其各种炒菜。最近一段时间又热衷于学习一些西餐的技法。
            偶尔翻翻相册，发现有些菜只做一两次就再也没做过了。
            多数时候单纯只是因为没有记下来于是忘记了，也有些可惜。
            于是我便想通过搭这个平台，写下一些食谱来记录自己做菜的历程。
          </p>
          {/* <p>
            另一个目的也是想做一个备忘录。
            做饭很少情况能一次就做的完美，往往需要反复的调整。有时候甚至第一次尝试做的反而比之后几次更好吃。
            因此，我也想用这个平台记录自己每个食谱的调整变化，方便日后参考。
          </p> */}
          <p>
            除了记录，我也更希望能够分享自己的一些经验和想法。
            作为一个业余厨艺爱好者，我的食谱、技法几乎都是从网上学习的，主要是YouTube、bilibili、下厨房等
            （我会尽量在我的食谱里注明我的参考来源）。
            我也希望能够把我学习体会到的分享出来以供参考。
          </p>
          <Button asChild variant="outline">
            <Link href="/">返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
