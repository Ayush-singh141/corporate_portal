from django.contrib import admin
from .models import User, Website, BlogPost, Product, Order, Cart, Testimonial

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'firstName', 'lastName', 'isVerified', 'createdAt']
    list_filter = ['isVerified', 'createdAt']
    search_fields = ['email', 'firstName', 'lastName']

@admin.register(Website)
class WebsiteAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'user', 'category', 'status', 'createdAt']
    list_filter = ['category', 'status', 'createdAt']
    search_fields = ['name', 'slug', 'user__email']

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'website', 'author', 'status', 'publishDate']
    list_filter = ['status', 'publishDate', 'createdAt']
    search_fields = ['title', 'author', 'website__name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'website', 'price', 'category', 'status', 'inventory']
    list_filter = ['category', 'status', 'createdAt']
    search_fields = ['name', 'sku', 'website__name']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'websiteName', 'customerName', 'customerEmail', 'total', 'status', 'createdAt']
    list_filter = ['status', 'createdAt']
    search_fields = ['customerName', 'customerEmail', 'websiteName']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'product_name', 'quantity', 'websiteName', 'addedAt']
    list_filter = ['addedAt', 'websiteName']
    search_fields = ['user__email', 'product_name']

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'company', 'rating', 'status', 'is_featured', 'createdAt']
    list_filter = ['status', 'is_featured', 'rating', 'createdAt']
    search_fields = ['name', 'email', 'company', 'message']
    list_editable = ['status', 'is_featured']
    readonly_fields = ['createdAt', 'updatedAt']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'email', 'company', 'role', 'avatar')
        }),
        ('Testimonial Content', {
            'fields': ('message', 'rating')
        }),
        ('Admin Settings', {
            'fields': ('status', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('createdAt', 'updatedAt'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_testimonials', 'feature_testimonials', 'unfeature_testimonials']
    
    def approve_testimonials(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} testimonials were approved.')
    approve_testimonials.short_description = "Approve selected testimonials"
    
    def feature_testimonials(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} testimonials were featured.')
    feature_testimonials.short_description = "Feature selected testimonials"
    
    def unfeature_testimonials(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} testimonials were unfeatured.')
    unfeature_testimonials.short_description = "Unfeature selected testimonials"
