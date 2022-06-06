from django.test import TestCase
from datetime import datetime, timedelta
import json

from .models import Note


def shortenTime(time):
    time.split('.')
    return time[0]


class NotesTest(TestCase):
    def test_get_notes(self):
        """Test the GET request."""
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
