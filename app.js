// app.js

require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/ask', async (req, res) => {
  try {
    const userQuestion = req.body.question;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        messages: [{ role: 'user', content: 'Provide a gift or set of gifts that is personalised using the following details. The person providing the information is the person purchasing the gift. Use currency and gifts appropriate to the location used. The name provided is the name of the receipient, so use that in your response. If you noticed the input seems different to what you would expect, ask them to re-enter. Dont suggest personalised mugs. Use spelling and grammar appropriate to UK/British english. Dont repeat what the user has entered in the form directly, make it seem like youve thought about the solution. Here is the criteria:' + userQuestion }],
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const responseData = response.data;
    if (
      responseData &&
      responseData.choices &&
      responseData.choices[0] &&
      responseData.choices[0].message
    ) {
      res.json({ answer: responseData.choices[0].message.content });
    } else {
      res.json({ error: 'Response data is not in the expected format' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

