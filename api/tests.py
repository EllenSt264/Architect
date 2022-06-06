from django.test import TestCase
from datetime import datetime, timedelta
import json

from .models import Note


def shortenTime(time):
    time.split('.')
    return time[0]


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
        self.assertEquals(shortenTime(result['updated']), shortenTime(
            datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')))
        self.assertEquals(shortenTime(result['created_at']), shortenTime(
            datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')))

    def test_add_note_invalid(self):
        """Do not allow notes with invalid data to be created."""
        res = self.client.post('/api/notes/', data=json.dumps({
            'body': '',
        }),
            content_type='application/json',
        )
        self.assertEquals(res.status_code, 400)
