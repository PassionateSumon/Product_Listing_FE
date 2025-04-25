import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import toast from "react-hot-toast";
import { Product } from "../interfaces/ProductInterface";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "./reusable/Sidebar";

const AllFunctionalProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sidebarMode, setSidebarMode] = useState<
    "view" | "edit" | "add" | null
  >(null);

  const fetchProducts = async () => {
    try {
      const response: any = await axiosInstance.get<Product[]>("/products");
      if (response) {
        toast.success("Products fetched successfully!");
        setProducts(response);
      }
    } catch (error) {
      toast.error("Error fetching products!");
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setSidebarMode("edit");
    setSidebarOpen(true);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const handleDelete = async (id: number) => {
    const res: any = axiosInstance.delete(`/products/${id}`);
    if (res) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setSidebarMode("view");
    setSidebarOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setSidebarMode("add");
    setSidebarOpen(true);
  };

  const handleRemoveSelected = async () => {
    if (selected.length === 0) {
      toast.error("No products selected!");
      return;
    }

    try {
      // console.log(selected);
      await Promise.all(
        selected.map((id) => axiosInstance.delete(`/products/${id}`))
      );
      toast.success("Selected products deleted successfully!");
      setSelected([]);
      setSelectAll(false);
      setProducts((prev) => prev.filter((p) => !selected.includes(p.id)));
    } catch (error) {
      toast.error("Error deleting products!");
      console.error(error);
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedProduct(null);
    setSidebarMode(null);
  };

  const handleSave = (newProduct: Product) => {
    console.log(newProduct);
    if (sidebarMode === "edit") {
      setProducts((prev) =>
        prev.map((p) => (p.id === newProduct.id ? newProduct : p))
      );
    } else if (sidebarMode === "add") {
      if (newProduct) {
        setProducts((prev) => [newProduct, ...prev]);
      }
      setSidebarOpen(false);
    }
  };

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Listing</h1>
        <div className="flex gap-4">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            className="hover:scale-105 transition-transform"
          >
            Add Product
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveSelected}
            disabled={selected.length === 0}
            className="hover:scale-105 transition-transform"
          >
            Remove Selected
          </Button>
        </div>
      </div>
      <div className="min-h-[300px] max-h-[calc(100vh-120px)] overflow-auto custom-scroll">
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(product?.id)}
                        onChange={() => handleSelect(product?.id)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-contain cursor-pointer"
                      />
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product?.rating?.rate} ({product?.rating?.count})
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(product)}
                          className="hover:scale-105 transition-transform"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(product.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleView(product)}
                          className="hover:scale-105 transition-transform"
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        product={selectedProduct}
        mode={sidebarMode}
        onSave={handleSave}
      />
    </div>
  );
};

export default AllFunctionalProducts;
