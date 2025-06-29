const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const PATENT_API_URL = 'https://api.patentsview.org/patents/query';

app.get('/api/patents', async (req, res) => {
  const { company } = req.query;
  if (!company) {
    return res.status(400).json({ error: 'company query param required' });
  }

  try {
    const query = { _text_any: { patent_title: company } };
    const fields = ['patent_number', 'patent_title', 'patent_date'];

    const response = await axios.get(PATENT_API_URL, {
      params: {
        q: JSON.stringify(query),
        f: JSON.stringify(fields),
        o: JSON.stringify({ per_page: 5 })
      }
    });

    const patents = (response.data.patents || []).map(p => ({
      number: p.patent_number,
      title: p.patent_title,
      date: p.patent_date
    }));

    res.json({ patents });
  } catch (err) {
    console.error('Error fetching patents:', err.message);
    res.status(500).json({ error: 'Failed to fetch patents' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
