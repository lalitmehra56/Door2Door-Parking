import { Link } from 'react-router-dom';
import { MapPin, Clock, Shield, Zap, Car } from 'lucide-react';

export default function SpaceCard({ space }) {
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

  return (
    <Link to={`/spaces/${space.id}`} className="card group">
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
        {space.imageUrl ? (
          <img
            src={space.imageUrl}
            alt={space.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="h-20 w-20 text-white/50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-semibold px-2 py-1 rounded-full">
            {getSpaceTypeLabel(space.spaceType)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {space.title}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{space.address}, {space.city}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {space.is24Hours && (
            <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <Clock className="h-3 w-3 mr-1" />
              24/7
            </span>
          )}
          {space.hasSecurityCamera && (
            <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <Shield className="h-3 w-3 mr-1" />
              Security
            </span>
          )}
          {space.hasElectricCharging && (
            <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <Zap className="h-3 w-3 mr-1" />
              EV Charging
            </span>
          )}
          {space.covered && (
            <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Covered
            </span>
          )}
        </div>

        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">₹{space.hourlyRate}</span>
            <span className="text-gray-500 text-sm">/hour</span>
          </div>
          {space.dailyRate && (
            <div className="text-right">
              <span className="text-gray-600 font-medium">₹{space.dailyRate}</span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
