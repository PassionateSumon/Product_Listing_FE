import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../utils/AxiosInstance";
import toast from "react-hot-toast";
import { Product, SidebarProps } from "../../interfaces/ProductInterface";
import { v4 as uuidv4 } from 'uuid';

const Sidebar = ({ open, onClose, product, mode, onSave }: SidebarProps) => {
  const [formData, setFormData] = useState<Product>({
    id: 0,
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    rating: { rate: 0, count: 0 },
  });

  useEffect(() => {
    if (mode === "add") {
      setFormData({
        id: Number(uuidv4()),
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
      });
    } else if (product) {
      setFormData(product);
    }
  }, [product, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (mode === "edit" && product) {
        if(formData.price < 0) {
          toast.error("Price cannot be negative or lead zero!");
          return;
        }
        await axiosInstance.put(`/products/${product.id}`, formData);
        toast.success("Product updated successfully!");
        onSave?.({...formData, price: formData.price});
      } else if (mode === "add") {
        if(formData.price < 0) {
          toast.error("Price cannot be negative or lead zero!");
          return;
        }
        const res: any = await axiosInstance.post("/products", formData);
        toast.success("Product added successfully!");
        onSave?.(res);
      }
      onClose();
    } catch (error) {
      toast.error(`Error ${mode === "edit" ? "updating" : "adding"} product!`);
      console.error(error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "400px" },
          padding: 2,
          bgcolor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold text-gray-800">
          {mode === "view"
            ? "Product Details"
            : mode === "edit"
            ? "Edit Product"
            : "Add Product"}
        </Typography>
        <IconButton
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider className="mb-4" />

      {(mode === "add" || mode === "edit") && <img src={formData.image} alt="ALt image" height="100px" width="100px" className="m-auto" />}  
      <Box className="space-y-4">
        {(mode === "edit" || mode === "add") && (
          <div>
            <Typography
              variant="subtitle1"
              className="font-semibold text-gray-700"
            >
              Image URL
            </Typography>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {mode === "view" && formData?.image && (
          <img
            src={formData?.image}
            alt={formData?.title}
            className="w-full h-48 object-contain rounded-lg shadow-sm"
          />
        )}
        <Box className="space-y-3">
          <div>
            <Typography
              variant="subtitle1"
              className="font-semibold text-gray-700"
            >
              Title
            </Typography>
            {mode === "view" ? (
              <Typography className="text-gray-600">
                {formData?.title}
              </Typography>
            ) : (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={mode === "edit"}
              />
            )}
          </div>
          <div>
            <Typography
              variant="subtitle1"
              className="font-semibold text-gray-700"
            >
              Price
            </Typography>
            {mode === "view" ? (
              <Typography className="text-gray-600">
                ${formData?.price.toFixed(2)}
              </Typography>
            ) : (
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                min={0}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          <div>
            <Typography
              variant="subtitle1"
              className="font-semibold text-gray-700"
            >
              Category
            </Typography>
            {mode === "view" ? (
              <Typography className="text-gray-600">
                {formData?.category}
              </Typography>
            ) : (
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={mode === "edit"}
              />
            )}
          </div>
          <div>
            <Typography
              variant="subtitle1"
              className="font-semibold text-gray-700"
            >
              Description
            </Typography>
            {mode === "view" ? (
              <Typography className="text-gray-600">
                {formData?.description}
              </Typography>
            ) : (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            )}
          </div>
          {mode === "view" && (
            <div>
              <Typography
                variant="subtitle1"
                className="font-semibold text-gray-700"
              >
                Rating
              </Typography>
              <Typography className="text-gray-600">
                {formData?.rating?.rate} ({formData?.rating?.count} reviews)
              </Typography>
            </div>
          )}
        </Box>
        {(mode === "edit" || mode === "add") && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="w-full py-2"
          >
            {mode === "edit" ? "Save Changes" : "Add Product"}
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
