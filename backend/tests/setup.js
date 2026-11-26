process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_change_me';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5500';
process.env.MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/placement_test';
