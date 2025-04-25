import AllFunctionalProducts from "../components/AllFunctionalProducts";

const ProductPage = () => {
  return (
    <div className="flex flex-col items-center justify-evenly min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold">Products Listing </h1>
      <AllFunctionalProducts />
    </div>
  );
};

export default ProductPage;
