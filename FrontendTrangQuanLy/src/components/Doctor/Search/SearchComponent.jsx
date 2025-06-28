import { Input } from 'antd';
import { useState, useRef } from 'react';

const { Search } = Input;

const SearchComponent = ({ onSearch, placeholder }) => {
    const [searchValue, setSearchValue] = useState('');
    const searchTimeout = useRef(null);

    const handleSearchChange = (value) => {
        setSearchValue(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            onSearch(value);
        }, 300);
    };

    return (
        <Search
            placeholder={placeholder}
            onSearch={onSearch}
            enterButton
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
                width: '100%',            
            }}
        />
    );
};

export default SearchComponent;
