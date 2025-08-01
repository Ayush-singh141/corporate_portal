import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { WebsiteCartProvider, useWebsiteCart } from '../contexts/WebsiteCartContext'
import { CustomerAuthProvider } from '../contexts/CustomerAuthContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import WebsiteHeader from '../components/website/WebsiteHeader'
import { websiteService } from '../services/websiteService'
import { blogService } from '../services/blogService'
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Search,
  Clock
} from 'lucide-react'



function UserBlogsContent() {
  const { slug } = useParams()
  const { state, dispatch } = useApp()
  const { setWebsiteInfo } = useWebsiteCart()
  const [website, setWebsite] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [slug])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load website data from API
      const websiteResult = await websiteService.getWebsiteBySlug(slug)
      
      if (!websiteResult.success) {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
        setLoading(false)
        return
      }

      const websiteData = websiteResult.data

      // Only show published websites
      if (websiteData.status !== 'published') {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
        setLoading(false)
        return
      }

      // Load blogs for this website from API
      const blogsResult = await blogService.getBlogsByWebsiteSlug(slug)
      const websiteBlogs = blogsResult.success ? 
        blogsResult.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []

      console.log('Website found:', websiteData)
      console.log('Blogs found:', websiteBlogs)

      setWebsite(websiteData)
      setBlogs(websiteBlogs)

      // Set website info in cart context
      setWebsiteInfo({
        slug: websiteData.slug,
        id: websiteData.id,
        name: websiteData.name
      })
    } catch (error) {
      console.error('Error loading blogs:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load blogs' })
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
  )
  useEffect(() => {
    console.log('Filtered blogs:', blogs)
  }, [blogs])


  const renderBlogCard = (blog) => {
    // For traditional card layout, use customizations.layout for the specific layout type
    // For hover-overlay, use the layout field
    const isHoverOverlay = blog.layout === 'hover-overlay'
    const layout = isHoverOverlay ? 'hover-overlay' : (blog.customizations?.layout || 'column')

    // Render hover overlay layout
    if (layout === 'hover-overlay') {
      return (
        <article
          key={blog.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
        >
          {/* Large Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={blog.featuredImage || 'https://via.placeholder.com/600x400/gray/white?text=Blog+Post'}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Always Visible Content - Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-white line-clamp-2">
                {blog.title}
              </h3>
              
              <div className="flex items-center text-xs text-gray-300 mb-3">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(blog.createdAt).toLocaleDateString()}
                {blog.author && (
                  <>
                    <User className="h-3 w-3 ml-3 mr-1" />
                    {blog.author}
                  </>
                )}
              </div>
            </div>

            {/* Hover Overlay - Additional Content */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {/* Blog Description/Excerpt */}
                {blog.excerpt && (
                  <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-3 max-w-md">
                    {blog.excerpt}
                  </p>
                )}

                {/* Read More Button */}
                <Link
                  to={`/${slug}/blogs/${blog.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full hover:bg-white/30 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read More
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Link>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4 justify-center">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="text-xs text-gray-300">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      )
    }

    // Render regular card layout
    return (
      <article
        key={blog.id}
        className={`bg-white rounded-lg shadow-sm w-fit border overflow-hidden hover:shadow-lg transition-shadow ${layout === 'column' ? '' : 'flex'
          }`}
        style={{ borderColor: website.customizations.colors.secondary + '30' }}
      >
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className={
            layout === 'column'
              ? 'aspect-w-16 aspect-h-9'
              : layout === 'row-image-left'
                ? 'w-1/3 flex-shrink-0'
                : 'w-1/3 flex-shrink-0 order-2'
          }>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className={`object-cover ${layout === 'column' ? 'w-full h-48 ' : 'w-full h-full'
                }`}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className={`p-6 ${layout !== 'column' ? 'flex-1' : ''}`}>
          <h2 className="text-xl font-bold mb-3">
            <Link
              to={`/${slug}/blogs/${blog.slug}`}
              className="hover:opacity-75 transition-opacity"
              style={{ color: website.customizations.colors.primary }}
            >
              {blog.title}
            </Link>
          </h2>

          {blog.excerpt && (
            <p
              className="mb-4 line-clamp-3"
              style={{ color: website.customizations.colors.text }}
            >
              {blog.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4" style={{ color: website.customizations.colors.secondary }}>
            {blog.customizations?.showAuthor && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{blog.author}</span>
              </div>
            )}

            {blog.customizations?.showDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            )}

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
            </div>
          </div>

          {/* Tags */}
          {blog.customizations?.showTags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: website.customizations.colors.primary + '20',
                    color: website.customizations.colors.primary
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Link */}
          <Link
            to={`/${slug}/blogs/${blog.slug}`}
            className="inline-flex items-center font-medium hover:opacity-75 transition-opacity"
            style={{ color: website.customizations.colors.primary }}
          >
            Read More →
          </Link>
        </div>
      </article>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Website not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: website.customizations.colors.background,
        color: website.customizations.colors.text,
        fontFamily: website.customizations.typography.bodyFont
      }}
    >
      {/* Header */}
      <WebsiteHeader website={website} slug={slug} currentPage="blogs" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to={`/${slug}`}
            className="hover:opacity-75 transition-opacity inline-flex items-center"
            style={{ color: website.customizations.colors.primary }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: website.customizations.colors.primary,
              fontFamily: website.customizations.typography.headingFont
            }}
          >
            Our Blog
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: website.customizations.colors.secondary }}
          >
            Stay updated with our latest news, insights, and stories from {website.name}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: website.customizations.colors.secondary }} />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{
                borderColor: website.customizations.colors.secondary + '40',
                '--tw-ring-color': website.customizations.colors.primary
              }}
            />
          </div>
        </div>

        {/* Blog Posts */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: website.customizations.colors.secondary + '20' }}
            >
              <Search className="h-12 w-12" style={{ color: website.customizations.colors.secondary }} />
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: website.customizations.colors.text }}
            >
              {blogs.length === 0 ? 'No blog posts yet' : 'No posts found'}
            </h3>
            <p style={{ color: website.customizations.colors.secondary }}>
              {blogs.length === 0
                ? 'Check back soon for our latest updates and insights.'
                : 'Try adjusting your search terms.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBlogs.map(blog => renderBlogCard(blog))}
          </div>
        )}

        {/* Blog Stats */}
        {blogs.length > 0 && (
          <div className="mt-16 text-center">
            <div
              className="inline-flex items-center px-6 py-3 rounded-lg"
              style={{ backgroundColor: website.customizations.colors.primary + '10' }}
            >
              <span style={{ color: website.customizations.colors.primary }}>
                {filteredBlogs.length} of {blogs.length} posts
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="py-12 border-t mt-16"
        style={{
          backgroundColor: website.customizations.colors.secondary + '10',
          borderColor: website.customizations.colors.secondary + '30'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ color: website.customizations.colors.secondary }}>
            © 2024 {website.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Main UserBlogs component with cart and customer auth providers
function UserBlogs() {
  const { slug } = useParams()
  
  return (
    <CustomerAuthProvider websiteSlug={slug}>
      <WebsiteCartProvider websiteSlug={slug}>
        <UserBlogsContent />
      </WebsiteCartProvider>
    </CustomerAuthProvider>
  )
}

export default UserBlogs