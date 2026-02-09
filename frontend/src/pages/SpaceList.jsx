import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spacesApi } from '../services/api';
import SpaceCard from '../components/SpaceCard';
import { Search, Filter, X, Loader } from 'lucide-react';

export default function SpaceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    spaceType: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSpaces();
  }, [currentPage, searchParams]);

  const fetchSpaces = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      const search = searchParams.get('search');

      if (search) {
        response = await spacesApi.search(search, currentPage);
      } else {
        response = await spacesApi.getAvailable(currentPage);
      }

      const data = response.data;
      setSpaces(data?.content || []);
      setTotalPages(data?.totalPages ?? 0);
    } catch (err) {
      setError('Failed to load parking spaces');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterByPrice = async () => {
    if (filters.minPrice && filters.maxPrice) {
      setLoading(true);
      try {
        const response = await spacesApi.filterByPrice(
          parseFloat(filters.minPrice),
          parseFloat(filters.maxPrice),
          0
        );
        const data = response.data;
        setSpaces(data?.content || []);
        setTotalPages(data?.totalPages ?? 0);
        setCurrentPage(0);
      } catch (err) {
        setError('Failed to filter spaces');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterByType = async (type) => {
    setLoading(true);
    try {
      const response = await spacesApi.filterByType(type, 0);
      const data = response.data;
      setSpaces(data?.content || []);
      setTotalPages(data?.totalPages ?? 0);
      setCurrentPage(0);
      setFilters({ ...filters, spaceType: type });
    } catch (err) {
      setError('Failed to filter spaces');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ spaceType: '', minPrice: '', maxPrice: '' });
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(0);
    fetchSpaces();
  };

  const spaceTypes = [
    { value: 'STANDARD', label: 'Standard' },
    { value: 'COMPACT', label: 'Compact' },
    { value: 'LARGE', label: 'Large' },
    { value: 'HANDICAP', label: 'Handicap' },
    { value: 'MOTORCYCLE', label: 'Motorcycle' },
    { value: 'EV_CHARGING', label: 'EV Charging' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Parking Spaces</h1>
        <p className="text-gray-600">Browse available parking spaces in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, city, or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </form>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Type
                </label>
                <select
                  value={filters.spaceType}
                  onChange={(e) => handleFilterByType(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {spaceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ($/hr)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ($/hr)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field"
                  placeholder="100"
                  min="0"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={handleFilterByPrice}
                  className="btn-primary flex-1"
                  disabled={!filters.minPrice || !filters.maxPrice}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchSpaces} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-600 text-lg">No parking spaces found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary mt-4">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
