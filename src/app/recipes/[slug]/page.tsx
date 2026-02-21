"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getRecipeBySlug } from "@/lib/store";
import {
  ServingSelector,
  IngredientsList,
  NutritionBlock,
  RecipeMeta,
} from "@/components/recipe-detail";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Printer } from "lucide-react";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [recipe, setRecipe] = useState<ReturnType<typeof getRecipeBySlug>>(undefined);
  const [servings, setServings] = useState(4);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const r = getRecipeBySlug(slug);
    setRecipe(r);
    if (r) setServings(r.baseServings);
    setMounted(true);
  }, [slug]);

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
            <Button variant="outline" size="sm" asChild>
              <Link href={`/recipes/${recipe.slug}/edit`} className="gap-2">
                <Pencil className="h-4 w-4" />
                编辑
              </Link>
            </Button>
          </div>
        </div>

        <section aria-label="原料">
          <h2 className="mb-3 text-xl font-semibold">原料</h2>
          <IngredientsList ingredients={recipe.ingredients} scale={scale} />
        </section>

        <Separator />

        <section aria-label="步骤">
          <h2 className="mb-3 text-xl font-semibold">步骤</h2>
          <ol className="list-inside list-decimal space-y-4 text-muted-foreground">
            {recipe.steps.map((step, i) => (
              <li key={i} className="pl-2 text-foreground">
                {step.content}
              </li>
            ))}
          </ol>
        </section>

        {(recipe.tips?.length ?? 0) > 0 && (
          <>
            <Separator />
            <section aria-label="小贴士">
              <h2 className="mb-3 text-xl font-semibold">小贴士</h2>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {recipe.tips!.map((tip, i) => (
                  <li key={i} className="text-foreground">{tip}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {recipe.notes && (
          <>
            <Separator />
            <section aria-label="说明">
              <h2 className="mb-3 text-xl font-semibold">说明</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {recipe.notes}
              </p>
            </section>
          </>
        )}

        {recipe.nutrition && (
          <div className="print:hidden">
            <NutritionBlock nutrition={recipe.nutrition} scale={scale} />
          </div>
        )}
      </div>

    </article>
  );
}
