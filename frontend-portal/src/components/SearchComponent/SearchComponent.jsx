import { Input } from 'antd';
import { useState, useRef } from 'react';
import { SearchOutlined } from "@ant-design/icons";

const SearchComponent = ({ onSearch, placeholder }) => {
  const [searchValue, setSearchValue] = useState('');
  const searchTimeout = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
  };

  const handleEnterSearch = () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    onSearch(searchValue.trim());
  };

  return (
    <Input
        placeholder={placeholder}
        size="large"
        value={searchValue}
        onChange={handleChange}
        onPressEnter={handleEnterSearch}
        prefix={<SearchOutlined style={{ color: "#999" }} />} // Icon đúng
        style={{
          borderRadius: "50px",
          paddingLeft: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      />
  );
};

export default SearchComponent;
