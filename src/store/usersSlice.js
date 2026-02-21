import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchQuery: "",
    sortConfig: { field: "name", direction: "asc" },
  },
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: Date.now(),
        company: { name: action.payload.company || "N/A" },
        address: {
          street: action.payload.street || "",
          city: action.payload.city || "",
          zipcode: action.payload.zipcode || "",
        },
        phone: action.payload.phone || "",
        website: action.payload.website || "",
        isLocal: true,
      };
      state.list.unshift(newUser);
    },
    updateUser: (state, action) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Keep locally added users at top, then append fetched
        const localUsers = state.list.filter((u) => u.isLocal);
        state.list = [...localUsers, ...action.payload];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser, setSearchQuery, setSortConfig } =
  usersSlice.actions;

// Selectors
export const selectFilteredSortedUsers = (state) => {
  const { list, searchQuery, sortConfig } = state.users;
  let filtered = list;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    let aVal = "";
    let bVal = "";
    if (sortConfig.field === "name") {
      aVal = a.name;
      bVal = b.name;
    } else if (sortConfig.field === "email") {
      aVal = a.email;
      bVal = b.email;
    } else if (sortConfig.field === "company") {
      aVal = a.company?.name || "";
      bVal = b.company?.name || "";
    }
    const cmp = aVal.localeCompare(bVal);
    return sortConfig.direction === "asc" ? cmp : -cmp;
  });

  return sorted;
};

export default usersSlice.reducer;
