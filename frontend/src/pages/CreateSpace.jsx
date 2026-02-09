import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { spacesApi } from '../services/api';
import { 
  Car, MapPin, DollarSign, Save, 
  Loader, AlertCircle, ChevronLeft, Image, FileText, Info 
} from 'lucide-react';

export default function CreateSpace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    hourlyRate: '',
    dailyRate: '',
    monthlyRate: '',
    spaceType: 'STANDARD',
    vehicleType: 'CAR',
    covered: false,
    hasElectricCharging: false,
    hasSecurityCamera: false,
    is24Hours: false,
    imageUrl: '',
  });

  useEffect(() => {
    if (isEditing) {
      fetchSpace();
    }
  }, [id]);

  const fetchSpace = async () => {
    if (!id) return;

    try {
      const response = await spacesApi.getById(parseInt(id));
      const space = response.data;
      setFormData({
        title: space.title,
        description: space.description || '',
        address: space.address,
        city: space.city || '',
        state: space.state || '',
        zipCode: space.zipCode || '',
        latitude: space.latitude?.toString() || '',
        longitude: space.longitude?.toString() || '',
        hourlyRate: space.hourlyRate.toString(),
        dailyRate: space.dailyRate?.toString() || '',
        monthlyRate: space.monthlyRate?.toString() || '',
        spaceType: space.spaceType,
        vehicleType: space.vehicleType,
        covered: space.covered,
        hasElectricCharging: space.hasElectricCharging,
        hasSecurityCamera: space.hasSecurityCamera,
        is24Hours: space.is24Hours,
        imageUrl: space.imageUrl || '',
      });
      if (space.imageUrl) {
        setImagePreview(space.imageUrl);
      }
    } catch (err) {
      setError('Failed to load space details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('Image file is too large. Please choose an image smaller than 5MB.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      setError(''); // Clear any previous errors
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result ? String(reader.result) : '');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate image
    if (!isEditing && !imageFile) {
      setError('Please upload an image of your parking space');
      return;
    }
    
    setLoading(true);

    try {
      // Convert image to base64
      let mainImageBase64 = formData.imageUrl;
      
      if (imageFile) {
        mainImageBase64 = await fileToBase64(imageFile);
      }

      const data = {
        title: formData.title,
        description: formData.description || undefined,
        address: formData.address,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        hourlyRate: parseFloat(formData.hourlyRate),
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : undefined,
        monthlyRate: formData.monthlyRate ? parseFloat(formData.monthlyRate) : undefined,
        spaceType: formData.spaceType,
        vehicleType: formData.vehicleType,
        covered: formData.covered,
        hasElectricCharging: formData.hasElectricCharging,
        hasSecurityCamera: formData.hasSecurityCamera,
        is24Hours: formData.is24Hours,
        imageUrl: mainImageBase64,
      };

      console.log('Submitting parking space data');
      console.log('Image size:', mainImageBase64 ? `${(mainImageBase64.length / 1024).toFixed(2)} KB` : 'No image');
      console.log('Data:', { ...data, imageUrl: mainImageBase64 ? `<base64 image ${(mainImageBase64.length / 1024).toFixed(2)} KB>` : 'none' });

      if (isEditing) {
        await spacesApi.update(parseInt(id), data);
      } else {
        await spacesApi.create(data);
      }

      navigate('/my-spaces');
    } catch (err) {
      console.error('Error creating space:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || `Failed to ${isEditing ? 'update' : 'create'} space`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result ? String(reader.result) : '');
      reader.onerror = (error) => reject(error);
    });
  };

  const spaceTypes = [
    { value: 'STANDARD', label: 'Standard' },
    { value: 'COMPACT', label: 'Compact' },
    { value: 'LARGE', label: 'Large' },
    { value: 'HANDICAP', label: 'Handicap Accessible' },
    { value: 'MOTORCYCLE', label: 'Motorcycle' },
    { value: 'EV_CHARGING', label: 'EV Charging' },
  ];

  const vehicleTypes = [
    { value: 'CAR', label: 'Car' },
    { value: 'MOTORCYCLE', label: 'Motorcycle' },
    { value: 'TRUCK', label: 'Truck' },
    { value: 'SUV', label: 'SUV' },
    { value: 'VAN', label: 'Van' },
    { value: 'ANY', label: 'Any Vehicle' },
  ];

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Parking Space' : 'List New Parking Space'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Update your parking space details' : 'Fill in the details to list your parking space'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-primary-600" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Covered Parking near Downtown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Describe your parking space..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Type
                </label>
                <select
                  name="spaceType"
                  value={formData.spaceType}
                  onChange={handleChange}
                  className="input-field"
                >
                  {spaceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suitable For
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="input-field"
                >
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Location
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary-600" />
            Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate ($) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="5.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate ($)
              </label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field"
                placeholder="25.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rate ($)
              </label>
              <input
                type="number"
                name="monthlyRate"
                value={formData.monthlyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field"
                placeholder="200.00"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="covered"
                checked={formData.covered}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Covered / Garage</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="is24Hours"
                checked={formData.is24Hours}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">24/7 Access</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="hasSecurityCamera"
                checked={formData.hasSecurityCamera}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Security Camera</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="hasElectricCharging"
                checked={formData.hasElectricCharging}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">EV Charging</span>
            </label>
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            GPS Coordinates (Optional)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="any"
                className="input-field"
                placeholder="e.g., 18.5204"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="any"
                className="input-field"
                placeholder="e.g., 73.8567"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You can get coordinates from Google Maps by right-clicking on the location.
          </p>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="h-5 w-5 text-primary-600" />
            Parking Space Images *
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Parking Space Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload a photo of your parking space.
                Supported formats: JPG, PNG, WebP
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Selected File */}
            {imageFile && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Image:</p>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-primary-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">{imageFile.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(imageFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEditing ? 'Update Space' : 'Create Space'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
