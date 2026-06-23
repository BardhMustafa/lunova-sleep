import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder pricing in EUR cents — tiered by size. Edit freely in the admin.
const standardSizes = [
  { label: "90×200", price: 24900 },
  { label: "120×200", price: 29900 },
  { label: "160×200", price: 37900 },
  { label: "180×200", price: 42900 },
];

const products = [
  {
    slug: "lunova-horizontal",
    name: "Lunova Horizontal",
    tagline: "Calm, grounded, effortless.",
    description:
      "Clean horizontal channels give the Horizontal a quiet, architectural presence. Upholstered in a soft olive weave that warms a room without shouting — the kind of bed you stop noticing and simply rest in.",
    material: "Olive linen-blend upholstery · pocket-spring core",
    colorName: "Olive",
    colorHex: "#7A8B5C",
    images: ["/products/lunova-horizontal.svg"],
    sizes: standardSizes,
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "lunova-stripe",
    name: "Lunova Stripe",
    tagline: "Quietly confident.",
    description:
      "Vertical stripe tufting draws the eye upward for a taller, tailored headboard. A deep navy that feels considered and calm — designed to anchor a bedroom and last well beyond a trend.",
    material: "Deep-navy woven upholstery · pocket-spring core",
    colorName: "Navy",
    colorHex: "#2C3E5B",
    images: ["/products/lunova-stripe.svg"],
    sizes: standardSizes,
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "lunova-diagonal",
    name: "Lunova Diagonal",
    tagline: "Soft lines, warm light.",
    description:
      "A subtle diagonal pattern adds movement to an otherwise minimal frame. Wrapped in a warm sand tone, the Diagonal brings a gentle, sunlit softness to the room it sits in.",
    material: "Sand boucle-look upholstery · pocket-spring core",
    colorName: "Sand",
    colorHex: "#CDBBA0",
    images: ["/products/lunova-diagonal.svg"],
    sizes: standardSizes,
    featured: false,
    sortOrder: 3,
  },
  {
    slug: "lunova-line",
    name: "Lunova Line",
    tagline: "Minimal, modern, timeless.",
    description:
      "Slim vertical lines and a cool grey finish make the Line the most versatile of the collection. It slips into any palette and stays out of the way of good sleep.",
    material: "Stone-grey woven upholstery · pocket-spring core",
    colorName: "Stone Grey",
    colorHex: "#9AA0A4",
    images: ["/products/lunova-line.svg"],
    sizes: standardSizes,
    featured: true,
    sortOrder: 4,
  },
  {
    slug: "lunova-grid",
    name: "Lunova Grid",
    tagline: "Texture you can feel.",
    description:
      "A soft squared grid headboard with a warm clay tone — the most tactile piece in the collection. Cosy, characterful, and still beautifully simple.",
    material: "Clay textured upholstery · pocket-spring core",
    colorName: "Clay",
    colorHex: "#B98B73",
    images: ["/products/lunova-grid.svg"],
    sizes: standardSizes,
    featured: false,
    sortOrder: 5,
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        material: p.material,
        colorName: p.colorName,
        colorHex: p.colorHex,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        featured: p.featured,
        sortOrder: p.sortOrder,
      },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        material: p.material,
        colorName: p.colorName,
        colorHex: p.colorHex,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        featured: p.featured,
        active: true,
        sortOrder: p.sortOrder,
      },
    });
    console.log(`✓ seeded ${p.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
