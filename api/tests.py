"""Testing HTTP methods to the API."""

from django.test import TestCase
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import Note


def getCurrentTime():
    """Get current timezone and stringify to appropriate format."""
    return datetime.now(tz=timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')


class NotesTest(TestCase):
    """Test GET, POST, PUT and DELETE requests for notes API."""

    def test_add_note(self):
        """Test the POST request for adding new notes."""
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': 'Hello world',
        }),
            content_type='application/json',
        )
        self.assertEquals(res.status_code, 201)

        result = json.loads(res.content)
        self.assertEquals(result['body'], 'Hello world')
        self.assertEquals(result['updated'], getCurrentTime())
        self.assertEquals(result['created_at'], getCurrentTime())

    def test_add_note_invalid(self):
        """Do not allow notes with invalid data to be created."""
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': '',
        }),
            content_type='application/json',
        )
        self.assertEquals(res.status_code, 400)

    def test_get_notes(self):
        """Test the GET request for all notes."""
        # Add first note
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': 'Hello world',
        }),
            content_type='application/json')
        self.assertEquals(res.status_code, 201)
        id1 = json.loads(res.content)['id']

        # Add second note
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': 'Lorem ipsum...',
        }),
            content_type='application/json')
        self.assertEquals(res.status_code, 201)
        id2 = json.loads(res.content)['id']

        # Test GET request for both items
        res = self.client.get('/api/notes/', content_type='application/json')
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)
        self.assertEquals(len(result), 2)
        self.assertTrue(result[0]['id'] == id1 or result[1]['id'] == id1)
        self.assertTrue(result[0]['id'] == id2 or result[1]['id'] == id2)

    def test_get_single_note(self):
        """Test the GET request for single note."""
        # Add note
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': 'Hello world',
        }),
            content_type='application/json')
        self.assertEquals(res.status_code, 201)
        id1 = json.loads(res.content)['id']

        # Test GET request for individual item
        res = self.client.get(
            f'/api/notes/{id1}/', content_type='application/json')
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)
        self.assertEquals(result['body'], 'Hello world')
        self.assertEquals(result['updated'], getCurrentTime())
        self.assertEquals(result['created_at'], getCurrentTime())
