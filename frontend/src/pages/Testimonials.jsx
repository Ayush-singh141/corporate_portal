import React, { useState, useEffect } from 'react';
import { Star, Plus, Quote, Calendar, User, Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import testimonialService from '../services/testimonialService';
import AddTestimonialModal from '../components/ui/AddTestimonialModal';

const Testimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTestimonials, setTotalTestimonials] = useState(0);

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      const response = await testimonialService.getTestimonials(page, 12);
      setTestimonials(response.testimonials || []);
      setTotalPages(response.totalPages || 1);
      setTotalTestimonials(response.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
      // Fallback to empty array for better UX
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTestimonialAdded = () => {
    // Refresh testimonials after adding new one
    fetchTestimonials(currentPage);
  };

  const handlePageChange = (page) => {
    fetchTestimonials(page);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Customer Testimonials</h1>
                <p className="text-slate-600 mt-2">
                  {totalTestimonials > 0 
                    ? `${totalTestimonials} genuine experiences from our community`
                    : 'Share your experience with our platform'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleAddTestimonial}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your Experience
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchTestimonials(currentPage)}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {testimonials.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Quote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No testimonials yet</h3>
            <p className="text-slate-600 mb-6">Be the first to share your experience!</p>
            <button
              onClick={handleAddTestimonial}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your Experience
            </button>
          </div>
        ) : (
          <>
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <Quote className="w-8 h-8 text-slate-300" />
                    <div className="flex items-center">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="mb-6">
                    <p className="text-slate-700 leading-relaxed">
                      "{testimonial.message}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                      {testimonial.avatar ? (
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                      <div className="flex items-center text-sm text-slate-500 space-x-2">
                        {testimonial.role && (
                          <>
                            <span>{testimonial.role}</span>
                            {testimonial.company && <span>•</span>}
                          </>
                        )}
                        {testimonial.company && (
                          <div className="flex items-center">
                            <Building2 className="w-3 h-3 mr-1" />
                            <span>{testimonial.company}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-slate-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(testimonial.createdAt || testimonial.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Testimonial Modal */}
      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleTestimonialAdded}
      />
    </div>
  );
};

export default Testimonials;