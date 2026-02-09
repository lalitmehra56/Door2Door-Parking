import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spacesApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Clock, Shield, Zap, Car, User, Calendar,
  ChevronLeft, CheckCircle, AlertCircle, Loader, Download
} from 'lucide-react';
import { format, addHours } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

export default function SpaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [bookingData, setBookingData] = useState({
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
    vehiclePlateNumber: '',
    vehicleType: 'CAR',
    notes: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchSpace();
  }, [id]);

  const fetchSpace = async () => {
    if (!id) return;
    
    try {
      const response = await spacesApi.getById(parseInt(id));
      setSpace(response.data);
    } catch (err) {
      setError('Failed to load parking space');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!space) return 0;
    
    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);
    const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
    
    return (hours * space.hourlyRate).toFixed(2);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingError('');
    setIsBooking(true);

    try {
      const response = await bookingsApi.create({
        parkingSpaceId: parseInt(id),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        vehiclePlateNumber: bookingData.vehiclePlateNumber,
        vehicleType: bookingData.vehicleType,
        notes: bookingData.notes,
      });
      
      setBookingResponse(response.data);
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  const getSpaceTypeLabel = (type) => {
    const labels = {
      STANDARD: 'Standard',
      COMPACT: 'Compact',
      LARGE: 'Large',
      HANDICAP: 'Handicap Accessible',
      MOTORCYCLE: 'Motorcycle',
      EV_CHARGING: 'EV Charging',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Space not found'}</p>
          <button onClick={() => navigate('/spaces')} className="btn-primary">
            Back to Spaces
          </button>
        </div>
      </div>
    );
  }

  const downloadQRCode = () => {
    const svg = document.getElementById('booking-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `booking-${bookingResponse?.id || 'qrcode'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (bookingSuccess && bookingResponse) {
    const qrData = JSON.stringify({
      bookingId: bookingResponse.id,
      parkingSpace: space?.title,
      location: `${space?.address}, ${space?.city}`,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      vehiclePlate: bookingData.vehiclePlateNumber,
      totalAmount: calculateTotal(),
      currency: 'INR'
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">
              Your parking space has been reserved. Show this QR code at the parking entrance.
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium text-gray-900">#{bookingResponse.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium text-gray-900">{space?.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(bookingData.startTime), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Time:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(bookingData.endTime), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
              {bookingData.vehiclePlateNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-gray-900">{bookingData.vehiclePlateNumber}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600 font-semibold">Total Amount:</span>
                <span className="font-bold text-primary-600 text-lg">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">Your Booking QR Code</h3>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCodeSVG
                  id="booking-qr-code"
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Scan this code at the parking entrance to verify your booking
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download QR Code
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="btn-primary w-full"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/spaces')}
              className="btn-secondary w-full"
            >
              Find More Spaces
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl h-64 md:h-96 flex items-center justify-center">
            {space.imageUrl ? (
              <img
                src={space.imageUrl}
                alt={space.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Car className="h-24 w-24 text-white/50" />
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{space.title}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{space.address}, {space.city}, {space.state} {space.zipCode}</span>
                </div>
              </div>
              <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">
                {getSpaceTypeLabel(space.spaceType)}
              </span>
            </div>

            {space.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{space.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {space.is24Hours && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <span>24/7 Access</span>
                  </div>
                )}
                {space.hasSecurityCamera && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <span>Security Camera</span>
                  </div>
                )}
                {space.hasElectricCharging && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Zap className="h-5 w-5 text-primary-600" />
                    <span>EV Charging</span>
                  </div>
                )}
                {space.covered && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                    <span>Covered</span>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Listed by</p>
                  <p className="font-medium text-gray-900">{space.ownerName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <span className="text-3xl font-bold text-primary-600">₹{space.hourlyRate}</span>
              <span className="text-gray-500">/hour</span>
              {space.dailyRate && (
                <p className="text-gray-600 mt-1">
                  or ₹{space.dailyRate}/day
                </p>
              )}
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Plate Number
                </label>
                <input
                  type="text"
                  value={bookingData.vehiclePlateNumber}
                  onChange={(e) => setBookingData({ ...bookingData, vehiclePlateNumber: e.target.value })}
                  className="input-field"
                  placeholder="ABC-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={bookingData.vehicleType}
                  onChange={(e) => setBookingData({ ...bookingData, vehicleType: e.target.value })}
                  className="input-field"
                >
                  <option value="CAR">Car</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="SUV">SUV</option>
                  <option value="TRUCK">Truck</option>
                  <option value="VAN">Van</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{calculateTotal()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBooking || space.status !== 'AVAILABLE'}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {isBooking ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin" />
                    Booking...
                  </span>
                ) : !isAuthenticated ? (
                  'Login to Book'
                ) : space.status !== 'AVAILABLE' ? (
                  'Not Available'
                ) : (
                  'Book Now'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
