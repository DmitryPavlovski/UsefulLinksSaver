from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse, resolve
from .models import Link, GroupLinks
import json

class LinkViewTestCase(APITestCase):
    """Test suite for the link api views."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()
        self.link_data = { 'title': 'Test link', 'description': 'Test description', 'groupId':None}

    def test_api_can_get_link_list(self):
        """Test on get links api method."""
        old_get_response = self.client.get(
            '/api/links',
            follow=True)
        
        Link.objects.create(
            title=self.link_data['title'],
            description=self.link_data['description'],
            groupId=self.link_data['groupId'])
        
        new_get_response = self.client.get(
            '/api/links',
            follow=True)
        self.assertNotEqual(len(old_get_response.data), len(new_get_response.data))

    def test_api_can_create_link(self):
        """Test the api can create new link."""        
        old_count = len(Link.objects.all())
        response_insert = self.client.post(
            '/api/links/',
            data=json.dumps(self.link_data),
            follow=True,
            content_type='application/json')
        new_count = len(Link.objects.all())
        self.assertEqual(response_insert.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(old_count, new_count)

    def test_api_can_update_link(self):
        """Test the api can update a link"""
        link = Link.objects.create(
            title=self.link_data['title'],
            description=self.link_data['description'],
            groupId=self.link_data['groupId'])

        new_link_data = {}
        new_link_data['title'] = 'New test title'

        response_update = self.client.put(
            '/api/links/{}/'.format(link.id),
            data=json.dumps(new_link_data),
            follow=True,
            content_type='application/json')        
        updated_link = Link.objects.get(id=link.id)

        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
        self.assertEqual(link.title, self.link_data['title'])
        self.assertEqual(updated_link.title, new_link_data['title'])
        self.assertNotEqual(updated_link.title, link.title)

    def test_api_can_delete_link(self):
        """Test the api can delete a link"""
        link = Link.objects.create(
            title=self.link_data['title'],
            description=self.link_data['description'],
            groupId=self.link_data['groupId'])

        old_count = len(Link.objects.all())

        response_delete = self.client.delete(
            '/api/links/{}/'.format(link.id),            
            follow=True)

        new_count = len(Link.objects.all())

        self.assertEqual(response_delete.status_code, status.HTTP_204_NO_CONTENT)
        self.assertNotEqual(old_count, new_count)
