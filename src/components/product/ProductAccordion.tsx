"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { WCAttribute } from "@/types/woocommerce";

interface AccordionSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface ProductAccordionProps {
  description: string;
  attributes: WCAttribute[];
}

export default function ProductAccordion({ description, attributes }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string>("beschreibung");
  const t = useTranslations("productTabs");

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  const sections: AccordionSection[] = [];

  // Beschreibung
  if (description) {
    sections.push({
      id: "beschreibung",
      title: t("description"),
      content: (
        <div
          className="prose prose-sm prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ),
    });
  }

  // Zusätzliche Informationen — attribute table (deduplicated)
  const visibleAttrs = attributes.filter((a) => a.visible);
  if (visibleAttrs.length > 0) {
    // Merge attributes with the same name (WC sometimes duplicates them)
    const mergedMap = new Map<string, string[]>();
    for (const attr of visibleAttrs) {
      const existing = mergedMap.get(attr.name) || [];
      for (const opt of attr.options) {
        if (!existing.includes(opt)) existing.push(opt);
      }
      mergedMap.set(attr.name, existing);
    }
    const merged = [...mergedMap.entries()];

    sections.push({
      id: "zusatzinfo",
      title: t("additionalInfo"),
      content: (
        <table className="w-full text-sm">
          <tbody>
            {merged.map(([name, options], i) => (
                <tr
                  key={name}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-3 font-medium text-gray-700 w-1/3">
                    {name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {options.join(", ")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ),
    });
  }

  // Versand & Rückgabe
  sections.push({
    id: "versand",
    title: t("shippingReturn"),
    content: (
      <div className="text-sm text-gray-600 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-lg">{"\uD83D\uDE9A"}</span>
          <div>
            <p className="font-medium text-gray-900">{t("freeShipping")}</p>
            <p>{t("freeShippingDesc")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">{"\u21A9\uFE0F"}</span>
          <div>
            <p className="font-medium text-gray-900">{t("returnPolicy")}</p>
            <p>{t("returnPolicyDesc")}</p>
          </div>
        </div>
      </div>
    ),
  });

  return (
    <div className="border-t border-gray-200 mt-8">
      {sections.map((section) => (
        <div key={section.id} className="border-b border-gray-200">
          <button
            onClick={() => toggle(section.id)}
            className="flex items-center justify-between w-full py-4 text-left"
          >
            <span className="text-base font-semibold text-gray-900">
              {section.title}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openSection === section.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {openSection === section.id && (
            <div className="pb-5">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
