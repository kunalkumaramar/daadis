import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManufacturerByCode, clearManufacturer } from '../../redux1/manufacturerSlice';
import { RootState, AppDispatch } from '../../redux1/store';
import { Search } from 'lucide-react';

export const Manufacturer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { manufacturer, loading, error } = useSelector(
    (state: RootState) => state.manufacturer
  );
  const [code, setCode] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      dispatch(getManufacturerByCode(code.trim()));
    }
  };

  const handleClear = () => {
    setCode('');
    dispatch(clearManufacturer());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] font-quicksand text-black">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl transform transition-all duration-500 ease-in-out hover:scale-[1.02]">
          {/* Search Section */}
          <div className="text-center mb-8 animate-slideDown">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 drop-shadow-md">
              Manufacturer Lookup
            </h1>
            <p className="text-black opacity-80">
              Enter the manufacturer code to view details
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative group">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ENTER THE CODE"
                className="w-full px-6 py-4 text-lg border-2 border-black rounded-lg focus:outline-none focus:border-white transition-all duration-300 ease-in-out pr-12 bg-white shadow-lg hover:shadow-xl group-hover:bg-white/90"
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg hover:bg-white hover:text-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-110 group-hover:rotate-12"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12 animate-pulse">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black bg-white p-4 shadow-lg"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center shadow-xl animate-bounceOnce">
              <div className="text-black font-bold mb-2">Error</div>
              <p className="text-black">{error}</p>
              <button
                onClick={handleClear}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Result Card */}
          {manufacturer && !loading && (
            <div className="bg-white border-2 border-black rounded-lg shadow-2xl p-8 animate-slideUp fade-in">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">
                  Manufacturer Details
                </h2>
                <button
                  onClick={handleClear}
                  className="text-sm text-black hover:text-white hover:bg-black px-3 py-1 rounded transition-all duration-300 ease-in-out transform hover:scale-110 underline"
                >
                  Clear
                </button>
              </div>
              
              <div className="bg-[#fef9c3] rounded-lg p-6 border border-black">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 animate-pulse">
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-bold text-black mb-2">
                      Address
                    </h3>
                    <p className="text-black leading-relaxed">
                      {manufacturer.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-black">
                <div className="flex items-center gap-2 text-sm text-black">
                  <span className="font-bold">Code:</span>
                  <span className="bg-black text-white px-3 py-1 rounded">
                    {code}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!manufacturer && !loading && !error && (
            <div className="text-center py-12 text-black opacity-60 animate-fadeIn">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50 transition-transform duration-500 hover:rotate-12 hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>Enter a code to search for manufacturer details</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceOnce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-bounceOnce {
          animation: bounceOnce 1s ease-in-out;
        }
        @font-face {
          font-family: 'Quicksand';
          src: url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        }
        .font-quicksand {
          font-family: 'Quicksand', sans-serif;
        }
      `}</style>
    </div>
  );
};