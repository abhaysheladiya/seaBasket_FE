import ProductDetailsPage from "./components/ProductsDetailsPage";

type PageProps = {
  params: { slug: string };
};

const ProductDetail = async ({ params }: PageProps) => {
  const { slug } = await params;
  return <ProductDetailsPage slug={slug} />;
};

export default ProductDetail;
