"use client";

import React, { useState, useEffect } from "react";
import { IUser } from "@/src/types/IUser";

interface SearchFilterProps {
  users: IUser[];
  onFilter: (filteredUsers: IUser[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ users, onFilter }) => {
  const [search, setSearch] = useState<string>("");


  useEffect(() => {
    if (search === "") {
      onFilter(users); 
    } else {
      const filtered = users.filter(user =>
        Object.values(user).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      onFilter(filtered);
    }
  }, [search, users, onFilter]);



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search users"
      value={search}
      onChange={handleSearch}
      className="text-black w-full p-2 mb-4 border border-gray-300 rounded"
    />
  );
};

export default SearchFilter;