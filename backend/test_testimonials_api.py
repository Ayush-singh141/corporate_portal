#!/usr/bin/env python3
"""
Test script for Testimonials API
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api"

def test_testimonials_api():
    print("🧪 Testing Testimonials API...")
    
    # Test 1: Create a new testimonial
    print("\n1. Creating a new testimonial...")
    testimonial_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "company": "Tech Solutions Inc",
        "role": "CEO",
        "message": "This platform has revolutionized how we manage our content. The interface is intuitive and the features are exactly what we needed for our business.",
        "rating": 5
    }
    
    try:
        response = requests.post(f"{BASE_URL}/testimonials/", json=testimonial_data)
        if response.status_code == 201:
            print("✅ Testimonial created successfully!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Failed to create testimonial: {response.status_code}")
            print(f"Error: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the Django server is running on localhost:8000")
        return
    
    # Test 2: Get all testimonials
    print("\n2. Fetching all testimonials...")
    try:
        response = requests.get(f"{BASE_URL}/testimonials/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} testimonials")
            print(f"Page {data['page']} of {data['totalPages']}")
            if data['testimonials']:
                print("First testimonial:")
                first = data['testimonials'][0]
                print(f"  - {first['name']} ({first['rating']} stars): {first['message'][:50]}...")
        else:
            print(f"❌ Failed to fetch testimonials: {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching testimonials: {e}")
    
    # Test 3: Get featured testimonials
    print("\n3. Fetching featured testimonials...")
    try:
        response = requests.get(f"{BASE_URL}/testimonials/featured/?limit=3")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} featured testimonials")
            for testimonial in data['testimonials']:
                print(f"  - {testimonial['name']}: {testimonial['rating']} stars")
        else:
            print(f"❌ Failed to fetch featured testimonials: {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching featured testimonials: {e}")
    
    # Test 4: Create another testimonial with different data
    print("\n4. Creating another testimonial...")
    testimonial_data_2 = {
        "name": "Sarah Johnson",
        "email": "sarah.j@example.com",
        "company": "Creative Agency",
        "role": "Marketing Director",
        "message": "Amazing platform! We've been able to create beautiful websites for our clients in record time. The customization options are endless.",
        "rating": 4
    }
    
    try:
        response = requests.post(f"{BASE_URL}/testimonials/", json=testimonial_data_2)
        if response.status_code == 201:
            print("✅ Second testimonial created successfully!")
        else:
            print(f"❌ Failed to create second testimonial: {response.status_code}")
    except Exception as e:
        print(f"❌ Error creating second testimonial: {e}")
    
    # Test 5: Test validation (invalid rating)
    print("\n5. Testing validation with invalid rating...")
    invalid_data = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "Short",  # Too short
        "rating": 6  # Invalid rating
    }
    
    try:
        response = requests.post(f"{BASE_URL}/testimonials/", json=invalid_data)
        if response.status_code == 400:
            print("✅ Validation working correctly - rejected invalid data")
            print(f"Errors: {response.json()}")
        else:
            print(f"❌ Validation not working - accepted invalid data: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing validation: {e}")
    
    print("\n🎉 Testimonials API testing completed!")

if __name__ == "__main__":
    test_testimonials_api()