#!/usr/bin/env python3
"""
Create sample testimonials for testing
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api"

def create_sample_testimonials():
    print("🌟 Creating sample testimonials...")
    
    sample_testimonials = [
        {
            "name": "Alex Rodriguez",
            "email": "alex.r@techstartup.com",
            "company": "TechStartup Inc",
            "role": "Founder & CEO",
            "message": "This platform transformed our business completely. We went from struggling with content management to having a professional website that converts visitors into customers. The drag-and-drop builder is intuitive, and the customization options are endless. Highly recommended!",
            "rating": 5
        },
        {
            "name": "Maria Garcia",
            "email": "maria@creativeagency.com",
            "company": "Creative Solutions Agency",
            "role": "Creative Director",
            "message": "As a creative professional, I'm very particular about design and user experience. This platform exceeded my expectations. The templates are modern, the interface is clean, and I can create stunning websites for my clients in half the time it used to take.",
            "rating": 5
        },
        {
            "name": "David Chen",
            "email": "david.chen@ecommerce.com",
            "company": "E-Commerce Plus",
            "role": "Marketing Manager",
            "message": "We needed a robust e-commerce solution that could handle our growing product catalog. This platform delivered exactly what we needed. The product management features are comprehensive, and the checkout process is smooth. Our sales have increased by 40% since switching.",
            "rating": 4
        },
        {
            "name": "Jennifer Smith",
            "email": "jen@bloggerlife.com",
            "company": "Blogger Life",
            "role": "Content Creator",
            "message": "I've tried many blogging platforms, but this one stands out. The content editor is powerful yet easy to use, and the SEO features help my posts rank better in search results. The analytics dashboard gives me insights I never had before.",
            "rating": 5
        },
        {
            "name": "Michael Johnson",
            "email": "mike@restaurantchain.com",
            "company": "Gourmet Restaurant Chain",
            "role": "Operations Manager",
            "message": "Managing multiple restaurant websites was a nightmare until we found this platform. Now we can update menus, manage locations, and handle online orders from one central dashboard. It's been a game-changer for our business operations.",
            "rating": 4
        },
        {
            "name": "Lisa Wang",
            "email": "lisa@portfoliodesign.com",
            "company": "Portfolio Design Studio",
            "role": "UX Designer",
            "message": "The portfolio templates are absolutely gorgeous. I was able to showcase my work in a way that truly represents my brand. The responsive design ensures my portfolio looks perfect on all devices. Client inquiries have tripled since launching my new site.",
            "rating": 5
        },
        {
            "name": "Robert Taylor",
            "email": "robert@consultingfirm.com",
            "company": "Business Consulting Firm",
            "role": "Senior Consultant",
            "message": "Professional, reliable, and feature-rich. This platform helped us establish a strong online presence that reflects our expertise. The contact forms and lead management features have streamlined our client acquisition process significantly.",
            "rating": 4
        },
        {
            "name": "Emma Wilson",
            "email": "emma@nonprofitorg.org",
            "company": "Community Nonprofit",
            "role": "Executive Director",
            "message": "Even with a limited budget, we were able to create a professional website that helps us reach more people in our community. The donation integration and event management features are exactly what we needed. Thank you for making this accessible!",
            "rating": 5
        }
    ]
    
    created_count = 0
    for i, testimonial in enumerate(sample_testimonials, 1):
        print(f"\n{i}. Creating testimonial from {testimonial['name']}...")
        
        try:
            response = requests.post(f"{BASE_URL}/testimonials/", json=testimonial)
            if response.status_code == 201:
                print(f"✅ Created testimonial from {testimonial['name']}")
                created_count += 1
            else:
                print(f"❌ Failed to create testimonial: {response.status_code}")
                print(f"Error: {response.text}")
        except requests.exceptions.ConnectionError:
            print("❌ Could not connect to the API. Make sure the Django server is running on localhost:8000")
            return
        except Exception as e:
            print(f"❌ Error creating testimonial: {e}")
    
    print(f"\n🎉 Successfully created {created_count} sample testimonials!")
    
    # Now let's feature a few testimonials
    print("\n⭐ Featuring some testimonials...")
    feature_ids = [1, 3, 6, 8]  # Feature testimonials with these IDs
    
    for testimonial_id in feature_ids:
        try:
            # Note: This requires authentication, so it might fail
            # In a real scenario, you'd need to authenticate first
            response = requests.post(f"{BASE_URL}/testimonials/{testimonial_id}/feature/")
            if response.status_code == 200:
                print(f"✅ Featured testimonial #{testimonial_id}")
            else:
                print(f"⚠️ Could not feature testimonial #{testimonial_id} (requires admin authentication)")
        except Exception as e:
            print(f"⚠️ Could not feature testimonial #{testimonial_id}: {e}")
    
    print("\n🌟 Sample testimonials creation completed!")

if __name__ == "__main__":
    create_sample_testimonials()