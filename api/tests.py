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

    def test_put_notes(self):
        """Test that notes matching the given id are updated with new data."""
        # Add note
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': 'Lorem ipsum...',
        }),
            content_type='application/json')
        self.assertEquals(res.status_code, 201)
        id1 = json.loads(res.content)['id']

        # Get yesterday's date and time
        yesterday = datetime.now(tz=timezone.utc) - timedelta(1)

        # Force update on note 'created_at' DateTimeField
        # This simulates that the note was created yesterday
        note = Note.objects.get(id=id1)
        Note.objects.filter(pk=note.pk).update(created_at=yesterday)

        # Update note
        res = self.client.put(f'/api/notes/{id1}/', data=json.dumps({
            'body': 'This is my updated note!'
        }),
            content_type='application/json')
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)
        self.assertEquals(result['body'], 'This is my updated note!')

        # Test GET request for updated item
        res = self.client.get(
            f'/api/notes/{id1}/', content_type='application/json')
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)
        self.assertEquals(result['body'], 'This is my updated note!')
        self.assertEquals(result['created_at'],
                          yesterday.strftime('%Y-%m-%dT%H:%M:%S'))
        self.assertEquals(result['updated'], getCurrentTime())

    def test_delete_note(self):
        """Test that notes matching the given id are deleted."""
        # Add note
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': 'Hello world.',
        }),
            content_type='application/json')
        self.assertEquals(res.status_code, 201)
        id1 = json.loads(res.content)['id']

        # Delete note
        res = self.client.delete(
            f'/api/notes/{id1}/', content_type='application/json')
        self.assertEquals(res.status_code, 410)

        res = self.client.get(
            f'/api/notes/{id1}/', content_type='application/json')
        self.assertEquals(res.status_code, 404)
