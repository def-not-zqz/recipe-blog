"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { deleteRecipeAction } from "@/app/actions/recipes";
import type { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Recipe[]>([]);
  const [mounted, setMounted] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    return fetch("/api/recipes/drafts")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Recipe[]) => setDrafts(Array.isArray(data) ? data : []))
      .catch(() => setDrafts([]));
  }, []);

  useEffect(() => {
    refresh().finally(() => setMounted(true));
  }, [refresh]);

  const handleDelete = async (id: string) => {
    const result = await deleteRecipeAction(id);
    if (result.success) {
      refresh();
      setDeleteId(null);
    } else {
      console.error(result.error);
      alert(result.error);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">草稿箱</h1>

      {drafts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">还没有草稿</p>
          <Button asChild>
            <Link href="/recipes/new">创建食谱</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drafts.map((recipe) => (
            <li key={recipe.id}>
              <Card className="flex h-full flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-lg">
                    {recipe.title || "（未命名）"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    更新于 {new Date(recipe.updatedAt).toLocaleDateString("zh-CN")}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  {recipe.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {recipe.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/recipes/${recipe.slug}/edit`} className="gap-2">
                      <Pencil className="h-4 w-4" />
                      继续编辑
                    </Link>
                  </Button>
                  <Dialog
                    open={deleteId === recipe.id}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive"
                        onClick={() => setDeleteId(recipe.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>删除草稿</DialogTitle>
                        <DialogDescription>
                          确定要删除「{recipe.title || "未命名"}」吗？此操作无法撤销。
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteId(null)}
                        >
                          取消
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          删除
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
