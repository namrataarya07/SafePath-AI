import { useState, useEffect, useRef } from "react";
import { MapPin, Target, X } from "lucide-react";

const LocationSearch = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  iconStyle,
}) => {
  const [query, setQuery] = useState(value?.name || value?.address || value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Update query when value prop changes
  useEffect(() => {
    if (value) {
      setQuery(value.name || value.address || value);
    }
  }, [value]);

  // Set a basic location on every query change to ensure parent has something
  useEffect(() => {
    if (query && query.length >= 1) {
      onChange({
        name: query,
        address: query,
        lat: 28.6139,
        lng: 77.2090
      });
    }
  }, [query, onChange]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Debounce
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/autocomplete?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (suggestion) => {
    setQuery(suggestion.name || suggestion.address);
    onChange(suggestion);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    onChange(null);
  };

  const handleInputBlur = () => {
    // When user blurs without selecting a suggestion, use the query as a fallback location
    if (query && query.length >= 2) {
      onChange({
        name: query,
        address: query,
        lat: null,
        lng: null
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-3 bg-[#030B18] rounded-xl p-4 border border-[#00E5FF]/6">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            iconStyle || "border-2 border-[#2AF598]"
          }`}
        >
          {Icon ? (
            <Icon className="w-4 h-4 text-[#2AF598]" />
          ) : (
            <div className="w-2 h-2 bg-[#2AF598] rounded-full" />
          )}
        </div>
        <div className="flex-1 relative">
          <label className="text-[#B6C2D2] text-xs block mb-1">{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            onBlur={handleInputBlur}
            className="bg-transparent text-white w-full text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#B6C2D2] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {Icon === Target && <Target className="w-6 h-6 text-[#B6C2D2]" />}
        {Icon === MapPin && <MapPin className="w-7 h-7 text-[#FF4D4D]" />}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#061121] border border-[#00E5FF]/20 rounded-xl overflow-hidden z-50 shadow-xl">
          {isLoading ? (
            <div className="p-4 text-center text-[#B6C2D2] text-sm">Loading...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-[#00E5FF]/10 transition-colors"
              >
                <div className="text-white font-medium text-sm">{suggestion.name}</div>
                <div className="text-[#B6C2D2] text-xs truncate">{suggestion.address}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
