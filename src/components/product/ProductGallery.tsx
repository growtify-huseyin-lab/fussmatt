"use client";

import { useState } from "react";
import Image from "next/image";
import type { WCImage } from "@/types/woocommerce";

interface ProductGalleryProps {
  images: WCImage[];
  productName: string;
  onSale?: boolean;
}

export default function ProductGallery({ images, productName, onSale }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || null;

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
        {activeImage ? (
          <Image
            src={activeImage.src}
            alt={activeImage.alt || productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        {onSale && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            SALE
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-xl overflow-hidden transition-all ${
                index === activeIndex
                  ? "ring-2 ring-amber-500 ring-offset-1"
                  : "border border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
