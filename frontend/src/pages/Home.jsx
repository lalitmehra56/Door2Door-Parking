import { Link } from 'react-router-dom';
import { ArrowRight, Search, Shield, Clock, CreditCard, MapPin, Star, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi, spacesApi } from '../services/api';
import SpaceCard from '../components/SpaceCard';

export default function Home() {
  const [searchLocation, setSearchLocation] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [featuredSpaces, setFeaturedSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      navigate(`/spaces?search=${encodeURIComponent(searchLocation)}`);
    } else {
      navigate('/spaces');
    }
  };

  const handleBecomeOwner = async () => {
    if (!confirm('Would you like to upgrade your account to become a space owner? This will allow you to list parking spaces for rent.')) {
      return;
    }

    setIsUpgrading(true);
    try {
      await usersApi.becomeOwner();

      if (user) {
        const updatedUser = { ...user, role: 'SPACE_OWNER' };
        updateUser(updatedUser);
      }

      alert('Success! Your account has been upgraded. You can now list parking spaces.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upgrade account. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const isRegularUser = isAuthenticated && user?.role === 'USER';
  const isOwner = isAuthenticated && (user?.role === 'SPACE_OWNER' || user?.role === 'ADMIN');
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  // Load featured spaces
  useEffect(() => {
    const loadFeaturedSpaces = async () => {
      setLoadingSpaces(true);
      try {
        const response = await spacesApi.getAvailable(0, 6); // Get first 6 spaces
        setFeaturedSpaces(response.data.content);
      } catch (err) {
        console.error('Failed to load featured spaces:', err);
      } finally {
        setLoadingSpaces(false);
      }
    };
    
    loadFeaturedSpaces();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Find Your Perfect Parking Space
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-7">
                Rent parking spaces by the hour, day, or month. Safe, convenient, and affordable.
              </p>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur rounded-2xl p-2 shadow-2xl max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter location, city, or zip code..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button type="submit" className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link to="/spaces" className="btn-outline inline-flex items-center justify-center gap-2">
                  Browse Spaces
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {!isAuthenticated && (
                  <Link to="/login" className="btn-secondary inline-flex items-center justify-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              {!isAuthenticated ? (
                <div className="max-w-md mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 text-gray-900 border border-white/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">One account. All features.</h3>
                      <p className="text-sm text-gray-600">Sign in once — we route you automatically.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link to="/login" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3">
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/register" className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3">
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Users</p>
                      <p className="text-sm font-semibold">Book</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Owners</p>
                      <p className="text-sm font-semibold">List</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Admins</p>
                      <p className="text-sm font-semibold">Review</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 text-gray-900 border border-white/30">
                  <h3 className="text-lg font-semibold mb-1">Welcome back{user?.fullName ? `, ${user.fullName}` : ''}.</h3>
                  <p className="text-sm text-gray-600 mb-5">Quick actions based on your role.</p>

                  <div className="grid gap-3">
                    {isAdmin && (
                      <Link to="/admin/approvals" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3">
                        Pending approvals
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}

                    {isOwner && !isAdmin && (
                      <>
                        <Link to="/dashboard" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3">
                          Go to dashboard
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/create-space" className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3">
                          List a space
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    )}

                    {!isOwner && !isAdmin && (
                      <>
                        <Link to="/spaces" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3">
                          Find parking
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/my-bookings" className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3">
                          My bookings
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Become Owner Banner - Only shown to authenticated regular users */}
      {isRegularUser && (
        <section className="py-8 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Have a parking space to rent?</h3>
                <p className="text-orange-100">
                  Upgrade your account to become a space owner and start earning income today!
                </p>
              </div>
              <button
                onClick={handleBecomeOwner}
                disabled={isUpgrading}
                className="bg-white text-orange-600 font-semibold py-3 px-8 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isUpgrading ? 'Upgrading...' : 'Become a Space Owner'}
              </button>
            </div>
          </div>
        </section>
      )}


      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Door to Door Parking?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make parking simple, safe, and affordable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find available parking spaces near your destination with our powerful search.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Many spaces feature security cameras and 24/7 monitoring for your peace of mind.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Hours</h3>
              <p className="text-gray-600">
                Book parking by the hour, day, or month to suit your needs.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Payments</h3>
              <p className="text-gray-600">
                Secure and hassle-free payment options for all your bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Parking Spaces</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover available parking spaces in popular locations
            </p>
          </div>

          {loadingSpaces ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : featuredSpaces.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/spaces"
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  View All Spaces
                  <Search className="h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No parking spaces available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search</h3>
                <p className="text-gray-600">
                  Enter your desired location and browse available parking spaces in that area.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Book</h3>
                <p className="text-gray-600">
                  Select your preferred space, choose your dates and times, and confirm your booking.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Park</h3>
                <p className="text-gray-600">
                  Arrive at your booked space and park with confidence. It's that simple!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only shown to non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-16 lg:py-24 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Have a Parking Space to Rent?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Turn your unused parking space into income. List your space and start earning today!
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Star className="h-5 w-5" />
              Sign in to List Your Space
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Door to Door Parking</h3>
              <p className="text-sm">
                Making parking simple and accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/spaces" className="hover:text-white transition-colors">Find Parking</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">List Your Space</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Door to Door Parking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
