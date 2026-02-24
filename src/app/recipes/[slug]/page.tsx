"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/types/recipe";
import type { Comment } from "@/types/comment";
import { useAuth } from "@/components/auth-provider";
import {
  ServingSelector,
  IngredientsList,
  NutritionBlock,
  RecipeMeta,
  MarkdownContent,
} from "@/components/recipe-detail";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Printer } from "lucide-react";

export default function RecipeDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [servings, setServings] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!slug) {
      setMounted(true);
      return;
    }
    let cancelled = false;
    fetch(`/api/recipes/slug/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res.status === 404) return null;
        return res.ok ? res.json() : null;
      })
      .then((data: Recipe | null) => {
        if (!cancelled && data) {
          setRecipe(data);
          setServings(data.baseServings);
        } else if (!cancelled) {
          setRecipe(undefined);
        }
      })
      .catch(() => {
        if (!cancelled) setRecipe(undefined);
      })
      .finally(() => {
        if (!cancelled) setMounted(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const fetchComments = useCallback((recipeId: string) => {
    fetch(`/api/recipes/id/${recipeId}/comments`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Comment[]) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, []);

  useEffect(() => {
    if (recipe?.id) fetchComments(recipe.id);
  }, [recipe?.id, fetchComments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe?.id || !commentContent.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    setCommentError(null);
    fetch(`/api/recipes/id/${recipe.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author_name: commentName.trim() || "匿名",
        author_email: commentEmail.trim() || undefined,
        content: commentContent.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(d?.error || res.statusText));
        return res.json();
      })
      .then((newComment: Comment) => {
        setComments((prev) => [newComment, ...prev]);
        setCommentContent("");
        setCommentName("");
        setCommentEmail("");
      })
      .catch((err) => setCommentError(typeof err === "string" ? err : "评论提交失败，请稍后再试"))
      .finally(() => setCommentSubmitting(false));
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  if (!recipe) {
    notFound();
  }

  const scale = servings / recipe.baseServings;

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="recipe-detail">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
          <RecipeMeta recipe={recipe} />
          {recipe.description && (
            <p className="text-muted-foreground">{recipe.description}</p>
          )}
        </header>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
          {recipe.image ? (
            recipe.image.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-6xl text-muted-foreground">
              🍳
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 print:border print:border-border print:rounded-md print:p-4">
          <ServingSelector
            value={servings}
            onChange={setServings}
            className="print:hidden"
          />
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              打印
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/recipes/${recipe.slug}/edit`} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  编辑
                </Link>
              </Button>
            )}
          </div>
        </div>

        {recipe.nutrition && (
          <div className="print:hidden">
            <NutritionBlock nutrition={recipe.nutrition} scale={scale} />
          </div>
        )}

        <section aria-label="原料">
          <h2 className="mb-3 text-xl font-semibold">原料</h2>
          <IngredientsList ingredients={recipe.ingredients} scale={scale} />
        </section>

        <Separator />

        <section aria-label="步骤">
          <h2 className="mb-3 text-xl font-semibold">步骤</h2>
          <div className="space-y-4">
            {recipe.steps.map((sec, sectionIdx) => (
              <div key={sectionIdx} className="space-y-2">
                {sec.name?.trim() && (
                  <h3 className="text-md font-semibold text-foreground">
                    {sec.name}
                  </h3>
                )}
                <ol className="list-inside list-decimal space-y-4 text-muted-foreground">
                  {sec.items.map((step, i) => (
                    <li key={i} className="pl-2 text-foreground">
                      <MarkdownContent inline>{step.content}</MarkdownContent>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {(recipe.tips?.length ?? 0) > 0 && (
          <>
            <Separator />
            <section aria-label="小贴士">
              <h2 className="mb-3 text-xl font-semibold">小贴士</h2>
              <ol className="list-inside list-decimal space-y-4 text-muted-foreground">
                {recipe.tips!.map((tip, i) => (
                  <li key={i} className="text-foreground">
                    <MarkdownContent inline>{tip}</MarkdownContent>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        {recipe.notes && (
          <>
            <Separator />
            <section aria-label="说明">
              <h2 className="mb-3 text-xl font-semibold">说明</h2>
              <div className="text-muted-foreground whitespace-pre-wrap">
                <MarkdownContent>{recipe.notes}</MarkdownContent>
              </div>
            </section>
          </>
        )}

        {(recipe.changelog?.length ?? 0) > 0 && (
          <>
            <Separator />
            <section aria-label="更新记录">
              <h2 className="mb-3 text-xl font-semibold">更新记录</h2>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {recipe.changelog!.map((entry, i) => (
                  <li key={i} className="text-foreground">
                    <MarkdownContent inline>{entry}</MarkdownContent>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <Separator className="print:hidden" />

        <section aria-label="评论" className="print:hidden space-y-4">
          <h2 className="text-xl font-semibold">评论</h2>

          <form onSubmit={handleSubmitComment} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comment-name">昵称（选填）</Label>
                <Input
                  id="comment-name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="匿名"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment-email">邮箱（选填，不公开）</Label>
                <Input
                  id="comment-email"
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-content">评论内容 *</Label>
              <Textarea
                id="comment-content"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="写下你的想法…"
                required
                rows={3}
                className="resize-none bg-background"
              />
            </div>
            {commentError && (
              <p className="text-sm text-destructive">{commentError}</p>
            )}
            <Button type="submit" disabled={commentSubmitting || !commentContent.trim()}>
              {commentSubmitting ? "提交中…" : "发表评论"}
            </Button>
          </form>

          <ul className="space-y-4">
            {comments.length === 0 ? (
              <li className="text-sm text-muted-foreground">暂无评论，来抢沙发吧～</li>
            ) : (
              comments.map((c) => (
                <li key={c.id} className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium">{c.author_name || "匿名"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground">{c.content}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

    </article>
  );
}
