import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // var re = await pool.query("SELECT NOW()");
    // console.log(re.rows[0]);
    // console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer().finally(async () => {});
