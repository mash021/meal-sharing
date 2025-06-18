export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/data/meal-sharing.db",
    },
    useNullAsDefault: true,
  },
};
