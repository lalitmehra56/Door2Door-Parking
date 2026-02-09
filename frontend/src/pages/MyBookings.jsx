import { useState, useEffect } from 'react';
import { bookingsApi } from '../services/api';
import { Calendar, MapPin, Clock, AlertCircle, Loader, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsApi.getMyBookings(currentPage);
      const data = response.data;
      setBookings(data?.content || []);
      setTotalPages(data?.totalPages ?? 0);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancellingId(id);
    try {
      await bookingsApi.cancel(id, 'Cancelled by user');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-orange-100 text-orange-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      REFUNDED: 'bg-blue-100 text-blue-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your parking reservations</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
          <p className="text-gray-600 mb-4">
            You haven't made any parking reservations yet.
          </p>
          <a href="/spaces" className="btn-primary inline-block">
            Find Parking
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {booking.parkingSpaceTitle}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{booking.parkingSpaceAddress}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Start</p>
                            <p className="font-medium text-gray-900">
                              {format(new Date(booking.startTime), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">End</p>
                            <p className="font-medium text-gray-900">
                              {format(new Date(booking.endTime), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {booking.vehiclePlateNumber && (
                        <p className="text-sm text-gray-600 mt-2">
                          Vehicle: {booking.vehiclePlateNumber} ({booking.vehicleType})
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      
                      <p className="text-2xl font-bold text-primary-600">
                        ₹{booking.totalAmount}
                      </p>

                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className={`px-6 py-2 text-sm flex items-center gap-2 ${
                  booking.status === 'COMPLETED' ? 'bg-gray-50' :
                  booking.status === 'CANCELLED' ? 'bg-red-50' :
                  booking.status === 'ACTIVE' ? 'bg-green-50' :
                  'bg-blue-50'
                }`}>
                  {booking.status === 'COMPLETED' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Booking completed</span>
                    </>
                  )}
                  {booking.status === 'CANCELLED' && (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Booking cancelled</span>
                    </>
                  )}
                  {booking.status === 'ACTIVE' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Currently active</span>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600">Confirmed - Ready to use</span>
                    </>
                  )}
                  {booking.status === 'PENDING' && (
                    <>
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600">Awaiting confirmation</span>
                    </>
                  )}
                </div>
              </div>
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
