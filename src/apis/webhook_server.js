import express from 'express';
import axios from 'axios';
import multer from 'multer';
const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Giả sử bạn có một endpoint API để lấy danh sách tài khoản
const externalApiUrl = 'http://10.91.13.112/on-premise/v1/live/agent';

// Endpoint để xử lý yêu cầu từ client
app.post('/on-premise/v1/live/agent', async (req, res) => {
  // Lấy thông tin token từ headers
  const token = req.headers.authorization?.split(' ')[1];

  // Lấy tham số từ form-data
  const agent_id = req.body.param1;
  const command = req.body.param2;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const form = new FormData();
    form.append('agent_id', agent_id);
    form.append('command', command);
    // Gửi yêu cầu đến API bên ngoài với token
    const response = await axios.get(externalApiUrl, {
      headers: {
        //...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
    // Trả về dữ liệu từ API bên ngoài cho client
    res.status(200).json("Success");
  } catch (error) {
    // Xử lý lỗi và trả về lỗi cho client
    console.error('Error fetching data from external API:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});