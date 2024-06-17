import unittest
from app import create_app

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app().test_client()
        self.app.testing = True

    def test_post_sensor_data(self):
        response = self.app.post('/api/sensor/sensor1', json={"value": 512, "actief": True, "error": 0})
        self.assertEqual(response.status_code, 201)
        self.assertIn('success', response.get_json()['status'])

    def test_get_sensor_data(self):
        self.app.post('/api/sensor/sensor1', json={"value": 512, "actief": True, "error": 0})
        self.app.post('/api/sensor/sensor2', json={"value": 300, "actief": False, "error": 1})
        response = self.app.get('/api/sensor')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertIn('sensor1', data)
        self.assertIn('sensor2', data)
        self.assertEqual(len(data['sensor1']), 1)
        self.assertEqual(len(data['sensor2']), 1)
        self.assertEqual(data['sensor1'][0]['value'], 512)
        self.assertEqual(data['sensor1'][0]['actief'], True)
        self.assertEqual(data['sensor1'][0]['error'], 0)
        self.assertEqual(data['sensor2'][0]['value'], 300)
        self.assertEqual(data['sensor2'][0]['actief'], False)
        self.assertEqual(data['sensor2'][0]['error'], 1)

if __name__ == '__main__':
    unittest.main()
