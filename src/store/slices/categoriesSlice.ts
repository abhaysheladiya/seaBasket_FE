import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/src/lib/axios";

export type Category = {
  id: number;
  name: string;
  description: string;
};
type CategoriesApiResponse = {
  data: Category[];
  message: string;
};

type CategoriesState = {
  items: Category[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CategoriesState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: { categories: CategoriesState } }
>(
  "categories/fetchCategories",
  async () => {
    const response = await axiosInstance.get<CategoriesApiResponse>("/products/categories");
    return response.data.data;
  },
  {
    condition: (_, { getState }) => {
      const { items, isLoading } = getState().categories;
      if (isLoading || items.length > 0) return false;
      return true;
    },
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to load categories";
      });
  },
});

export default categoriesSlice.reducer;
