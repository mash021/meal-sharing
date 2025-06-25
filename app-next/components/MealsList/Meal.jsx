import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

const imageMap = {
  1: "/images/gheymeh.jpg",
  2: "/images/kabab.jpg",
  3: "/images/zereshk.jpg",
  4: "/images/fesenjan.jpg",
  5: "/images/ash.jpeg",
  6: "/images/baghali.jpg",
};

const Meal = ({ meal }) => {
  const imageUrl = imageMap[meal.id] || "/images/default.jpg";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={meal.title}
        sx={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {meal.title}
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {meal.description}
          </Typography>
        </Box>

        <Typography variant="subtitle1" color="primary" mt={2}>
          {meal.price} DKK
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Meal;