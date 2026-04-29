import { mockProducts } from "../data/mockProducts";
import type { Product } from "../types";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProducts(): Promise<Product[]> {
  await sleep(650);
  return mockProducts;
}

