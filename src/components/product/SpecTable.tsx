import Link from "next/link";
import type { Product, SpecGroup } from "@/data/types";
import { specFor } from "@/lib/catalog";

/**
 * Deye-style specification table: one column per model in the series, with the
 * current model highlighted. On narrow screens the table scrolls horizontally and
 * the label column stays pinned.
 */
export function SpecTable({
  groups,
  products,
  activeIndex,
  categorySlug,
}: {
  groups: SpecGroup[];
  products: Product[];
  activeIndex?: number;
  categorySlug: string;
}) {
  const multi = products.length > 1;
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-line">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
          {multi && (
            <thead>
              <tr className="bg-ink text-white">
                <th scope="col" className="sticky left-0 z-10 w-[34%] min-w-[180px] bg-ink px-4 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white/70">
                  Model
                </th>
                {products.map((p, i) => (
                  <th key={p.slug} scope="col" className={`min-w-[120px] px-4 py-3.5 align-bottom font-semibold ${i === activeIndex ? "bg-brand" : ""}`}>
                    {i === activeIndex ? (
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70">This model</span>
                        {p.model ?? p.name}
                      </span>
                    ) : (
                      <Link href={`/products/${categorySlug}/${p.slug}`} className="text-white/85 underline-offset-4 hover:text-white hover:underline">
                        {p.model ?? p.name}
                      </Link>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {groups.map((g) => (
            <tbody key={g.title}>
              <tr>
                <th colSpan={products.length + 1} scope="colgroup" className="bg-mist px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-brand">
                  {g.title}
                </th>
              </tr>
              {g.rows.map((row) => {
                const shared = !Array.isArray(row.value);
                return (
                  <tr key={row.label} className="border-t border-line">
                    <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-muted">
                      {row.label}
                    </th>
                    {shared ? (
                      <td colSpan={products.length} className="px-4 py-3 font-semibold text-ink">
                        <Value v={specFor(row.value, 0)} />
                      </td>
                    ) : (
                      products.map((p, i) => (
                        <td key={p.slug} className={`px-4 py-3 font-semibold text-ink ${i === activeIndex ? "bg-brand-50" : ""}`}>
                          <Value v={specFor(row.value, i)} />
                        </td>
                      ))
                    )}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}

function Value({ v }: { v: string | null }) {
  if (v === null) return <span className="font-normal italic text-muted/80">To be confirmed</span>;
  return <>{v}</>;
}
