import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi, spacesApi } from '../services/api';
import { 
  Car, Calendar, DollarSign, TrendingUp, 
  CheckCircle, XCircle, Clock, Loader, Plus 
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpaces: 0,
    availableSpaces: 0,
    totalBookings: 0,
    activeBookings: 0,
  });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, spacesStatsRes, bookingsStatsRes] = await Promise.all([
        bookingsApi.getSpaceOwnerBookings(0, 10),
        spacesApi.getOwnerStats().catch(() => ({ data: { totalSpaces: 0, availableSpaces: 0 } })),
        bookingsApi.getOwnerStats().catch(() => ({ data: { totalBookings: 0, activeBookings: 0 } })),
      ]);

      const bookingsData = bookingsRes.data;
      setRecentBookings(bookingsData?.content || []);

      setStats({
        totalSpaces: spacesStatsRes.data.totalSpaces || 0,
        availableSpaces: spacesStatsRes.data.availableSpaces || 0,
        totalBookings: bookingsStatsRes.data.totalBookings || bookingsData.totalElements || 0,
        activeBookings: bookingsStatsRes.data.activeBookings || 0,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (id) => {
    setActionLoading(id);
    try {
      await bookingsApi.confirm(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    setActionLoading(id);
    try {
      await bookingsApi.cancel(id, 'Cancelled by owner');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteBooking = async (id) => {
    setActionLoading(id);
    try {
      await bookingsApi.complete(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete booking');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your parking spaces and bookings</p>
        </div>
        <Link to="/create-space" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Space
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Spaces</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSpaces}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-3xl font-bold text-green-600">{stats.availableSpaces}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Bookings</p>
              <p className="text-3xl font-bold text-orange-600">{stats.activeBookings}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/my-spaces"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Car className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Manage Spaces</h3>
            <p className="text-sm text-gray-500">View and edit your parking spaces</p>
          </div>
        </Link>

        <Link
          to="/create-space"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Plus className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">List New Space</h3>
            <p className="text-sm text-gray-500">Add a new parking space for rent</p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No bookings yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{booking.parkingSpaceTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Renter: {booking.renterName} ({booking.renterEmail})
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(booking.startTime), 'MMM d, h:mm a')} - {format(new Date(booking.endTime), 'MMM d, h:mm a')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-primary-600">
                      ₹{booking.totalAmount}
                    </span>

                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          title="Confirm"
                        >
                          {actionLoading === booking.id ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Cancel"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCompleteBooking(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="btn-secondary text-sm disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          'Complete'
                        )}
                      </button>
                    )}

                    {booking.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleCompleteBooking(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="btn-primary text-sm disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          'Complete'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
