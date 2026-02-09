import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spacesApi } from '../services/api';
import { 
  Car, MapPin, Plus, Edit, Trash2, 
  Loader, AlertCircle, CheckCircle, XCircle, Clock, Info 
} from 'lucide-react';

export default function MySpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const response = await spacesApi.getMySpaces();
      setSpaces(response.data);
    } catch (err) {
      setError('Failed to load your spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this parking space?')) return;
    
    setDeletingId(id);
    try {
      await spacesApi.delete(id);
      setSpaces(spaces.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete space');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await spacesApi.updateStatus(id, status);
      fetchSpaces();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      AVAILABLE: 'bg-green-100 text-green-800',
      OCCUPIED: 'bg-red-100 text-red-800',
      RESERVED: 'bg-yellow-100 text-yellow-800',
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getSpaceTypeLabel = (type) => {
    const labels = {
      STANDARD: 'Standard',
      COMPACT: 'Compact',
      LARGE: 'Large',
      HANDICAP: 'Handicap',
      MOTORCYCLE: 'Motorcycle',
      EV_CHARGING: 'EV Charging',
    };
    return labels[type] || type;
  };

  const getApprovalBadge = (status) => {
    const styles = {
      PENDING: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
      APPROVED: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
      REJECTED: { bg: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
      NEEDS_INFO: { bg: 'bg-orange-100 text-orange-800', icon: <Info className="h-3 w-3" /> },
    };
    return styles[status] || styles.PENDING;
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
          <h1 className="text-3xl font-bold text-gray-900">My Parking Spaces</h1>
          <p className="text-gray-600">Manage your listed parking spaces</p>
        </div>
        <Link to="/create-space" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Space
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {spaces.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Spaces Listed</h2>
          <p className="text-gray-600 mb-4">
            You haven't listed any parking spaces yet.
          </p>
          <Link to="/create-space" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            List Your First Space
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div key={space.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-primary-400 to-primary-600">
                {space.imageUrl ? (
                  <img
                    src={space.imageUrl}
                    alt={space.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-16 w-16 text-white/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(space.status)}`}>
                    {space.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {space.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{space.address}, {space.city}</span>
                </div>

                {/* Approval Status */}
                <div className="mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getApprovalBadge(space.approvalStatus).bg}`}>
                    {getApprovalBadge(space.approvalStatus).icon}
                    {space.approvalStatus === 'PENDING' ? 'Pending Approval' :
                     space.approvalStatus === 'APPROVED' ? 'Approved' :
                     space.approvalStatus === 'REJECTED' ? 'Rejected' : 'Info Needed'}
                  </span>
                </div>

                {/* Admin Notes if rejected or needs info */}
                {space.adminNotes && (space.approvalStatus === 'REJECTED' || space.approvalStatus === 'NEEDS_INFO') && (
                  <div className={`mb-3 p-2 rounded text-xs ${
                    space.approvalStatus === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    <strong>Admin:</strong> {space.adminNotes}
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {getSpaceTypeLabel(space.spaceType)}
                  </span>
                  <div>
                    <span className="text-lg font-bold text-primary-600">₹{space.hourlyRate}</span>
                    <span className="text-gray-500 text-sm">/hr</span>
                  </div>
                </div>

                {/* Status Toggle - only show if approved */}
                {space.approvalStatus === 'APPROVED' && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">Status:</span>
                    <select
                      value={space.status}
                      onChange={(e) => handleStatusChange(space.id, e.target.value)}
                      disabled={updatingId === space.id}
                      className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    {updatingId === space.id && (
                      <Loader className="h-4 w-4 text-primary-600 animate-spin" />
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/edit-space/${space.id}`}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(space.id)}
                    disabled={deletingId === space.id}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {deletingId === space.id ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
