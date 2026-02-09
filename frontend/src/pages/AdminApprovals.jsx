import { useState, useEffect } from 'react';
import { spacesApi } from '../services/api';
import {
  CheckCircle, XCircle, AlertCircle, Loader, MapPin,
  Image, FileText, ExternalLink, Info, User, Phone, Mail
} from 'lucide-react';

export default function AdminApprovals() {
  const [pendingSpaces, setPendingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [infoRequest, setInfoRequest] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    fetchPendingSpaces();
  }, [currentPage]);

  const fetchPendingSpaces = async () => {
    setLoading(true);
    try {
      const response = await spacesApi.getPendingApprovals(currentPage);
      const data = response.data;
      setPendingSpaces(data?.content || []);
      setTotalPages(data?.totalPages ?? 0);
    } catch (err) {
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await spacesApi.approveSpace(id, 'Approved - All documents verified');
      fetchPendingSpaces();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve space');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedSpace || !rejectReason.trim()) return;

    setActionLoading(selectedSpace.id);
    try {
      await spacesApi.rejectSpace(selectedSpace.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedSpace(null);
      fetchPendingSpaces();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject space');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestInfo = async () => {
    if (!selectedSpace || !infoRequest.trim()) return;

    setActionLoading(selectedSpace.id);
    try {
      await spacesApi.requestMoreInfo(selectedSpace.id, infoRequest);
      setShowInfoModal(false);
      setInfoRequest('');
      setSelectedSpace(null);
      fetchPendingSpaces();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send info request');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && pendingSpaces.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
        <p className="text-gray-600">Review and approve new parking space listings</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {pendingSpaces.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingSpaces.map((space) => (
            <div key={space.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Space Image */}
                  <div className="lg:w-64 flex-shrink-0">
                    {space.imageUrl ? (
                      <img
                        src={space.imageUrl}
                        alt={space.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Space Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{space.title}</h3>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{space.address}, {space.city}, {space.state} {space.zipCode}</span>
                    </div>

                    {space.description && (
                      <p className="text-gray-600 text-sm mb-4">{space.description}</p>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Hourly Rate</p>
                        <p className="font-semibold text-primary-600">${space.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Space Type</p>
                        <p className="font-medium">{space.spaceType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vehicle Type</p>
                        <p className="font-medium">{space.vehicleType}</p>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Owner Information</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{space.ownerName}</span>
                        </div>
                        {space.ownerEmail && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{space.ownerEmail}</span>
                          </div>
                        )}
                        {space.ownerPhone && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{space.ownerPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Verification Documents
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {space.ownershipDocumentUrl ? (
                          <a
                            href={space.ownershipDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Ownership Doc
                          </a>
                        ) : (
                          <span className="text-sm text-red-500">No ownership doc</span>
                        )}
                        {space.idProofUrl ? (
                          <a
                            href={space.idProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            ID Proof
                          </a>
                        ) : (
                          <span className="text-sm text-red-500">No ID proof</span>
                        )}
                        {space.addressProofUrl && (
                          <a
                            href={space.addressProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Address Proof
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:w-48 flex lg:flex-col gap-2">
                    <button
                      onClick={() => handleApprove(space.id)}
                      disabled={actionLoading === space.id}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === space.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSpace(space);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading === space.id}
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSpace(space);
                        setShowInfoModal(true);
                      }}
                      disabled={actionLoading === space.id}
                      className="flex-1 bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Info className="h-4 w-4" />
                      Need Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSpace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Space</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedSpace.title}".
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="input-field mb-4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedSpace(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === selectedSpace.id}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedSpace.id ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Info Modal */}
      {showInfoModal && selectedSpace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request More Information</h3>
            <p className="text-gray-600 mb-4">
              What additional information do you need from the owner of "{selectedSpace.title}"?
            </p>
            <textarea
              value={infoRequest}
              onChange={(e) => setInfoRequest(e.target.value)}
              rows={3}
              className="input-field mb-4"
              placeholder="E.g., Please provide clearer images of the parking space..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  setInfoRequest('');
                  setSelectedSpace(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInfo}
                disabled={!infoRequest.trim() || actionLoading === selectedSpace.id}
                className="flex-1 bg-orange-600 text-white hover:bg-orange-700 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedSpace.id ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
