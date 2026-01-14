const app = require('./app');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
app.use(cors());
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
