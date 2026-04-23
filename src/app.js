const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const postRoutes = require("./routes/postRoutes");

const commentRoutes = require("./routes/commentRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "Blogify API est en ligne" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);

app.use("/posts", postRoutes);

app.use("/comments", commentRoutes);

module.exports = app;
